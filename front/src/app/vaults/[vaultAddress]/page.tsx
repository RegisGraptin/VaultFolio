"use client";

import { useContractData } from "@/components/aave/AAVEPositionProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import VaultDashboard from "@/components/vault/VaultDashboard";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { Address, getAddress, isAddress } from "viem";
import { useReadContract } from "wagmi";

const VaultPage: NextPage = () => {
  const { vaultAddress } = useParams();
  const isValidAddress = isAddress(vaultAddress as string);

  const contractData = useContractData();

  console.log(contractData);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {isValidAddress && (
          <>
            <VaultDashboard vaultAddress={getAddress(vaultAddress as string)} />

            {/* <p>"some data"</p>
            <p>{contractData?.healthFactor}</p>
            <p>{contractData?.availableBorrowsBase}</p> */}
          </>
        )}

        {!isValidAddress && (
          <>
            {/* TODO: */}
            <h2>Not a valid address</h2>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default VaultPage;
