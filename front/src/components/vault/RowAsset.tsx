import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, formatUnits, getAddress } from "viem";
import {
  useAccount,
  useBalance,
  useEstimateFeesPerGas,
  useReadContract,
} from "wagmi";
import PopupButton from "../button/PopupButton";
import SupplyFormModal from "./SupplyFormModal";

import IPoolAddressesProvider from "@/abi/IPoolAddressesProvider.json";
import IPriceOracle from "@/abi/IPriceOracleGetter.json";
import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";

// FIXME: See how can we adjust it based on the network
// ie: dynamic adjusting based on network

// Icon - https://app.aave.com/icons/tokens/wbtc.svg

const ORACLE_PRICE_DECIMALS = 8;

const RowDashboardAsset = ({
  vaultAddress,
  assetAddress,
}: {
  vaultAddress: Address;
  assetAddress: Address;
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

  // console.log("addressPriceOracle: ", addressPriceOracle);
  // console.log("oracleAssetPrice: ", oraclePriceUSD);

  // function getReserveData(address asset) external view returns (DataTypes.ReserveDataLegacy memory);

  // const { data: reserveData, error } = useReadContract({
  //   address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL!),
  //   abi: AAVEPool.abi,
  //   functionName: "getReserveData",
  //   args: [assetAddress],
  // });

  // if (reserveData) {
  //   console.log(
  //     `"${assetAddress}": { address: "${reserveData["aTokenAddress"]}"}`
  //   );
  // }

  // let aToken = "0xD49d1CF2886B1c95A94e8a9066E8b298646716b6";

  // const { data } = useReadContracts({
  //   contracts: [
  //     {
  //       address: aToken,
  //       abi: erc20Abi,
  //       functionName: "name",
  //     },
  //     {
  //       address: aToken,
  //       abi: erc20Abi,
  //       functionName: "symbol",
  //     },
  //     {
  //       address: aToken,
  //       abi: erc20Abi,
  //       functionName: "decimals",
  //     },
  //   ],
  // });
  // console.log(data);

  // if (data) {
  //   console.log(`
  // "${assetAddress}": {
  //     name: "${data[0].result}",
  //     symbol: "${data[1].result}",
  //     decimals: ${data[2].result},
  //   },
  // `);
  // }

  //   if (assetAddress in TOKEN_ASSETS) {
  //     token = TOKEN_ASSETS[assetAddress];
  //   }
  //   else {
  //     // FIXME: Issue here!!!
  //     const { data } = useReadContracts({
  //       allowFailure: false,
  //       contracts: [
  //         {
  //           address: assetAddress,
  //           abi: erc20Abi,
  //           functionName: "name",
  //         },
  //         {
  //           address: assetAddress,
  //           abi: erc20Abi,
  //           functionName: "symbol",
  //         },
  //         {
  //           address: assetAddress,
  //           abi: erc20Abi,
  //           functionName: "decimals",
  //         },
  //       ],
  //     });
  //     console.log(data);

  //     if (data) {
  //       token = {
  //         address: assetAddress,
  //         name: data[0],
  //         symbol: data[1],
  //         decimals: data[2],
  //       };

  //       console.log(`"Fetch new token data at "${assetAddress}"`);
  //       console.log(
  //         `{ address: "${assetAddress}", name: "${token.name}", symbol: "${token.symbol}", decimals: ${token.decimals} },`
  //       );
  //     } else {
  //       console.log(`Issue when fetching token data at "${assetAddress}"`);
  //       return;
  //     }
  //   }

  // FIXME: to much for nothin I guess --> Need to simplify it!

  // FIXME: Pop up Amount need to be selected / Asset / Quantity / value in dollars / APY / collaterization info / gas?

  const supplyToken = () => {};

  // FIXME: Invalid value for the WETH...

  useEstimateFeesPerGas();

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
          </div>
          {/* // In your component where you have the balance display: */}
          {userBalanceToken && (
            <div className="group/tooltip relative inline-block">
              {" "}
              {/* Added tooltip scope */}
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

          {/* Optional Metadata
          {userBalanceToken && (
            <>
              <p
                data-tooltip-target="tooltip-default"
                className="text-sm text-gray-600 truncate"
              >
                Available:{" "}
                {formatBalance(
                  userBalanceToken.value,
                  userBalanceToken.decimals
                )}
              </p>

              <div
                id="tooltip-default"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
              >
                Tooltip content
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </>
          )} */}
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
              {/* FIXME: Put value in dollars */}
              {/* {userBalance.fiatValue && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ${userBalance.fiatValue.toFixed(2)}
                </div>
              )} */}
            </div>
          )}

          <PopupButton
            ButtonComponent={SupplyButton}
            ModalComponent={SupplyFormModal}
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
