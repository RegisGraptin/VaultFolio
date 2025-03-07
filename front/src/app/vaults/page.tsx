"use client";

import { NextPage } from "next";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { AAVEPositionProvider } from "@/components/aave/AAVEPositionProvider";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VaultDetailWidget from "@/components/dashboard/widget/VaultDetailWidget";
import PopupButton from "@/components/button/PopupButton";
import { FaPlusCircle } from "react-icons/fa";
import CreateVaultFormModal from "@/components/dashboard/form/CreateVaultFormModal";
import TotalVaultOverviewWidget from "@/components/vault/widget/TotalVaultOverviewWidget";
import { useListVaults } from "@/utils/hook/vault";

const NewVaultWidget: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="w-full p-6 rounded-xl border-2 border-dashed border-gray-400 transition-all hover:shadow-lg text-center flex flex-col items-center justify-center cursor-pointer min-h-[500px]"
    onClick={onClick}
  >
    <FaPlusCircle className="text-gray-500 text-4xl mb-3" />
    <h3 className="text-lg font-semibold text-gray-600">Create New Vault</h3>
  </div>
);

const VaultDashboardPage: NextPage = () => {
  const { address: userAddress } = useAccount();
  const { data: vaultAddresses } = useListVaults(userAddress);

  return (
    <DashboardLayout>
      <section className="container mx-auto">
        <TotalVaultOverviewWidget
          vaultAddresses={vaultAddresses as Address[]}
        />

        {/* <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
          List of vaults
        </h1>  */}

        <div className="pt-4 grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
