export type SubscribeStrategyStruct = {
  strategyAddress: `0x${string}`; // Hex address
  subscriptionId: bigint; // For uint256 values
};

export type SubscribedStrategies = SubscribeStrategyStruct[];

export type SendTokenStrategyParams = {
  vaultAddress: `0x${string}`;
  yieldAsset: `0x${string}`;
  targetAsset: `0x${string}`;
  to: `0x${string}`;
  minSupplyThreshold: bigint;
  percentAllocation: bigint;
  executionAfter: bigint;
};

const SendTokenStrategyParamsType = null! as SendTokenStrategyParams;

export const EXISTING_STRATEGIES = {
  [process.env.NEXT_PUBLIC_STRATEGY_REWARD_SPLIT!]: {
    title: "Reward Split",
    description: "Splitting rewards to 30% BTC or 40% ETH",
    paramType: SendTokenStrategyParamsType,
  },
};
