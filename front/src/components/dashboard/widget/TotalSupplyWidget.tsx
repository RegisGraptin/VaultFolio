"use client";

import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import VaultAssetInfo from "@/components/vault/common/VaultAssetInfo";
import WidgetLayout from "./WidgetLayout";
import {
  Balance,
  LENDING_TOKENS,
  Token,
  TOKEN_ASSETS,
} from "@/utils/tokens/tokens";
import { useAccount, useBalance } from "wagmi";
import { useListVaults, useVault } from "@/utils/hook/vault";
import { Address, getAddress } from "viem";
import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import { useEffect, useMemo, useState } from "react";
import { getVaultColor } from "@/utils/vault/colors";

const VaultTokenSupply = ({
  vaultAddress,
  tokenAddress,
  oraclePriceUSD,
  updateBalance,
  getBalancePercent,
  className,
}: {
  vaultAddress: Address;
  tokenAddress: Address;
  oraclePriceUSD: any;
  updateBalance: (address: Address, balance: Balance) => void;
  getBalancePercent: (balance: Balance) => number;
  className?: string;
}) => {
  const { data: vaultBalance } = useBalance({
    address: vaultAddress,
    token: LENDING_TOKENS[tokenAddress.toLowerCase()].address,
  });

  const { data: vaultName } = useVault(vaultAddress as string, "name");
  const { data: vaultColorIndex } = useVault(vaultAddress, "color");

  useEffect(() => {
    if (vaultBalance) {
      updateBalance(vaultAddress, vaultBalance);
    }
  }, [vaultBalance]);

  return (
    <>
      <tr
        className={`bg-gray-50 hover:bg-gray-100/60 transition-colors border-t border-gray-100 ${className}`}
      >
        <td className="px-6 py-3 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-3 pl-8 border-l-2 border-indigo-200">
            <div
              className={`w-6 h-6 rounded-md ${getVaultColor(vaultColorIndex as number)}`}
            />
            {vaultName ? (vaultName as string) : "My Wallet"}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
              {vaultBalance && getBalancePercent(vaultBalance).toFixed(2) + "%"}
            </span>
          </div>
        </td>
        <td className="px-6 py-3 text-center">
          {formatBalance(vaultBalance?.value, vaultBalance?.decimals)}
        </td>
        <td className="px-6 py-3 text-center font-mono text-sm text-gray-900">
          {(oraclePriceUSD as BigInt) &&
          vaultBalance &&
          vaultBalance.value > 0 ? (
            <div className="text-sm text-gray-500">
              $
              {convertAssetToUSD(
                vaultBalance.value,
                vaultBalance.decimals,
                oraclePriceUSD as bigint
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">-</div>
          )}
        </td>
      </tr>
    </>
  );
};

const TokenSupplyRow = ({
  tokenAddress,
  token,
}: {
  tokenAddress: Address;
  token: Token;
}) => {
  const { address: userAddress } = useAccount();

  const { data: vaults } = useListVaults(userAddress) as {
    data: Address[] | undefined;
  };

  const { data: addressPriceOracle } = useOracle("getPriceOracle");

  const { data: oraclePriceUSD } = usePriceOracle(
    addressPriceOracle,
    "getAssetPrice",
    [getAddress(tokenAddress)]
  );

  const [balances, setBalances] = useState<Record<string, Balance>>({});
  const [totalValue, setTotalValue] = useState<bigint>(BigInt(0));

  const getBalancePercent = (balance: Balance) => {
    if (balance.value > 0 && totalValue > 0) {
      return (Number(balance.value) / Number(totalValue)) * 100;
    }
    return 0.0;
  };

  const updateBalance = (address: Address, balance: Balance) => {
    setBalances((prev) => ({ ...prev, [address]: balance }));
  };

  useEffect(() => {
    if (balances) {
      let totalValue = Object.values(balances).reduce(
        (sum, balance: Balance) => sum + balance.value,
        BigInt(0)
      );
      setTotalValue(totalValue);
    }
  }, [balances]);

  let totalBalance: Balance = {
    decimals: token.decimals,
    // symbol: token.symbol,
    value: totalValue,
  };

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const handleRowClick = () => {
    setShowDetail(!showDetail);
  };

  return (
    <>
      <tr
        onClick={() => handleRowClick()}
        className="gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
      >
        <th
          scope="row"
          className={`
            ${Number(totalBalance?.value) > 0 ? "bg-gray-50" : ""} 
            flex items-center gap-4 p-3 rounded-lg transition-colors text-left`}
        >
          <VaultAssetInfo
            token={token}
            userBalanceToken={totalBalance}
            oraclePriceUSD={oraclePriceUSD as bigint}
          />
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 transform transition-transform ${
              showDetail ? "rotate-180" : ""
            }`}
          />
        </th>
        <td className="px-6 py-4 text-center">
          {formatBalance(totalBalance?.value, totalBalance?.decimals)}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {(oraclePriceUSD as BigInt) &&
            totalBalance &&
            totalBalance.value > 0 ? (
              <div className="text-sm text-gray-500">
                $
                {convertAssetToUSD(
                  totalBalance.value,
                  totalBalance.decimals,
                  oraclePriceUSD as bigint
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">-</div>
            )}
          </div>
        </td>
      </tr>
      {[userAddress, ...(vaults || [])].map((vaultAddress, index) => (
        <VaultTokenSupply
          key={index}
          tokenAddress={tokenAddress}
          vaultAddress={vaultAddress as Address}
          oraclePriceUSD={oraclePriceUSD}
          updateBalance={updateBalance}
          getBalancePercent={getBalancePercent}
          className={showDetail ? "visible" : "hidden"}
        />
      ))}
      {/* Summary Row */}
      {/* <tr className="bg-gray-50 border-t border-gray-100">
            <td colSpan={3} className="px-6 py-3 text-sm text-gray-500">
              <div className="flex justify-between items-center pl-8">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                  View Detailed Report
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr> */}
    </>
  );
};

const TotalSupplyWidget = () => {
  return (
    <WidgetLayout>
      <h2 className="text-lg font-semibold">Your supplies</h2>
      <div>
        <table className="w-full table-auto min-w-max">
          <thead className="text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                Assets
              </th>
              <th scope="col" className="px-6 py-3">
                Balance
              </th>
              <th scope="col" className="px-6 py-3">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(TOKEN_ASSETS).map(
              ([tokenAddress, token], index) => {
                return (
                  <TokenSupplyRow
                    key={index}
                    tokenAddress={getAddress(tokenAddress)}
                    token={token}
                  />
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </WidgetLayout>
  );
};

export default TotalSupplyWidget;
