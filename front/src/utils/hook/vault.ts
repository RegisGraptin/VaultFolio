import Vault from "@/abi/Vault.json";
import Manager from "@/abi/Manager.json";

import { useReadContract, useReadContracts } from "wagmi";
import { Abi, Address, erc20Abi, getAddress } from "viem";
import { useEffect, useState } from "react";
import { TOKEN_ASSETS } from "../tokens/tokens";
import { useOracle } from "./oracle";
import { tokenToUSD } from "../tokens/balance";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";

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
