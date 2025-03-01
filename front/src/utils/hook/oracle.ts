import { useReadContract, useReadContracts } from "wagmi";
import { Abi, Address, getAddress } from "viem";

import IPoolAddressesProvider from "@/abi/IPoolAddressesProvider.json";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";
import { useEffect, useState } from "react";

export function useOracle<TFunctionName extends string>(
  functionName: TFunctionName,
  args?: any[]
) {
  return useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_ADDRESSES_PROVIDER!),
    abi: IPoolAddressesProvider.abi,
    functionName,
    args,
  });
}

export function usePriceOracle<TFunctionName extends string>(
  oracleAddress: Address | string | undefined | unknown,
  functionName: TFunctionName,
  args?: any[]
) {
  return useReadContract({
    address: oracleAddress ? getAddress(oracleAddress as string) : undefined,
    abi: IPriceOracle.abi,
    functionName,
    args,
    query: {
      enabled: !!oracleAddress,
    },
  });
}

export const useReadOracle = ({
  assetAddress,
}: {
  assetAddress: Address | string;
}) => {
  const [oraclePriceUsd, setOraclePrice] = useState<BigInt>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: dataAddressPriceOracle } = useOracle("getPriceOracle");

  const { data: dataOraclePriceUSD } = usePriceOracle(
    dataAddressPriceOracle,
    "getAssetPrice",
    [getAddress(assetAddress)]
  );

  useEffect(() => {
    if (!dataOraclePriceUSD) return;

    setOraclePrice(dataOraclePriceUSD as bigint);
    setIsLoading(false);
  }, [dataOraclePriceUSD]);

  return { oraclePriceUsd, isLoading };
};

export const useOracleOnMultipleTokens = ({
  tokenAddresses,
}: {
  tokenAddresses: Address[] | string[];
}) => {
  const { data: addressPriceOracle } = useOracle("getPriceOracle");
  const { data: tokenPrices, isLoading } = useReadContracts({
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

  return { data: tokenPrices, isLoading };
};
