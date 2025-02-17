import { useReadContract } from "wagmi";
import { Address, getAddress } from "viem";

import IPoolAddressesProvider from "@/abi/IPoolAddressesProvider.json";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";

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
