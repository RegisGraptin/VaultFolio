import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { useEffect, useMemo, useState } from "react";
import { Address, formatUnits, getAddress, parseUnits } from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useOracle, usePriceOracle, useReadOracle } from "@/utils/hook/oracle";
import {
  convertAssetToUSD,
  formatBalance,
  validateAndFormatAmount,
} from "@/utils/tokens/balance";
import LoadingButton from "@/components/button/LoadingButton";

import Vault from "@/abi/Vault.json";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
  assetAddress: Address;
  totalLending: Number | undefined;
  totalBorrowing: Number | undefined;
}

const VaultWithdrawFormModal: React.FC<ModalProps> = ({
  onClose,
  vaultAddress,
  assetAddress,
  totalLending,
  totalBorrowing,
}) => {
  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];
  let lending_token: Token = LENDING_TOKENS[assetAddress.toLowerCase()];

  const [amount, setAmount] = useState<string>("");

  const { oraclePriceUsd, isLoading: isOracleLoading } = useReadOracle({
    assetAddress,
  });

  const { data: vaultBalance } = useBalance({
    address: vaultAddress,
    token: lending_token.address,
  });

  const {
    writeContract: writeWithdrawToken,
    data: txHashWithdraw,
    isPending: isWithdrawing,
    error: withdrawError,
  } = useWriteContract();

  const { isSuccess: isTxWithdrawConfirmed, isLoading: isTxWithdrawLoading } =
    useWaitForTransactionReceipt({
      hash: txHashWithdraw,
    });

  const withdrawToken = () => {
    let formattedAmount = validateAndFormatAmount(amount, token.decimals);
    if (!formattedAmount) return;

    writeWithdrawToken({
      address: vaultAddress,
      abi: Vault.abi,
      functionName: "withdraw",
      args: [assetAddress, formattedAmount],
    });
  };

  useEffect(() => {
    if (isTxWithdrawConfirmed) {
      onClose();
    }
  }, [isTxWithdrawConfirmed]);

  const isWithdrawButtonDisabled = () => {
    return (
      amount == "" ||
      Number(amount) == 0 ||
      Number(amount) < 0 ||
      (vaultBalance &&
        parseUnits(amount.toString(), vaultBalance?.decimals) >
          vaultBalance?.value) ||
      (maxWithdrawAmount &&
        parseUnits(amount.toString(), token.decimals) > maxWithdrawAmount) ||
      isWithdrawing ||
      isTxWithdrawLoading
    );
  };

  const maxWithdrawAmount = useMemo(() => {
    if (
      vaultBalance === undefined ||
      totalLending === undefined ||
      totalBorrowing === undefined
    )
      return BigInt(0);

    if (totalBorrowing === 0) return vaultBalance.value;

    const maxWithdrawAmount =
      vaultBalance.value -
      (BigInt(3) *
        parseUnits(totalBorrowing.toString(), vaultBalance.decimals)) /
        BigInt(2);

    return maxWithdrawAmount > 0 ? maxWithdrawAmount : BigInt(0);
  }, [vaultBalance, totalLending, totalBorrowing]);

  return (
    <div className="relative mx-auto w-full max-w-[24rem] rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Withdraw {token.symbol}
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
              <span className="text-sm text-gray-500">Vault balance</span>
              <span className="text-sm font-medium text-gray-700">
                {vaultBalance
                  ? formatBalance(maxWithdrawAmount, vaultBalance.decimals)
                  : "0.00"}
              </span>
              <button
                onClick={() =>
                  vaultBalance
                    ? setAmount(
                        formatUnits(maxWithdrawAmount, vaultBalance.decimals)
                      )
                    : () => {}
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
            {vaultBalance && oraclePriceUsd && amount
              ? `${convertAssetToUSD(parseUnits(amount, vaultBalance.decimals), vaultBalance.decimals, oraclePriceUsd as bigint)}`
              : "0.00"}{" "}
            USD
          </div>
        </div>

        {/* Transaction Details */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Remaining supply</span>
            <span className="font-medium text-gray-700">
              {vaultBalance
                ? Number(amount) > 0 &&
                  parseUnits(amount, vaultBalance.decimals) <=
                    vaultBalance.value
                  ? formatBalance(
                      vaultBalance.value -
                        parseUnits(amount, vaultBalance.decimals),
                      vaultBalance.decimals
                    )
                  : formatBalance(vaultBalance.value, vaultBalance.decimals)
                : "0.00"}{" "}
              {token.symbol}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <LoadingButton
            isLoading={isWithdrawing || isTxWithdrawLoading}
            onClick={withdrawToken}
            disabled={isWithdrawButtonDisabled()}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors`}
          >
            Withdraw
          </LoadingButton>
        </div>

        {/* Error Message */}
        {withdrawError && (
          <div className="mt-4 text-center text-sm text-red-600">
            {withdrawError.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultWithdrawFormModal;
