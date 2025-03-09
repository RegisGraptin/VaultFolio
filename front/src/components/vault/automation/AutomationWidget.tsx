import {
  EXISTING_STRATEGIES,
  SubscribeStrategyStruct,
} from "@/utils/automation";
import {
  useReadStrategyParams,
  useStrategyLastExecution,
} from "@/utils/hook/strategy";
import { LENDING_TOKENS, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { useEffect, useState } from "react";

const AutomationWidget = ({
  subscribedStrategy,
}: {
  subscribedStrategy: SubscribeStrategyStruct;
}) => {
  const strategy = EXISTING_STRATEGIES[subscribedStrategy.strategyAddress];

  const { data: lastExecution } = useStrategyLastExecution(subscribedStrategy);
  const { data: strategyParams } = useReadStrategyParams(subscribedStrategy);

  const [params, setParams] = useState<typeof strategy.paramType | undefined>(
    undefined
  );

  useEffect(() => {
    if (strategyParams) {
      setParams(strategyParams as typeof strategy.paramType);
    }
  }, [strategyParams]);

  return (
    <>
      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-800">
            {EXISTING_STRATEGIES[subscribedStrategy.strategyAddress].title}
          </h4>
          <span
            className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-700`}
          >
            active
          </span>
        </div>

        {params && (
          <div className="text-sm text-gray-600">
            <p>
              Takes {(Number(params.percentAllocation) * 100) / 1_000_000}%
              rewards from{" "}
              {TOKEN_ASSETS[params.yieldAsset.toLowerCase()].symbol} to buy{" "}
              {TOKEN_ASSETS[params.targetAsset.toLowerCase()].symbol}.
            </p>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          {lastExecution ? "Last executed: 2 days ago" : "Not executed."}
        </div>
      </div>
    </>
  );
};

export default AutomationWidget;
