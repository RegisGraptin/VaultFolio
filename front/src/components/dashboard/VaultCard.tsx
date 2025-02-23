"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRobot, FaSync } from "react-icons/fa";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import Vault from "@/abi/Vault.json";
import AAVEPool from "@/abi/Pool.json";
import { useContractData } from "../aave/AAVEPositionProvider";
import { getVaultColor, VAULT_COLORS } from "@/utils/vault/colors";
import { useVault } from "@/utils/hook/vault";

interface VaultCardProps {
  vaultAddress: Address;
  lendingValue: number;
  borrowValue: number;
  lendingAPY: number;
  borrowAPY: number;
  healthRatio: number;
  strategies: string[];
}

// TODO: fetch "getUserAccountData" function for each "vault"

const VaultCard: React.FC<VaultCardProps> = ({
  vaultAddress,
  // lendingValue,
  borrowValue,
  lendingAPY,
  borrowAPY,
  healthRatio,
  strategies,
}) => {
  // Read vault data
  const { data: vaultName } = useVault(vaultAddress, "name");
  const { data: vaultColorIndex } = useVault(vaultAddress, "color");

  const [lendingValue, setLendingValue] = useState<number>(0);
  const accountData = useContractData();

  useEffect(() => {
    if (accountData !== undefined) {
      const formattedCollateral = Number(accountData.totalCollateralBase) / 1e8;
      setLendingValue(formattedCollateral);
      console.log(`$${formattedCollateral.toFixed(2)} USD`);
    }
  }, [accountData]);

  const shadowIntensity =
    healthRatio < 1.5 ? "shadow-red-500" : "shadow-green-500";
  const heartColor = healthRatio < 1.5 ? "text-red-500" : "text-green-500";

  return (
    <Link href={`/vaults/${vaultAddress}`}>
      <div
        className={`w-full max-w-sm p-6 rounded-xl border-2 ${getVaultColor(vaultColorIndex as number)} 
      transition-all hover:shadow-lg text-center shadow-md ${shadowIntensity}`}
      >
        <h3 className="text-xl font-semibold uppercase tracking-wide mb-3">
          {vaultName ? (vaultName as string) : "Wallet"}
        </h3>

        <div className="flex justify-between items-center w-full mb-3">
          <div className="text-green-500">
            <p className="text-lg font-semibold">${lendingValue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Lending</p>
          </div>
          <div className="text-red-500">
            <p className="text-lg font-semibold">
              ${borrowValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Borrow</p>
          </div>
        </div>

        <div className="flex justify-between items-center w-full mb-4">
          <span className="text-lg font-semibold">{lendingAPY}%</span>
          <div className="flex items-center">
            <FaHeart className={`${heartColor} mr-2`} />
            <span className="text-lg font-semibold">
              {healthRatio.toFixed(2)}
            </span>
          </div>
          <span className="text-lg font-semibold text-red-500">
            {borrowAPY}%
          </span>
        </div>

        <div className="flex justify-center space-x-4">
          {strategies.map((strategy, index) => (
            <div key={index} className="text-gray-600 text-xl">
              {strategy === "automation" && <FaRobot />}
              {strategy === "reinvest" && <FaSync />}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default VaultCard;
