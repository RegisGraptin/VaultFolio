import { DEBT_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, getAddress } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import VautlAssetInfo from "../common/VaultAssetInfo";
import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { ReserveDataLegacy, useAave } from "@/utils/hook/aave";
import { useEffect, useState } from "react";
import PopupButton from "@/components/button/PopupButton";
import VaultBorrowFormModal from "./VaultBorrowFormModal";
import VaultRepayFormModal from "./VaultRepayFormModal";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

const VaultBorrowRow = ({
  vaultAddress,
  assetAddress,
}: {
  vaultAddress: Address;
  assetAddress: Address;
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];
  let debtToken: Token = DEBT_TOKENS[assetAddress.toLowerCase()];

  const [apy, setApy] = useState<Number | undefined>(undefined);
  const [canBeBorrow, setCanBeBorrow] = useState<boolean | undefined>(
    undefined
  );

  const { data: userBalanceToken } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  const { data: addressPriceOracle } = useOracle("getPriceOracle");

  const { data: oraclePriceUSD } = usePriceOracle(
    addressPriceOracle,
    "getAssetPrice",
    [getAddress(assetAddress)]
  );

  const { data: userDebtTokenBalance } = useBalance({
    address: vaultAddress,
    token: debtToken.address,
  });

  // Get asset information from the AAVE pool
  const { data: reserveData } = useAave("getReserveData", [assetAddress]);

  useEffect(() => {
    if (reserveData) {
      // Get if the asset can be borrowed
      const assetConfiguration = (reserveData as ReserveDataLegacy)
        .configuration.data;

      // bit 58: borrowing is enabled
      const BORROWING_ENABLED_MASK = BigInt(1) << BigInt(58);
      const isBorrowingEnabled =
        (BigInt(assetConfiguration) & BORROWING_ENABLED_MASK) !== BigInt(0);
      setCanBeBorrow(isBorrowingEnabled);

      // Get the APY from the reserve data
      const liquidityRate = (reserveData as ReserveDataLegacy)
        .currentVariableBorrowRate;
      const apy = Number(liquidityRate) / 1e25;
      setApy(apy);
    }
  }, [reserveData]);

  const BorrowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Borrow ${token.name}`}
      onClick={onClick}
      disabled={false} // FIXME: check health factor
    >
      <span className="flex items-center">
        <GiReceiveMoney className="h-5 w-5 mr-2" /> Borrow
      </span>
    </button>
  );

  const RepayButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Repay ${token.name}`}
      onClick={onClick}
      disabled={
        userDebtTokenBalance && userDebtTokenBalance.value === BigInt(0)
      } // FIXME: check if borrow balance > 0
    >
      <GiPayMoney className="h-5 w-5" />
    </button>
  );

  // Skip the asset if it cannot be borrow
  if (!canBeBorrow) {
    return;
  }

  return (
    <>
      <tr className="gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <th
          scope="row"
          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <VautlAssetInfo
            token={token}
            userBalanceToken={userBalanceToken}
            oraclePriceUSD={oraclePriceUSD as bigint}
          />
        </th>
        <td className="px-6 py-4">
          {apy !== undefined && (
            <div className="text-center flex-shrink-0">
              <div className="text-sm text-blue-600 font-medium">
                {apy?.toFixed(2)}%
              </div>
            </div>
          )}
        </td>
        {/* FIXME: add total borrow value */}
        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {userDebtTokenBalance && (
              <div className="text-center">
                <div className="font-mono text-base font-medium">
                  {formatBalance(
                    userDebtTokenBalance.value,
                    userDebtTokenBalance.decimals
                  )}
                </div>

                {(oraclePriceUSD as BigInt) &&
                  userDebtTokenBalance &&
                  userDebtTokenBalance.value > 0 && (
                    <div className="text-sm text-gray-500">
                      $
                      {convertAssetToUSD(
                        userDebtTokenBalance.value,
                        userDebtTokenBalance.decimals,
                        oraclePriceUSD as bigint
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center space-x-2">
            <PopupButton
              ButtonComponent={BorrowButton}
              ModalComponent={VaultBorrowFormModal}
              modalProps={{
                vaultAddress,
                assetAddress,
              }}
            />

            <PopupButton
              ButtonComponent={RepayButton}
              ModalComponent={VaultRepayFormModal}
              modalProps={{
                vaultAddress,
                assetAddress,
              }}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default VaultBorrowRow;
