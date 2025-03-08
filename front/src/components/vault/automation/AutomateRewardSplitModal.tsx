import { LENDING_TOKENS, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { useEffect, useState } from "react";
import { Address, formatUnits } from "viem";
import { AssetTokenSelect } from "./AssetTokenSelect";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { usePortfolioLending } from "@/utils/hook/vault";
import LoadingButton from "@/components/button/LoadingButton";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
}

const AutomateRewardSplitModal: React.FC<ModalProps> = ({
  onClose,
  vaultAddress,
}) => {
  const { address: userAddress } = useAccount();

  const { allocations } = usePortfolioLending({ vaultAddress });

  const {
    data: hash,
    error,
    writeContract,
    isPending: txIsPending,
  } = useWriteContract();

  const { data: txReceipt, isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [formData, setFormData] = useState({
    yieldAsset: "",
    targetAsset: "",
    to: userAddress,
    minSupplyThreshold: "",
    percentAllocation: "",
    executionAfter: "",
  });

  const updateMinSupplyThreshold = (yieldAsset: string) => {
    // Update and set the current lending position
    if (allocations && allocations[yieldAsset]) {
      setFormData({
        ...formData,
        yieldAsset: yieldAsset,
        minSupplyThreshold: formatUnits(
          BigInt(allocations[yieldAsset].balances[0]),
          allocations[yieldAsset].decimals
        ),
      });
    } else {
      setFormData({
        ...formData,
        minSupplyThreshold: "",
        yieldAsset: yieldAsset,
      });
    }
  };

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Automated Reward Split Strategy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Vault: {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
        </p>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        <div className="space-y-6">
          {/* Asset Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yield Asset
              </label>
              <AssetTokenSelect
                tokens={Object.values(TOKEN_ASSETS)}
                selected={formData.yieldAsset}
                onChange={(value) => {
                  updateMinSupplyThreshold(value);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Asset
              </label>
              <AssetTokenSelect
                tokens={Object.values(TOKEN_ASSETS)}
                selected={formData.targetAsset}
                onChange={(value) =>
                  setFormData({ ...formData, targetAsset: value })
                }
              />
            </div>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0x..."
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            />
          </div>
          {/* Strategy Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Supply Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="100"
                  value={formData.minSupplyThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minSupplyThreshold: e.target.value,
                    })
                  }
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm">
                  {formData.yieldAsset
                    ? TOKEN_ASSETS[formData.yieldAsset.toLowerCase()].symbol
                    : "-"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocation %
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50"
                  min="0"
                  max="100"
                  value={formData.percentAllocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      percentAllocation: e.target.value,
                    })
                  }
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execute After
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="7"
                  value={formData.executionAfter}
                  onChange={(e) =>
                    setFormData({ ...formData, executionAfter: e.target.value })
                  }
                />
                <span className="absolute right-4 top-2.5 text-gray-400 text-sm">
                  days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <LoadingButton
            isLoading={txIsPending || isConfirming}
            disabled={Object.values(formData).some((field) => field === "")}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-slate-800 text-white shadow-md transition-all transition-colors font-medium"
          >
            Create Strategy
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default AutomateRewardSplitModal;
