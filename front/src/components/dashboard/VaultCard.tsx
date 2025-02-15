import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRobot, FaSync } from "react-icons/fa";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import Vault from "@/abi/Vault.json";
import AAVEPool from "@/abi/Pool.json";
import { useContractData } from "../aave/AAVEPositionProvider";

interface VaultCardProps {
  vaultAddress: Address;
  title: string;
  lendingValue: number;
  borrowValue: number;
  lendingAPY: number;
  borrowAPY: number;
  healthRatio: number;
  strategies: string[];
  color?: "red" | "blue" | "green" | "purple" | "yellow";
}

// TODO: fetch "getUserAccountData" function for each "vault"

const VaultCard: React.FC<VaultCardProps> = ({
  vaultAddress,
  title,
  // lendingValue,
  borrowValue,
  lendingAPY,
  borrowAPY,
  healthRatio,
  strategies,
  color = "blue",
}) => {
  // Read vault data
  // const { data: vaultData, error } = useReadContract({
  //   address: vaultAddress,
  //   abi: Vault.abi,
  //   functionName: "",
  //   args: [],
  // });

  const [lendingValue, setLendingValue] = useState<number>(0);
  const accountData = useContractData();

  useEffect(() => {
    console.log("Vault data: ", vaultAddress);
    console.log("READ data: ", accountData);

    if (accountData !== undefined) {
      const formattedCollateral = Number(accountData.totalCollateralBase) / 1e8;
      setLendingValue(formattedCollateral);
      console.log(`$${formattedCollateral.toFixed(2)} USD`);
    }
  }, [accountData]);

  const colorClasses = {
    red: "bg-red-100 text-red-800 border-red-300",
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  const shadowIntensity =
    healthRatio < 1.5 ? "shadow-red-500" : "shadow-green-500";
  const heartColor = healthRatio < 1.5 ? "text-red-500" : "text-green-500";

  // FIXME: Search name and color here
  // FIXME: Need to think to adjust it if wallet!

  return (
    <Link href={`/vaults/${vaultAddress}`}>
      <div
        className={`relative w-full max-w-sm p-6 rounded-xl border-2 ${colorClasses[color]} 
      transition-all hover:shadow-lg text-center shadow-md ${shadowIntensity}`}
      >
        <h3 className="text-xl font-semibold uppercase tracking-wide mb-3">
          {title}
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
