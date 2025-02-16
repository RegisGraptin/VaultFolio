import Vault from "@/abi/Vault.json";

import { useReadContract } from "wagmi";
import { Address, getAddress } from "viem";

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
