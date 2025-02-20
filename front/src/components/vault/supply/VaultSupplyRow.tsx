import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, getAddress } from "viem";
import { useAccount, useBalance } from "wagmi";
import PopupButton from "../../button/PopupButton";

import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import VaultSupplyFormModal from "./VaultSupplyFormModal";

import { ReserveDataLegacy, useAave } from "@/utils/hook/aave";
import { useEffect, useState } from "react";
import VautlAssetInfo from "../common/VaultAssetInfo";

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
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Supply ${token.name}`}
      onClick={onClick}
      disabled={userBalanceToken?.value === BigInt(0)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      {/* Supply */}
    </button>
  );

  const WithdrawButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Withdraw ${token.name}`}
      onClick={onClick}
      disabled={vaultSupplyBalance?.value === BigInt(0)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {/* Withdraw */}
    </button>
  );

  const { data: userBalanceToken } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  const { data: vaultSupplyBalance } = useBalance({
    address: vaultAddress,
    token: lending_token.address,
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
          <div className="flex space-x-2">
            <PopupButton
              ButtonComponent={SupplyButton}
              ModalComponent={VaultSupplyFormModal}
              modalProps={{
                vaultAddress,
                assetAddress,
              }}
            />
            <PopupButton
              ButtonComponent={WithdrawButton}
              ModalComponent={VaultSupplyFormModal}
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

export default VaultSupplyRow;
