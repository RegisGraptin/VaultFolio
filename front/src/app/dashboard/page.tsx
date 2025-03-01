"use client";

import { NextPage } from "next";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PortfolioOverviewWidget from "@/components/dashboard/widget/PortfolioOverviewWidget";
import MonthlyRewardWidget from "@/components/dashboard/widget/MonthlyRewardWidget";
import AllocationWidget from "@/components/dashboard/widget/AllocationWidget";
import TotalSupplyWidget from "@/components/dashboard/widget/TotalSupplyWidget";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { useListVaults } from "@/utils/hook/vault";

const Dashboard: NextPage = () => {
  const { address: userAddress } = useAccount();
  const { data: vaultAddresses } = useListVaults(userAddress);
  
  return (
    <DashboardLayout>
      <h1 className="pt-10 mb-4 text-5xl font-extrabold tracking-tight text-gray-900">
        Overview Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-stretch mb-2">
        <div className="w-full h-full xl:col-span-2">
          <PortfolioOverviewWidget vaultAddresses={vaultAddresses as Address[]} />
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
    </DashboardLayout>
  );
};

export default Dashboard;
