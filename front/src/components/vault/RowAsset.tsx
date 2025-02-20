import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, formatUnits, getAddress } from "viem";
import { useAccount, useBalance } from "wagmi";
import PopupButton from "../button/PopupButton";

import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";

// FIXME: See how can we adjust it based on the network
// ie: dynamic adjusting based on network

// Icon - https://app.aave.com/icons/tokens/wbtc.svg

const ORACLE_PRICE_DECIMALS = 8;

const RowDashboardAsset = ({
  vaultAddress,
  assetAddress,
  mode,
  actionButton,
  actionComponent,
}: {
  vaultAddress: Address;
  assetAddress: Address;
  mode: string;
  actionButton: React.ComponentType<{ onClick: () => void }>;
  actionComponent: any;
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];
  let lending_token: Token = LENDING_TOKENS[assetAddress.toLowerCase()];

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

  return (
    <>
      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        {/* Token Icon */}
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

        {/* Token Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold truncate">{token.name}</h2>
            {token.symbol && (
              <span className="text-sm text-gray-500">{token.symbol}</span>
            )}
            {/* Collateral Indicator */}
            {true && ( // FIXME:
              <span
                className="text-sm text-green-500"
                title="This asset can be used as collateral"
              >
                ★
              </span>
            )}
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
                      oraclePriceUSD as bigint,
                      ORACLE_PRICE_DECIMALS
                    )} USD`
                  : "USD price unavailable"}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            </div>
          )}
        </div>

        {/* APY Display - Moved to the Middle */}
        <div className="text-center flex-shrink-0">
          <div className="text-sm text-blue-600 font-medium">{10}%</div>
        </div>

        {/* Balance and Action Section */}
        <div className="flex items-center gap-4 ml-auto">
          {vaultSupplyBalance && (
            <div className="text-right">
              <div className="font-mono text-base font-medium">
                {formatBalance(
                  vaultSupplyBalance.value,
                  vaultSupplyBalance.decimals
                )}
              </div>

              {(oraclePriceUSD as BigInt) &&
                vaultSupplyBalance &&
                vaultSupplyBalance.value > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    $
                    {convertAssetToUSD(
                      vaultSupplyBalance.value,
                      vaultSupplyBalance.decimals,
                      oraclePriceUSD as bigint,
                      ORACLE_PRICE_DECIMALS
                    )}
                  </div>
                )}
            </div>
          )}

          <PopupButton
            ButtonComponent={actionButton}
            ModalComponent={actionComponent}
            modalProps={{
              vaultAddress,
              assetAddress,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default RowDashboardAsset;
