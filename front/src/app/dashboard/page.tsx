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
import MonthlyRewardWidget from "@/components/dashboard/widget/MonthlyRewardWidget";
import AllocationWidget from "@/components/dashboard/widget/AllocationWidget";
import TotalSupplyWidget from "@/components/dashboard/widget/TotalSupplyWidget";

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
      <section className="container mx-auto pt-10">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
          Overview Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-stretch mb-2">
          <div className="w-full h-full xl:col-span-2">
            <PortfolioOverviewWidget />
          </div>
          <div className="w-full h-full xl:col-span-1">
            <AllocationWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 auto-rows-auto">
          <div className="w-full xl:col-span-2">
            <TotalSupplyWidget />
          </div>
          <div className="w-full xl:col-span-1">
            <MonthlyRewardWidget />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
