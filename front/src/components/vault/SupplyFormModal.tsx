import React, { useEffect, useState } from "react";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";

import Vault from "@/abi/Vault.json";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
  assetAddress: Address;
}

const SupplyFormModal: React.FC<ModalProps> = ({
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
    <div className="relative mx-auto w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Modal Header */}
      <div className="relative flex items-center justify-center h-24 bg-slate-800 text-white">
        <h3 className="text-2xl">Supply token</h3>
      </div>

      {/* FIXME: */}
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        ✖
      </button>

      {/* Modal Body */}
      <div className="flex flex-col gap-4 p-6">
        <div className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-slate-600">Amount</label>
          <input
            type="number"
            step="any"
            min="0"
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            // When click somewhere else, normalize value
          />
        </div>

        {/* Display user balance */}
        <div className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-slate-600">
            Your Balance
          </label>
          <p className="text-slate-700 text-sm">
            {userBalance
              ? formatUnits(userBalance.value, token.decimals)
              : "Loading..."}{" "}
            {token.symbol}
          </p>
        </div>

        {/* FIXME: */}
      </div>

      {/* Modal Footer */}
      <div className="p-6 pt-0">
        {isNeedsApproval() && (
          <button
            className={`w-full my-2 rounded-md py-2 px-4 text-white shadow-md 
          ${
            isApproveButtonDisabled()
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
            type="button"
            onClick={() => approveToken()}
            disabled={isApproveButtonDisabled()}
          >
            {isProcessing ? "Processing approval..." : "Approve"}
          </button>
        )}

        <button
          className={`w-full rounded-md py-2 px-4 text-white shadow-md 
          ${
            isSupplyButtonDisabled()
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
          type="button"
          onClick={() => supplyToken()}
          disabled={isSupplyButtonDisabled()}
        >
          {isProcessing ? "Processing..." : "Supply"}
        </button>
        <p>{supplyError && supplyError.message}</p>
      </div>
    </div>
  );
};

export default SupplyFormModal;
