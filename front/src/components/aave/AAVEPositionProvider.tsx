"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useReadContract } from "wagmi";

import AAVEPool from "@/abi/Pool.json";
import { Address } from "viem";

interface UserAccountData {
  totalCollateralBase: bigint;
  totalDebtBase: bigint;
  availableBorrowsBase: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

const ContractDataContext = createContext<UserAccountData | undefined>(
  undefined
);

export function AAVEPositionProvider({
  contractAddress,
  children,
}: {
  contractAddress: Address;
  children: React.ReactNode;
}) {
  const [accountData, setAccountData] = useState<UserAccountData>();

  const { data, refetch, error } = useReadContract({
    address: process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL as Address,
    abi: AAVEPool.abi,
    functionName: "getUserAccountData",
    args: [contractAddress],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 180_000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (!data) return;

    const [
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    ] = data as bigint[];

    setAccountData({
      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor,
    });
  }, [data]);

  return (
    <ContractDataContext.Provider value={accountData}>
      {children}
    </ContractDataContext.Provider>
  );
}

export function useContractData() {
  return useContext(ContractDataContext);
}
