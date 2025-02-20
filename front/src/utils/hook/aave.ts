import { getAddress } from "viem";
import { useReadContract } from "wagmi";

import AAVEPool from "@/abi/Pool.json";

export interface ReserveDataLegacy {
  configuration: ReserveConfigurationMap;
  liquidityIndex: bigint; // uint128
  currentLiquidityRate: bigint; // uint128
  variableBorrowIndex: bigint; // uint128
  currentVariableBorrowRate: bigint; // uint128
  currentStableBorrowRate: bigint; // uint128
  lastUpdateTimestamp: number; // uint40
  id: number; // uint16
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;
  accruedToTreasury: bigint; // uint128
  unbacked: bigint; // uint128
  isolationModeTotalDebt: bigint; // uint128
}

interface ReserveConfigurationMap {
  data: bigint; // uint256
}

export function useAave<TFunctionName extends string>(
  functionName: TFunctionName,
  args?: any[]
) {
  return useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL!),
    abi: AAVEPool.abi,
    functionName,
    args,
  });
}
