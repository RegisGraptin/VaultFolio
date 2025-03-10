import Image from "next/image";
import { MdOutlinePayments } from "react-icons/md";
import { PiPiggyBank } from "react-icons/pi";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, getAddress } from "viem";
import { useAccount, useBalance } from "wagmi";
import PopupButton from "../../button/PopupButton";

import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import VaultSupplyFormModal from "./VaultSupplyFormModal";

import { ReserveDataLegacy, useAave } from "@/utils/hook/aave";
import { useEffect, useState } from "react";
import VaultAssetInfo from "../common/VaultAssetInfo";
import VaultWithdrawFormModal from "./VaultWithdrawFormModal";
import ActionButton from "@/components/button/ActionButton";
import { usePortfolioBorrowing, usePortfolioLending } from "@/utils/hook/vault";

const VaultSupplyRow = ({
  vaultAddress,
  assetAddress,
}: {
  vaultAddress: Address;
  assetAddress: Address;
}) => {
  const { address: userAddress } = useAccount();

  const [apy, setApy] = useState<Number | undefined>(undefined);

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];
  let lending_token: Token = LENDING_TOKENS[assetAddress.toLowerCase()];

  const SupplyButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <ActionButton
      label="Supply"
      Icon={PiPiggyBank}
      aria-label={`Supply ${token.name}`}
      onClick={onClick}
      disabled={userBalanceToken?.value === BigInt(0)}
    />
  );

  const WithdrawButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <ActionButton
      label="Withdraw"
      Icon={MdOutlinePayments}
      aria-label={`Withdraw ${token.name}`}
      onClick={onClick}
      disabled={vaultSupplyBalance?.value === BigInt(0)}
    />
  );

  const { data: userBalanceToken, refetch: refetchUserBalance } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  const { data: vaultSupplyBalance, refetch: refetchVaultBalance } = useBalance(
    {
      address: vaultAddress,
      token: lending_token.address,
    }
  );

  const { totalBorrowing, refetchBalance: refetchBorrowing } =
    usePortfolioBorrowing({
      vaultAddress,
    });

  const { totalLending, refetchBalance: refetchLending } = usePortfolioLending({
    vaultAddress,
  });

  const { data: addressPriceOracle } = useOracle("getPriceOracle");

  const { data: oraclePriceUSD } = usePriceOracle(
    addressPriceOracle,
    "getAssetPrice",
    [getAddress(assetAddress)]
  );

  // Get asset information from the AAVE pool
  const { data: reserveData } = useAave("getReserveData", [assetAddress]);

  useEffect(() => {
    if (reserveData) {
      // Get the APY from the reserve data
      const liquidityRate = (reserveData as ReserveDataLegacy)
        .currentLiquidityRate;
      const apy = Number(liquidityRate) / 1e25;
      setApy(apy);

      // TODO: Isolated bit mask not working as expected, skip ATM.
      // // Check if the asset is isolated
      // const assetConfiguration = (reserveData as ReserveDataLegacy)
      //   .configuration.data;
    }
  }, [reserveData]);

  return (
    <>
      <tr
        className={`
        hover:bg-gray-100 rounded-lg transition-colors`}
      >
        <th
          scope="row"
          className={`
            ${Number(vaultSupplyBalance?.value) > 0 ? "bg-gray-100" : ""} 
            flex items-center gap-4 p-3 rounded-lg transition-colors text-left`}
        >
          <VaultAssetInfo
            token={token}
            userBalanceToken={userBalanceToken}
            oraclePriceUSD={oraclePriceUSD as bigint}
          />
        </th>
        <td className="px-6 py-4">
          {apy !== undefined && (
            <div className="text-center flex-shrink-0">
              <div
                className={`text-sm font-medium ${Number(apy) > 0 ? "text-green-700" : ""}`}
              >
                {apy?.toFixed(2)}%
              </div>
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {vaultSupplyBalance && (
              <div className="text-center">
                <div className="font-mono text-base font-medium">
                  {formatBalance(
                    vaultSupplyBalance.value,
                    vaultSupplyBalance.decimals
                  )}
                </div>

                {(oraclePriceUSD as BigInt) &&
                  vaultSupplyBalance &&
                  vaultSupplyBalance.value > 0 && (
                    <div className="text-sm text-gray-500">
                      $
                      {convertAssetToUSD(
                        vaultSupplyBalance.value,
                        vaultSupplyBalance.decimals,
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
              ButtonComponent={SupplyButton}
              ModalComponent={VaultSupplyFormModal}
              modalProps={{
                vaultAddress,
                assetAddress,
                onClose: async () => {
                  // Refresh the vault & user balance
                  await refetchUserBalance();
                  await refetchVaultBalance();
                  await refetchLending();
                  await refetchBorrowing();
                },
                supplyApy: apy,
              }}
            />
            <PopupButton
              ButtonComponent={WithdrawButton}
              ModalComponent={VaultWithdrawFormModal}
              modalProps={{
                vaultAddress,
                assetAddress,
                totalLending: totalLending,
                totalBorrowing: totalBorrowing,
                onClose: async () => {
                  // Refresh the vault & user balance
                  await refetchUserBalance();
                  await refetchVaultBalance();
                  await refetchLending();
                  await refetchBorrowing();
                },
                supplyApy: apy,
              }}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default VaultSupplyRow;
