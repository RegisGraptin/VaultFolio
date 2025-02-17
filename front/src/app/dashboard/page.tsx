"use client";

import VaultCard from "@/components/dashboard/VaultCard";
import NewVaultCard from "@/components/dashboard/NewVaultCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { NextPage } from "next";
import { Address, getAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import Manager from "@/abi/Manager.json";
import WalletDisconnected from "@/components/wallet/WalletDisconnected";
import WalletConnecting from "@/components/wallet/WalletConnecting";
import { AAVEPositionProvider } from "@/components/aave/AAVEPositionProvider";

const Dashboard: NextPage = () => {
  const { address: userAddress, isConnected, status } = useAccount();

  const { data: vaultAddresses = [] } = useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_MANAGER_ADDRESS!),
    abi: Manager.abi,
    functionName: "getVaults",
    args: [userAddress],
  });

  // Handle loading state while checking connection status
  if (status === "connecting" || status === "reconnecting") {
    return <WalletConnecting />;
  }

  // Handle disconnected state
  if (!isConnected) {
    return <WalletDisconnected />;
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto pt-10">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
            List of vaults
          </h1>

          <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Show user address */}
            {/* FIXME: Put it inside AAVE */}
            <AAVEPositionProvider contractAddress={userAddress}>
              <VaultCard
                vaultAddress={userAddress} // FIXME: See how to fix it
                lendingValue={10000}
                borrowValue={2000}
                lendingAPY={4.5}
                borrowAPY={3.5}
                healthRatio={2}
                strategies={["automation", "reinvest"]}
              />
            </AAVEPositionProvider>

            {(vaultAddresses as Address[]) &&
              (vaultAddresses as Address[]).map(
                (vaultAddress: Address, index: number) => {
                  return (
                    <AAVEPositionProvider
                      key={index}
                      contractAddress={vaultAddress}
                    >
                      <VaultCard
                        vaultAddress={vaultAddress}
                        lendingValue={20000}
                        borrowValue={0}
                        lendingAPY={4.5}
                        borrowAPY={0}
                        healthRatio={100}
                        strategies={["automation", "reinvest"]}
                      />
                    </AAVEPositionProvider>
                  );
                }
              )}

            {/* {error && error.message} */}
            <NewVaultCard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
