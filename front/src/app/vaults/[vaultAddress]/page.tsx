"use client";

import { NextPage } from "next";
import { useParams } from "next/navigation";
import { getAddress, isAddress } from "viem";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VaultNavigation, {
  VAULT_VIEW_TABS,
} from "@/components/vault/widget/VaultNavigation";
import { useState } from "react";

import VaultDetailManageView from "@/components/vault/view/VaultDetailManageView";

const VaultPage: NextPage = () => {
  const { vaultAddress } = useParams();
  const isValidAddress = isAddress(vaultAddress as string);

  const [activeTab, setActiveTab] = useState(VAULT_VIEW_TABS[0]);

  if (!isValidAddress) {
    return (
      <>
        {/* FIXME: */}
        <h2>Not a valid address</h2>
      </>
    );
  }

  return (
    <>
      <DashboardLayout>
        <VaultNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <VaultDetailManageView
          activeTab={activeTab}
          vaultAddress={getAddress(vaultAddress as string)}
        />
      </DashboardLayout>
    </>
  );
};

export default VaultPage;
