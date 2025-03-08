import PopupButton from "@/components/button/PopupButton";
import { Address } from "viem";
import AutomateRewardSplitModal from "../automation/AutomateRewardSplitModal";

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

const VaultAutomationView = ({ vaultAddress }: { vaultAddress: Address }) => {
  // Temporary data - replace with your actual data source
  const existingAutomations: {
    id: number;
    type: string;
    params: any;
    vault: Address;
    status: string;
  }[] = [];
  //   {
  //     id: 1,
  //     type: "Weekly Loan Repayment",
  //     params: { percentage: 15 },
  //     vault: vaultAddress,
  //     status: "active",
  //   },
  //   {
  //     id: 2,
  //     type: "Reward Split",
  //     params: { assets: ["BTC", "ETH"], split: [50, 50] },
  //     vault: vaultAddress,
  //     status: "inactive",
  //   },
  // ];

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
          {existingAutomations.length === 0 && (
            <p className="text-sm text-gray-600">No existing automation...</p>
          )}

          {existingAutomations &&
            existingAutomations.map((auto) => (
              <div
                key={auto.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{auto.type}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      auto.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {auto.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {auto.type === "Weekly Loan Repayment" ? (
                    <p>Repaying {auto.params.percentage}% of rewards weekly</p>
                  ) : (
                    auto.params.split && (
                      <p>
                        Splitting rewards to {auto.params.split[0]}% BTC /{" "}
                        {auto.params.split[1]}% ETH
                      </p>
                    )
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Last executed: 2 days ago
                </div>
              </div>
            ))}
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
              onClose: async () => {},
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
