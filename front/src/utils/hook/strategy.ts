import { Address, erc20Abi, getAddress } from "viem";
import { useReadContract } from "wagmi";

import IStrategy from "@/abi/IStrategy.json";
import SendTokenStrategy from "@/abi/SendTokenStrategy.json";
import { SubscribeStrategyStruct } from "../automation";

export function useStrategyLastExecution(
  subscribedStrategy: SubscribeStrategyStruct
) {
  return useReadContract({
    address: getAddress(subscribedStrategy.strategyAddress!),
    abi: IStrategy.abi,
    functionName: "lastExecution",
    args: [subscribedStrategy.subscriptionId],
    query: {
      enabled: !!subscribedStrategy.strategyAddress, // Only enable when address exists
    },
  });
}

export function useReadStrategyParams(
  subscribedStrategy: SubscribeStrategyStruct
) {
  return useReadContract({
    address: getAddress(subscribedStrategy.strategyAddress!),
    abi: SendTokenStrategy.abi,
    functionName: "getParams",
    args: [subscribedStrategy.subscriptionId],
    query: {
      enabled: !!subscribedStrategy.strategyAddress, // Only enable when address exists
    },
  });
}
