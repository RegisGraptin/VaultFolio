import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Address, erc20Abi, formatUnits, getAddress, parseUnits } from "viem";

import Vault from "@/abi/Vault.json";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import LoadingButton from "../../button/LoadingButton";
import { useReadOracle } from "@/utils/hook/oracle";
import {
  convertAssetToUSD,
  formatBalance,
  validateAndFormatAmount,
} from "@/utils/tokens/balance";
import { useAllowance } from "@/utils/hook/token";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
  assetAddress: Address;
  supplyApy: Number | undefined;
}

const VaultSupplyFormModal: React.FC<ModalProps> = ({
  onClose,
  vaultAddress,
  assetAddress,
  supplyApy,
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];

  const [amount, setAmount] = useState<string>("");

  const { data: userBalance } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  const { oraclePriceUsd, isLoading: isOracleLoading } = useReadOracle({
    assetAddress,
  });

  // Fetch user allowance
  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useAllowance(assetAddress, [userAddress!, vaultAddress]);

  const {
    writeContract: writeApproveToken,
    data: txHashApprove,
    isPending: isApproving,
  } = useWriteContract();

  const { isSuccess: isTxApproveConfirmed, isLoading: isTxApproveLoading } =
    useWaitForTransactionReceipt({
      hash: txHashApprove,
    });

  // Refetch approval data after approval update
  useEffect(() => {
    if (isTxApproveConfirmed) {
      refetchAllowance();
    }
  }, [isTxApproveConfirmed]);

  // Supply action
  const {
    writeContract: writeSupplyToken,
    data: txHashSupply,
    isPending: isSupplying,
    error: supplyError,
  } = useWriteContract();

  const { isSuccess: isTxSupplyConfirmed, isLoading: isTxSupplyLoading } =
    useWaitForTransactionReceipt({
      hash: txHashSupply,
    });

  useEffect(() => {
    if (isTxSupplyConfirmed) {
      onClose();
    }
  }, [isTxSupplyConfirmed]);

  const approveToken = () => {
    let formattedAmount = validateAndFormatAmount(amount, token.decimals);
    if (!formattedAmount) return;

    writeApproveToken({
      address: assetAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [vaultAddress, formattedAmount],
    });
  };

  const supplyToken = () => {
    let formattedAmount = validateAndFormatAmount(amount, token.decimals);
    if (!formattedAmount) return;

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
      Number(amount) < 0 ||
      !isNeedsApproval() ||
      isApproving ||
      isTxApproveLoading ||
      isLoadingAllowance
    );
  };

  const isSupplyButtonDisabled = () => {
    return (
      amount == "" ||
      Number(amount) == 0 ||
      Number(amount) < 0 ||
      (userBalance &&
        parseUnits(amount.toString(), userBalance?.decimals) >
          userBalance?.value) ||
      isSupplying ||
      isNeedsApproval() ||
      isTxSupplyLoading ||
      isLoadingAllowance
    );
  };

  const isNeedsApproval = () => {
    if (allowance !== undefined) {
      return (
        Number(allowance) == 0 ||
        Number(allowance) < parseUnits(amount.toString(), token.decimals)
      );
    }
    return false;
  };

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
                  ? formatBalance(userBalance.value, token.decimals)
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
              step={Math.pow(10, -token.decimals)}
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
            {userBalance && oraclePriceUsd && amount
              ? `${convertAssetToUSD(parseUnits(amount, userBalance.decimals), userBalance.decimals, oraclePriceUsd as bigint)}`
              : "0.00"}{" "}
            USD
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-6 space-y-3">
          {supplyApy !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Supply APY</span>
              <span className="font-medium text-gray-700">
                {supplyApy?.toFixed(2)}%
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Collateralization</span>
            <span className="text-green-600 font-medium">Enabled</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* FIXME: Smooth show up */}
          {isNeedsApproval() && (
            <LoadingButton
              isLoading={isApproving || isTxApproveLoading}
              onClick={() => approveToken()}
              className={`w-full py-3 rounded-xl text-white font-medium transition-colors`}
              disabled={isApproveButtonDisabled()}
            >
              Approve
            </LoadingButton>
          )}

          <LoadingButton
            isLoading={isSupplying || isTxSupplyLoading}
            onClick={() => supplyToken()}
            disabled={isSupplyButtonDisabled()}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors`}
          >
            Supply
          </LoadingButton>
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
