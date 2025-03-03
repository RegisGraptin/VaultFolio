import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Address, erc20Abi, formatUnits, getAddress, parseUnits } from "viem";

import Vault from "@/abi/Vault.json";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { DEBT_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import LoadingButton from "../../button/LoadingButton";
import { useReadOracle } from "@/utils/hook/oracle";
import {
  convertAssetToUSD,
  formatBalance,
  validateAndFormatAmount,
} from "@/utils/tokens/balance";

interface ModalProps {
  onClose: () => void;
  vaultAddress: Address;
  assetAddress: Address;
  totalLending: Number | undefined;
  totalBorrowing: Number | undefined;
}

const VaultRepayFormModal: React.FC<ModalProps> = ({
  onClose,
  vaultAddress,
  assetAddress,
  totalLending,
  totalBorrowing,
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];

  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newHealthFactor, setNewHealthFactor] = useState<number>(Infinity);
  const [newDebtBalance, setNewDebtBalance] = useState<bigint>(BigInt(0));

  const { data: ownedDebtBalance } = useBalance({
    address: vaultAddress,
    token: DEBT_TOKENS[assetAddress.toLocaleLowerCase()].address,
  });

  const { oraclePriceUsd, isLoading: isOracleLoading } = useReadOracle({
    assetAddress,
  });

  const originalHealthFactor = useMemo(() => {
    const hf = Number(totalLending) / Number(totalBorrowing);
    return totalBorrowing === Number(0) ? Infinity : hf;
  }, [totalLending, totalBorrowing]);

  useEffect(() => {
    if (
      !amount ||
      !oraclePriceUsd ||
      !totalLending ||
      !totalBorrowing ||
      !ownedDebtBalance
    ) {
      setNewHealthFactor(originalHealthFactor);
      return;
    }

    try {
      const parsedAmount = parseUnits(amount, token.decimals);

      setNewDebtBalance(ownedDebtBalance.value - parsedAmount);

      let formattedAmount = parsedAmount * (oraclePriceUsd as bigint);
      const formattedAmountSTR = formatUnits(
        formattedAmount,
        token.decimals + 8
      );
      const newDebtUSD = Math.max(
        Number(totalBorrowing) - Number(formattedAmountSTR),
        0
      );

      const hf = Number(totalLending) / Number(newDebtUSD);
      setNewHealthFactor(newDebtUSD === Number(0) ? Infinity : hf);
    } catch {
      setNewHealthFactor(originalHealthFactor);
    }
  }, [amount, totalLending, totalBorrowing, oraclePriceUsd, ownedDebtBalance]);

  const {
    writeContract: writeRepayToken,
    data: txHashRepay,
    isPending: isRepaying,
  } = useWriteContract();

  const { isSuccess: isTxRepayConfirmed, isLoading: isTxRepayLoading } =
    useWaitForTransactionReceipt({
      hash: txHashRepay,
    });

  useEffect(() => {
    if (isTxRepayConfirmed) {
      onClose();
    }
  }, [isTxRepayConfirmed]);

  const repayToken = () => {
    // FIXME: to checked
    let formattedAmount = validateAndFormatAmount(amount, token.decimals);
    if (!formattedAmount) return;

    writeRepayToken({
      address: vaultAddress,
      abi: Vault.abi,
      functionName: "repay",
      args: [assetAddress, formattedAmount, 2],
    });
  };

  const isRepayButtonDisabled = () => {
    return (
      amount == "" ||
      Number(amount) == 0 ||
      Number(amount) < 0 ||
      (ownedDebtBalance &&
        parseUnits(amount.toString(), ownedDebtBalance?.decimals) >
          ownedDebtBalance?.value) ||
      isRepaying ||
      isTxRepayLoading
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-[24rem] rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Repay {token.symbol}
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
              <span className="text-sm text-gray-500">Available</span>
              <span className="text-sm font-medium text-gray-700">
                {ownedDebtBalance
                  ? formatUnits(
                      ownedDebtBalance.value,
                      ownedDebtBalance.decimals
                    )
                  : "0.00"}
              </span>
              <button
                onClick={() =>
                  setAmount(
                    ownedDebtBalance
                      ? formatUnits(
                          ownedDebtBalance.value,
                          ownedDebtBalance.decimals
                        )
                      : "0.00"
                  )
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
            {oraclePriceUsd && amount
              ? `${convertAssetToUSD(parseUnits(amount, token.decimals), token.decimals, oraclePriceUsd as bigint)}`
              : "0.00"}{" "}
            USD
          </div>
        </div>

        {/* Transaction Overview */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">Transaction overview</p>
          <div className="space-y-3">
            {/* Remaining Debt */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Remaining debt</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {formatBalance(
                    ownedDebtBalance!.value,
                    ownedDebtBalance!.decimals
                  ) +
                    " " +
                    token.symbol}
                </span>
                <svg
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {newDebtBalance < 0
                    ? "0"
                    : formatBalance(newDebtBalance, ownedDebtBalance!.decimals)}

                  {" " + token.symbol}
                </span>
              </div>
            </div>

            {/* Health Factor */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Health Factor</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {originalHealthFactor.toFixed(2)}
                </span>
                <svg
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {newHealthFactor === Infinity
                    ? "∞"
                    : newHealthFactor.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Alert */}
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-blue-500"
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
            <p className="text-sm text-blue-700">
              <b>Attention:</b> Parameter changes via governance can alter your
              account health factor and risk of liquidation. Follow the{" "}
              <a
                href="https://governance.aave.com/"
                className="underline hover:text-blue-800"
              >
                Aave governance forum
              </a>{" "}
              for updates.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <LoadingButton
            isLoading={isRepaying}
            onClick={() => repayToken()}
            className={`w-full py-3 rounded-xl text-white font-medium transition-colors`}
            disabled={isRepayButtonDisabled()}
          >
            Repay
          </LoadingButton>
        </div>

        {/* Error Message */}
        {/* {borrowError && (
          <div className="mt-4 text-center text-sm text-red-600">
            {borrowError.message}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default VaultRepayFormModal;
