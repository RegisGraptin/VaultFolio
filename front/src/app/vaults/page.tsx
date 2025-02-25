"use client";

import { NextPage } from "next";
import { Address, getAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import Manager from "@/abi/Manager.json";
import { AAVEPositionProvider } from "@/components/aave/AAVEPositionProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VaultDetailWidget from "@/components/dashboard/widget/VaultDetailWidget";
import VaultTotalBalanceHeader from "@/components/dashboard/card/VaultTotalBalanceHeader";
import PopupButton from "@/components/button/PopupButton";
import { FaPlusCircle } from "react-icons/fa";
import CreateVaultFormModal from "@/components/dashboard/form/CreateVaultFormModal";

const NewVaultWidget: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="w-full p-6 rounded-xl border-2 border-dashed border-gray-400 transition-all hover:shadow-lg text-center flex flex-col items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <FaPlusCircle className="text-gray-500 text-4xl mb-3" />
    <h3 className="text-lg font-semibold text-gray-600">Create New Vault</h3>
  </div>
);

const VaultDashboardPage: NextPage = () => {
  const { address: userAddress } = useAccount();

  const { data: vaultAddresses = [] } = useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_MANAGER_ADDRESS!),
    abi: Manager.abi,
    functionName: "getVaults",
    args: [userAddress],
  });

  return (
    <DashboardLayout>
      <section className="container mx-auto pt-10">
        <VaultTotalBalanceHeader />

        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
          List of vaults
        </h1>

        <div className="grid gap-4 p-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {/* Show user address */}
          <VaultDetailWidget vaultAddress={userAddress!} />

          {(vaultAddresses as Address[]) &&
            (vaultAddresses as Address[]).map(
              (vaultAddress: Address, index: number) => {
                return (
                  // FIXME: Remove AAVE layout here
                  <AAVEPositionProvider
                    key={index}
                    contractAddress={vaultAddress}
                  >
                    <VaultDetailWidget
                      vaultAddress={vaultAddress}
                      vaultIndex={index + 1}
                    />
                  </AAVEPositionProvider>
                );
              }
            )}

          {/* {error && error.message} */}

          <PopupButton
            ButtonComponent={NewVaultWidget}
            ModalComponent={CreateVaultFormModal}
          />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default VaultDashboardPage;
