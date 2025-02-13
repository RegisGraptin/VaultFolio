import Image from "next/image";
import { Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, formatUnits } from "viem";
import { useBalance, useReadContracts } from "wagmi";

// FIXME: See how can we adjust it based on the network
// ie: dynamic adjusting based on network

// Icon - https://app.aave.com/icons/tokens/wbtc.svg

const RowDashboardAsset = ({ assetAddress }: { assetAddress: Address }) => {
  const { data: userBalance } = useBalance({ address: assetAddress });

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];

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

        {/* Balance Information */}
        {userBalance && (
          <div className="flex-shrink-0 ml-auto text-right">
            <div className="font-mono text-base font-medium">
              {formatBalance(userBalance.value, userBalance.decimals)}
            </div>
            {/* {userBalance.fiatValue && (
              <div className="text-sm text-gray-500">
                ${userBalance.fiatValue.toFixed(2)}
              </div>
            )} */}
          </div>
        )}
      </div>
    </>
  );
};

export default RowDashboardAsset;
