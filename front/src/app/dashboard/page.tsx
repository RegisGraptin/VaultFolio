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
import DashboardCardHeader from "@/components/dashboard/card/DashboardCardHeader";
import BalanceOverview from "@/components/dashboard/card/BalanceOverview";
import QuickActions from "@/components/dashboard/card/QuickActions";
import TransactionHistory from "@/components/dashboard/card/TransactionHistory";
import SidebarMenu from "@/components/dashboard/SidebarMenu";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PortfolioOverviewWidget from "@/components/dashboard/widget/PortfolioOverviewWidget";

const Dashboard: NextPage = () => {
  const { address: userAddress } = useAccount();

  const { data: vaultAddresses = [] } = useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_MANAGER_ADDRESS!),
    abi: Manager.abi,
    functionName: "getVaults",
    args: [userAddress],
  });

  return (
    <DashboardLayout>
      <DashboardCardHeader />

      <section className="container mx-auto pt-10">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
          Overview Dashboard
        </h1>

        <PortfolioOverviewWidget />
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
