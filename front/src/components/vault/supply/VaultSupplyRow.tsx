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
      Supply
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
          <div className="flex-shrink-0">
            <Image
              className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={`/images/tokens/${token.name.toLowerCase()}.svg`}
              alt={`${token.name} logo`}
              width={40}
              height={40}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold truncate">{token.name}</h2>
              {token.symbol && (
                <span className="text-sm text-gray-500">{token.symbol}</span>
              )}
              {/* Collateral Indicator */}
              {/* {isIsolated && ( // TODO: Skip this information ATM
                <span
                  className="text-sm text-green-500"
                  title="This asset can be used as collateral"
                >
                  ★
                </span>
              )} */}
            </div>
            {/* Available Balance */}
            {userBalanceToken && (
              <div className="group/tooltip relative inline-block">
                <p className="text-sm text-gray-600 truncate">
                  Available:{" "}
                  {formatBalance(
                    userBalanceToken.value,
                    userBalanceToken.decimals
                  )}
                </p>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 px-2 py-1 text-xs text-white bg-gray-800 rounded-md transition-opacity duration-200 group-hover/tooltip:opacity-100">
                  {oraclePriceUSD
                    ? `$${convertAssetToUSD(
                        userBalanceToken.value,
                        userBalanceToken.decimals,
                        oraclePriceUSD as bigint
                      )} USD`
                    : "USD price unavailable"}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-800 rotate-45" />
                </div>
              </div>
            )}
          </div>
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
          <PopupButton
            ButtonComponent={SupplyButton}
            ModalComponent={VaultSupplyFormModal}
            modalProps={{
              vaultAddress,
              assetAddress,
            }}
          />
        </td>
      </tr>
    </>
  );
};

export default VaultSupplyRow;
