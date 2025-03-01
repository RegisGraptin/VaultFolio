import Vault from "@/abi/Vault.json";
import Manager from "@/abi/Manager.json";

import { useReadContract, useReadContracts } from "wagmi";
import { Abi, Address, erc20Abi, getAddress } from "viem";
import { useEffect, useMemo, useState } from "react";
import { DEBT_TOKENS, LENDING_TOKENS, TOKEN_ASSETS } from "../tokens/tokens";
import { useOracle } from "./oracle";
import { tokenToUSD } from "../tokens/balance";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";
import AAVEPool from "@/abi/Pool.json";
import { ReserveDataLegacy } from "./aave";

export function useVault<TFunctionName extends string>(
  vaultAddress: Address | string | undefined,
  functionName: TFunctionName,
  args?: any[]
) {
  return useReadContract({
    address: getAddress(vaultAddress!),
    abi: Vault.abi,
    functionName,
    args,
    query: {
      enabled: !!vaultAddress, // Only enable when address exists
    },
  });
}

export function useListVaults(userAddress: Address | string | undefined) {
  return useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_MANAGER_ADDRESS!),
    abi: Manager.abi,
    functionName: "getVaults",
    args: [userAddress],
    query: {
      enabled: !!userAddress, // Only enable when address exists
    },
  });
}

export const usePortfolioValue = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: addressPriceOracle, isLoading: isLoadingOracleAddress } =
    useOracle("getPriceOracle");

  const tokenAddresses = Object.keys(TOKEN_ASSETS);
  const { data: tokenBalances } = useReadContracts({
    query: {
      enabled: !!vaultAddress,
    },
    contracts: tokenAddresses.map((tokenAddress) => ({
      abi: erc20Abi,
      address: getAddress(tokenAddress),
      functionName: "balanceOf",
      args: [vaultAddress],
    })),
  });

  const { data: tokenPrices } = useReadContracts({
    query: {
      enabled: !!addressPriceOracle,
    },
    contracts: tokenAddresses.map((tokenAddress) => ({
      address: addressPriceOracle
        ? getAddress(addressPriceOracle as string)
        : undefined,
      abi: IPriceOracle.abi as Abi,
      functionName: "getAssetPrice",
      args: [getAddress(tokenAddress)],
    })),
  });

  useEffect(() => {
    if (!tokenBalances || !tokenPrices) return;

    if (
      tokenBalances.every((b) => b.status === "success") &&
      tokenPrices.every((p) => p.status === "success")
    ) {
      let total = 0;

      tokenAddresses.forEach((address, index) => {
        const balance = tokenBalances[index].result;
        const price = tokenPrices[index].result;
        const decimals = TOKEN_ASSETS[address].decimals;

        if (balance && price) {
          total += tokenToUSD(
            {
              value: balance as bigint,
              decimals,
            },
            price as bigint
          );
        }
      });

      setTotalBalance(total);
      setIsLoading(false);
    }
  }, [tokenBalances, tokenPrices]);

  return { totalBalance, isLoading };
};

// export const usePortfolioLending = ({
//   vaultAddress,
// }: {
//   vaultAddress: Address;
// }) => {
//   const [totalLending, setTotalLending] = useState<number>(0);
//   const [computedInterest, setComputedInterest] = useState<number>(0.0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // const { data: reserveData } = useAave("getReserveData", [assetAddress]);

//   const { data: addressPriceOracle } = useOracle("getPriceOracle");
//   const tokenAddresses = Object.keys(LENDING_TOKENS);

//   const { data: tokenBalances } = useReadContracts({
//     query: {
//       enabled: !!vaultAddress,
//     },
//     contracts: tokenAddresses.map((tokenAddress) => ({
//       abi: erc20Abi,
//       address: getAddress(LENDING_TOKENS[tokenAddress].address),
//       functionName: "balanceOf",
//       args: [vaultAddress],
//     })),
//   });

//   const { data: tokenPrices } = useReadContracts({
//     query: {
//       enabled: !!addressPriceOracle,
//     },
//     contracts: tokenAddresses.map((tokenAddress) => ({
//       address: addressPriceOracle
//         ? getAddress(addressPriceOracle as string)
//         : undefined,
//       abi: IPriceOracle.abi as Abi,
//       functionName: "getAssetPrice",
//       args: [getAddress(tokenAddress)],
//     })),
//   });

//   useEffect(() => {
//     if (!tokenBalances || !tokenPrices) return;

//     if (
//       tokenBalances.every((b) => b.status === "success") &&
//       tokenPrices.every((p) => p.status === "success")
//     ) {
//       let total = 0;

//       tokenAddresses.forEach((address, index) => {
//         const balance = tokenBalances[index].result;
//         const price = tokenPrices[index].result;
//         const decimals = LENDING_TOKENS[address].decimals;

//         console.log(balance, price);

//         if (balance && price) {
//           total += tokenToUSD(
//             {
//               value: balance as bigint,
//               decimals,
//             },
//             price as bigint
//           );
//         }
//       });

//       setTotalLending(total);
//       setIsLoading(false);
//     }
//   }, [tokenBalances, computedInterest, tokenPrices]);

//   return { totalLending, isLoading };
// };

// export const usePortfolioBorrowing = ({
//   vaultAddress,
// }: {
//   vaultAddress: Address;
// }) => {
//   const [totalBorrowing, setTotalBorrowing] = useState<number>(0);
//   const [computedInterest, setComputedInterest] = useState<number>(0.0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const { data: addressPriceOracle } = useOracle("getPriceOracle");
//   const tokenAddresses = Object.keys(DEBT_TOKENS);

//   const { data: tokenBalances } = useReadContracts({
//     query: {
//       enabled: !!vaultAddress,
//     },
//     contracts: tokenAddresses.map((tokenAddress) => ({
//       abi: erc20Abi,
//       address: getAddress(DEBT_TOKENS[tokenAddress].address),
//       functionName: "balanceOf",
//       args: [vaultAddress],
//     })),
//   });

//   const { data: tokenPrices } = useReadContracts({
//     query: {
//       enabled: !!addressPriceOracle,
//     },
//     contracts: tokenAddresses.map((tokenAddress) => ({
//       address: addressPriceOracle
//         ? getAddress(addressPriceOracle as string)
//         : undefined,
//       abi: IPriceOracle.abi as Abi,
//       functionName: "getAssetPrice",
//       args: [getAddress(tokenAddress)],
//     })),
//   });

//   useEffect(() => {
//     if (!tokenBalances || !tokenPrices) return;

//     if (
//       tokenBalances.every((b) => b.status === "success") &&
//       tokenPrices.every((p) => p.status === "success")
//     ) {
//       let total = 0;

//       tokenAddresses.forEach((address, index) => {
//         const balance = tokenBalances[index].result;
//         const price = tokenPrices[index].result;
//         const decimals = DEBT_TOKENS[address].decimals;

//         if (balance && price) {
//           total += tokenToUSD(
//             {
//               value: balance as bigint,
//               decimals,
//             },
//             price as bigint
//           );
//         }
//       });

//       setTotalBorrowing(total);
//       setIsLoading(false);
//     }
//   }, [tokenBalances, computedInterest, tokenPrices]);

//   return { totalBorrowing, isLoading };
// };

const usePortfolio = ({
  vaultAddress,
  tokens,
  mode,
}: {
  vaultAddress: Address;
  tokens: Record<string, { address: string; decimals: number }>;
  mode: "lending" | "borrowing";
}) => {
  const [total, setTotal] = useState<number>(0);
  const [totalAPY, setTotalAPY] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: addressPriceOracle } = useOracle("getPriceOracle");
  const tokenAddresses = useMemo(() => Object.keys(tokens), [tokens]);

  const { data: tokenBalances } = useReadContracts({
    query: { enabled: !!vaultAddress },
    contracts: tokenAddresses.map((tokenAddress) => ({
      abi: erc20Abi,
      address: getAddress(tokens[tokenAddress].address),
      functionName: "balanceOf",
      args: [vaultAddress],
    })),
  });

  const { data: aaveTokenDetails } = useReadContracts({
    contracts: tokenAddresses.map((tokenAddress) => ({
      address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL!),
      abi: AAVEPool.abi as Abi,
      functionName: "getReserveData",
      args: [tokenAddress],
    })),
  });

  const { data: tokenPrices } = useReadContracts({
    query: { enabled: !!addressPriceOracle },
    contracts: tokenAddresses.map((tokenAddress) => ({
      address: addressPriceOracle
        ? getAddress(addressPriceOracle as string)
        : undefined,
      abi: IPriceOracle.abi as Abi,
      functionName: "getAssetPrice",
      args: [getAddress(tokenAddress)],
    })),
  });

  useEffect(() => {
    if (!tokenBalances || !tokenPrices) return;

    if (
      tokenBalances.every((b) => b.status === "success") &&
      tokenPrices.every((p) => p.status === "success")
    ) {
      let calculatedTotal = 0;
      let apyNumerator = 0;

      tokenAddresses.forEach((address, index) => {
        const balance = tokenBalances[index].result;
        const price = tokenPrices[index].result;
        const decimals = tokens[address].decimals;

        const aaveDetail = aaveTokenDetails![index].result as ReserveDataLegacy;

        let apy;
        if (mode == "lending") {
          const liquidityRate = aaveDetail.currentLiquidityRate;
          apy = Number(liquidityRate) / 1e25;
        } else if (mode == "borrowing") {
          const borrowRate = aaveDetail.currentVariableBorrowRate;
          apy = Number(borrowRate) / 1e25;
        } else {
          throw new Error("Invalid mode.");
        }

        if (balance && price) {
          const tokenValue = tokenToUSD(
            { value: balance as bigint, decimals },
            price as bigint
          );

          calculatedTotal += tokenValue;
          apyNumerator += tokenValue * apy;
        }
      });

      setTotal(calculatedTotal);
      setTotalAPY(calculatedTotal > 0 ? apyNumerator / calculatedTotal : 0);
      setIsLoading(false);
    }
  }, [tokenBalances, tokenPrices, tokenAddresses, tokens]);

  return { total, totalAPY, isLoading };
};

// Specific hooks
export const usePortfolioLending = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const { total, totalAPY, isLoading } = usePortfolio({
    vaultAddress,
    tokens: LENDING_TOKENS,
    mode: "lending",
  });
  return { totalLending: total, lendingAPY: totalAPY, isLoading };
};

export const usePortfolioBorrowing = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const { total, totalAPY, isLoading } = usePortfolio({
    vaultAddress,
    tokens: DEBT_TOKENS,
    mode: "borrowing",
  });
  return { totalBorrowing: total, borrowingAPY: totalAPY, isLoading };
};
