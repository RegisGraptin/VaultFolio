"use client";

import { createContext, useContext, useEffect } from "react";
import { useReadContract } from "wagmi";

import AAVEPool from "@/abi/Pool.json";
import { Address } from "viem";

// uint256 totalCollateralBase,
// uint256 totalDebtBase,
// uint256 availableBorrowsBase,
// uint256 currentLiquidationThreshold,
// uint256 ltv,
// uint256 healthFactor

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
  const { data, refetch, error } = useReadContract({
    address: process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL as Address,
    abi: AAVEPool.abi,
    functionName: "getUserAccountData",
    args: [contractAddress],
  });

  // FIXME: manage the case where no instance has been created yet!

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 180_000); // Adjust the interval as needed (e.g., 10000 ms for 10 seconds)

    return () => clearInterval(interval);
  }, [refetch]);

  // FIXME: chekc or better solution
  //   const parsedData = data
  //     ? {
  //         totalCollateralETH: data[0],
  //         totalDebtETH: data[1],
  //         availableBorrowsETH: data[2],
  //         currentLiquidationThreshold: data[3],
  //         ltv: data[4],
  //         healthFactor: data[5],
  //       }
  //     : null;

  // FIXME: Need to do smth?
  // console.log("data fetch");
  // console.log(data);
  // console.log(contractAddress);

  // console.log("error data");
  // console.log(error);

  return (
    <ContractDataContext.Provider value={data as UserAccountData}>
      {children}
    </ContractDataContext.Provider>
  );
}

export function useContractData() {
  return useContext(ContractDataContext);
}
