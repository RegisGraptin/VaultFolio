import Vault from "@/abi/Vault.json";
import Manager from "@/abi/Manager.json";

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
