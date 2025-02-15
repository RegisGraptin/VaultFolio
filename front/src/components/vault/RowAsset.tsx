import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, formatUnits, getAddress } from "viem";
import { useBalance, useReadContract, useReadContracts } from "wagmi";
import PopupButton from "../button/PopupButton";
import SupplyFormModal from "./SupplyFormModal";

import AAVEPool from "@/abi/Pool.json";

// FIXME: See how can we adjust it based on the network
// ie: dynamic adjusting based on network

// Icon - https://app.aave.com/icons/tokens/wbtc.svg

const RowDashboardAsset = ({
  vaultAddress,
  assetAddress,
}: {
  vaultAddress: Address;
  assetAddress: Address;
}) => {
  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];
  let lending_token: Token = LENDING_TOKENS[assetAddress.toLowerCase()];

  console.log(lending_token);

  // const { data: userBalanceToken } = useBalance({
  //   address: vaultAddress,
  //   token: assetAddress,
  // });

  const { data: vaultSupplyBalance } = useBalance({
    address: vaultAddress,
    token: lending_token.address,
  });

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
  const formatBalance = (value?: bigint, decimals?: number) => {
    if (!value || decimals === undefined) return "0";

    const formattedValue = formatUnits(value, decimals);
    const [integerPart, decimalPart] = formattedValue.split(".");

    // Show only the last 4 decimals
    const truncatedDecimalPart = decimalPart ? decimalPart.slice(-4) : "";
    const truncatedValue = truncatedDecimalPart
      ? `${integerPart}.${truncatedDecimalPart}`
      : integerPart;

    return truncatedValue;
  };

  // FIXME: Pop up Amount need to be selected / Asset / Quantity / value in dollars / APY / collaterization info / gas?

  const supplyToken = () => {};

  // FIXME: Invalid value for the WETH...

  const SupplyButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Supply ${token.name}`}
      onClick={onClick}
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

          {/* Optional Metadata */}
          {/* {token.description && (
            <p className="text-sm text-gray-600 truncate">
              {token.description}
            </p>
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
        {}
      </div>
    </>
  );
};

export default RowDashboardAsset;
