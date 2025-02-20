import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Address, erc20Abi, formatUnits, getAddress, parseUnits } from "viem";

import Vault from "@/abi/Vault.json";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import LoadingButton from "../../button/LoadingButton";
import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD } from "@/utils/tokens/balance";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
  assetAddress: Address;
}

const VaultSupplyFormModal: React.FC<ModalProps> = ({
  onClose,
  vaultAddress,
  assetAddress,
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];

  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { data: userBalance } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  const { data: addressPriceOracle } = useOracle("getPriceOracle");

  const { data: oraclePriceUSD } = usePriceOracle(
    addressPriceOracle,
    "getAssetPrice",
    [getAddress(assetAddress)]
  );

  const validateAndFormatAmount = (): bigint | null => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("Invalid amount");
      return null;
    }

    try {
      return parseUnits(amount.toString(), token.decimals);
    } catch (error) {
      console.error("Error supplying token:", error);
      return null;
    }
  };

  // Fetch user allowance
  const { data: allowance, isLoading: isLoadingAllowance } = useReadContract({
    address: assetAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [userAddress!, vaultAddress],
  });

  const {
    writeContract: writeApproveToken,
    isPending: isApproving,
    error: approveError,
    isSuccess: isApproved,
  } = useWriteContract();

  const {
    writeContract: writeSupplyToken,
    isPending: isSupplying,
    error: supplyError,
  } = useWriteContract();

  const approveToken = () => {
    let formattedAmount = validateAndFormatAmount();
    if (!formattedAmount) return;

    writeApproveToken({
      address: assetAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, formattedAmount],
    });
  };

  const supplyToken = () => {
    let formattedAmount = validateAndFormatAmount();
    if (!formattedAmount) return;

    console.log(formattedAmount);

    writeSupplyToken({
      address: vaultAddress,
      abi: Vault.abi,
      functionName: "supply",
      args: [assetAddress, formattedAmount],
    });
  };

  const isApproveButtonDisabled = () => {
    // Should be disabled if we do not have an input value
    // If the input value is greater than the approval value
    // If we are loading the value of the allowance
    // console.log;
    return (
      amount == "" ||
      Number(amount) == 0 ||
      !isNeedsApproval() ||
      isProcessing ||
      isApproving ||
      isLoadingAllowance
    );
  };

  const isSupplyButtonDisabled = () => {
    return (
      amount == "" ||
      Number(amount) == 0 ||
      isProcessing ||
      isApproving ||
      isSupplying ||
      isNeedsApproval() ||
      isLoadingAllowance
    );
  };

  const isNeedsApproval = () => {
    if (allowance !== undefined) {
      return (
        Number(allowance) == 0 ||
        Number(allowance) < Number(amount) * 10 ** token.decimals
      );
    }
    return false;
  };

  // FIXME:: Handle update approval value

  return (
    <div className="relative mx-auto w-full max-w-[24rem] rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Supply {token.symbol}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
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
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Amount</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Wallet balance</span>
              <span className="text-sm font-medium text-gray-700">
                {userBalance
                  ? formatUnits(userBalance.value, token.decimals)
                  : "0.00"}
              </span>
              <button
                onClick={() =>
                  setAmount(formatUnits(userBalance!.value, token.decimals))
                }
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Max
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 transition-colors">
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-xl font-medium text-gray-900 focus:outline-none"
            />
            <div className="flex items-center space-x-2 mr-2">
              <Image
                src={`/images/tokens/${token.symbol.toLowerCase()}.svg`}
                alt={`${token.symbol} icon`}
                className="h-6 w-6"
                width={24}
                height={24}
              />
              <span className="font-medium text-gray-700">{token.symbol}</span>
            </div>
          </div>

          <div className="mt-2 text-right text-sm text-gray-500">
            ≈ $
            {userBalance && oraclePriceUSD && amount
              ? `${convertAssetToUSD(parseUnits(amount, userBalance.decimals), userBalance.decimals, oraclePriceUSD as bigint)}`
              : "0.00"}{" "}
            USD
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Supply APY</span>
            <span className="font-medium text-gray-700">0%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Collateralization</span>
            <span className="text-green-600 font-medium">Enabled</span>
          </div>
        </div>

        {/* Gas Estimation */}
        {/* <div className="mb-6 flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-1 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Gas fee: $0.00
        </div> */}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isNeedsApproval() && (
            <LoadingButton
              isLoading={isApproving}
              onClick={() => approveToken()}
              className={`w-full py-3 rounded-xl text-white font-medium transition-colors`}
              disabled={isApproveButtonDisabled()}
            >
              {isProcessing ? "Approving..." : "Approve"}
            </LoadingButton>
          )}

          <button
            onClick={() => supplyToken()}
            disabled={isSupplyButtonDisabled()}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors ${
              isSupplyButtonDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? "Processing..." : "Supply"}
          </button>
        </div>

        {/* Error Message */}
        {supplyError && (
          <div className="mt-4 text-center text-sm text-red-600">
            {supplyError.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultSupplyFormModal;
