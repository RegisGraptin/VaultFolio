"use client";

import { useContractData } from "@/components/aave/AAVEPositionProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import VaultDashboard from "@/components/vault/VaultDashboard";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { getAddress, isAddress } from "viem";

import Link from "next/link";
import { useVault } from "@/utils/hook/vault";

const VaultPage: NextPage = () => {
  const { vaultAddress } = useParams();
  const isValidAddress = isAddress(vaultAddress as string);

  const contractData = useContractData();

  const { data: vaultName } = useVault(vaultAddress as string, "name");

  console.log("Contract Data:", contractData);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {isValidAddress && (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <div className="flex items-center">
                      <Link
                        href="/dashboard"
                        title="Dashboard"
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="h-4 w-4 flex-shrink-0 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="ml-2 text-sm font-medium text-gray-700 aria-[current=page]:text-gray-500">
                        {vaultName as string}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
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
