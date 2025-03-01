import Vault from "@/abi/Vault.json";
import Manager from "@/abi/Manager.json";

import {
  useBlockNumber,
  usePublicClient,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { Abi, Address, erc20Abi, getAddress } from "viem";
import { useEffect, useMemo, useState } from "react";
import {
  DEBT_TOKENS,
  LENDING_TOKENS,
  TOKEN_ASSETS,
  Token,
} from "../tokens/tokens";
import { useOracle, useOracleOnMultipleTokens } from "./oracle";
import { tokenToUSD } from "../tokens/balance";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";
import AAVEPool from "@/abi/Pool.json";
import { ReserveDataLegacy } from "./aave";
import { useQueries } from "@tanstack/react-query";

const SCROLL_BLOCK_TIME = 3; // 3s
const BLOCK_PER_DAY = Math.round((60 * 60 * 24) / SCROLL_BLOCK_TIME);

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


// FIXME: TB Remove ?
export const usePortfolioValue = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: addressPriceOracle, isLoading: isLoadingOracleAddress } =
    useOracle("getPriceOracle");

  const tokenAddresses = Object.keys(LENDING_TOKENS);
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
        const decimals = LENDING_TOKENS[address].decimals;

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

export const usePortfolioHistory = ({
  vaultAddress,
  tokens,
}: {
  vaultAddress: Address;
  tokens: Record<string, Token>
}) => {
  const { data: currentBlock } = useBlockNumber();
  const { data: tokenPrices } = useOracleOnMultipleTokens({ tokenAddresses: Object.keys(tokens) });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Generate historical block numbers (newest first)
  const blockNumbers = useMemo(() => {
    if (!currentBlock) return [];
    return Array.from(
      { length: 20 },
      (_, i) => currentBlock - BigInt(BLOCK_PER_DAY * (19 - i)) // Reverse order for easier processing
    ); // .reverse()
  }, [currentBlock]);

  // Create base contracts without block numbers
  const baseContracts = useMemo(
    () =>
      Object.values(tokens).map((token: Token) => ({
        abi: erc20Abi,
        address: getAddress(token.address),
        functionName: "balanceOf",
        args: [vaultAddress],
      })),
    [tokens, vaultAddress]
  );

  const publicClient = usePublicClient();

  // Fetch historical data for each block
  const historicalQueries = useQueries({
    queries: blockNumbers.map((blockNumber) => ({
      queryKey: ["portfolioHistory", vaultAddress, blockNumber.toString(), tokens],
      queryFn: async () => {
        // Use multicall for batch historical queries
        const results = await publicClient.multicall({
          blockNumber: blockNumber,
          contracts: baseContracts.map((c) => ({
            ...c,
          })),
        });

        return {
          blockNumber,
          balances: results.map((r) => r.result ?? BigInt(0)),
          timestamp: await publicClient
            .getBlock({ blockNumber })
            .then((b) => b.timestamp),
        };
      },
      enabled: !!vaultAddress && !!blockNumber,
      staleTime: Infinity,
    })),
  });

  const variation = Array(20).fill(0);

  // Process all historical data
  // const variation =
  useEffect(() => {
    if (!historicalQueries || !tokenPrices) return;

    // Check if all queries are completed and successful
    const allQueriesComplete = historicalQueries.every(
      (query) => !query.isLoading && !query.isError
    );
    const allPricesComplete = tokenPrices.every((price) => price.status === "success");

    if (!allQueriesComplete || !allPricesComplete) {
      setIsLoading(true);
      return;
    }

    
    // Filter successful queries and sort by block number
    const validResults = historicalQueries
      .filter((q) => q.isSuccess)
      .map((q) => q.data)
      .sort((a, b) => Number(a.blockNumber - b.blockNumber));

    // Calculate daily variations
    for (let i = 1; i < validResults.length; i++) {
      const current = validResults[i];
      const previous = validResults[i - 1];

      Object.values(tokens).forEach((token: Token, tokenIndex: number) => {
        const currentBalance = BigInt(current.balances[tokenIndex] || 0);
        const previousBalance = BigInt(previous.balances[tokenIndex] || 0);

        const balanceChange = currentBalance - previousBalance;

        const currentToken = Object.values(tokens)[tokenIndex];
        const decimals = currentToken.decimals;

        const price = tokenPrices[tokenIndex].result;
        

        if (balanceChange > BigInt(0)) {
          // Convert to USD using token price (implementation depends on your price source)

          const tokenValue = tokenToUSD(
            { value: BigInt(balanceChange), decimals },
            price as bigint
          );

          variation[i - 1] += tokenValue;
        }
      });

    }

    setIsLoading(false);
  }, [historicalQueries, tokenPrices]);

  return { variation, isLoading };
};






export const useMultiVaultPortfolioValue = ({
  vaultAddresses,
}: {
  vaultAddresses: Address[];
}) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: tokenPrices } = useOracleOnMultipleTokens({ tokenAddresses: Object.keys(TOKEN_ASSETS) });

  // Get token list from TOKEN_ASSETS
  const tokens = LENDING_TOKENS;
  const tokenAddresses = Object.keys(tokens);

  // Create contracts for all token balances across all vaults
  const balanceContracts = useMemo(() => {
    if (!vaultAddresses) return [];

    return vaultAddresses.flatMap((vaultAddress) =>
      Object.values(tokens).map((token: Token) => ({
        abi: erc20Abi,
        address: getAddress(token.address),
        functionName: "balanceOf",
        args: [vaultAddress],
      }))
    );
  }, [vaultAddresses, tokenAddresses]);

  // Fetch all balances in one call
  const { data: allTokenBalances } = useReadContracts({
    query: {
      enabled: vaultAddresses?.length > 0 && balanceContracts.length > 0,
    },
    contracts: balanceContracts,
  });


  useEffect(() => {
    if (!allTokenBalances || !tokenPrices || !vaultAddresses?.length) {
      setIsLoading(true);
      return;
    }

    // Verify all queries were successful
    if (
      !allTokenBalances.every((b) => b.status === "success") ||
      !tokenPrices.every((p) => p.status === "success")
    ) {
      setIsLoading(true);
      return;
    }

    let total = 0;

    // Process balances for each vault
    vaultAddresses.forEach((_, vaultIndex) => {
      // For each vault, process all its tokens
      Object.values(tokens).forEach((token, tokenIndex) => {
        const balanceIndex = vaultIndex * tokenAddresses.length + tokenIndex;
        const balance = allTokenBalances[balanceIndex].result;
        const price = tokenPrices[tokenIndex].result;

        if (balance && price && BigInt(balance) > BigInt(0)) {
          const tokenValue = tokenToUSD(
            {
              value: balance as bigint,
              decimals: token.decimals,
            },
            price as bigint
          );
          total += tokenValue;
        }
      });
    });

    setTotalBalance(total);
    setIsLoading(false);
  }, [allTokenBalances, tokenPrices, vaultAddresses, tokens]);

  return { totalBalance, isLoading };
};
