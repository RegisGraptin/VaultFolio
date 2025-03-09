import PopupButton from "@/components/button/PopupButton";
import { Address } from "viem";
import AutomateRewardSplitModal from "../automation/AutomateRewardSplitModal";
import { useVault } from "@/utils/hook/vault";
import AutomationWidget from "../automation/AutomationWidget";
import { SubscribedStrategies } from "@/utils/automation";

const RewardSplitButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors group"
    >
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
          Reward Split Automation
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Automatically split lending rewards between BTC and ETH
        </p>
      </div>
    </button>
  );
};

// For an array of these structs

const VaultAutomationView = ({ vaultAddress }: { vaultAddress: Address }) => {
  const { data: subscribedStrategies, refetch: refetchSubscribedStrategies } =
    useVault(vaultAddress, "getAllSubscribedStrategies");

  return (
    <div className="m-2 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Automation Manager
        </h2>
        <span className="text-sm text-gray-500">
          Vault: {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
        </span>
      </div>

      {/* Existing Automations Section */}
      <div className="mb-12">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Active Automations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscribedStrategies === undefined ||
            ((subscribedStrategies as SubscribedStrategies).length === 0 && (
              <p className="text-sm text-gray-600">No existing automation...</p>
            ))}

          {(subscribedStrategies as SubscribedStrategies) &&
            (subscribedStrategies as SubscribedStrategies).map(
              (subscribedStrategy, index) => (
                <AutomationWidget
                  subscribedStrategy={subscribedStrategy}
                  key={index}
                />
              )
            )}
        </div>
      </div>

      {/* New Automation Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          Create New Automation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PopupButton
            ButtonComponent={RewardSplitButton}
            ModalComponent={AutomateRewardSplitModal}
            modalProps={{
              vaultAddress,
              onClose: async () => {
                refetchSubscribedStrategies();
              },
            }}
          />

          <button
            disabled
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors group disabled:opacity-50 disabled:hover:border-gray-300 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 group-disabled:text-gray-400 group-disabled:group-hover:text-gray-400">
                Weekly Loan Repayment
              </div>
              <p className="text-sm text-gray-600 mt-2 group-disabled:text-gray-400">
                Automatically use a percentage of rewards to repay loans weekly
              </p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Select an automation type to configure parameters and schedule
        </div>
      </div>
    </div>
  );
};

export default VaultAutomationView;
