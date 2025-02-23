import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import { Balance, Token } from "@/utils/tokens/tokens";
import Image from "next/image";
import { GetBalanceData } from "wagmi/query";

const VautlAssetInfo = ({
  token,
  userBalanceToken,
  oraclePriceUSD,
}: {
  token: Token;
  userBalanceToken: GetBalanceData | Balance | undefined;
  oraclePriceUSD: bigint | undefined;
}) => {
  return (
    <>
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
              {formatBalance(userBalanceToken.value, userBalanceToken.decimals)}
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
    </>
  );
};

export default VautlAssetInfo;
