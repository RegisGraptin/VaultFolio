import React from "react";
import VaultDetailDashboardView from "./VaultDetailDashboardView";
import VaultDetailLendingView from "./VaultDetailLendingView";
import VaultDetailBorrowingView from "./VaultDetailBorrowingView";
import { Address } from "viem";
import { VAULT_VIEW_TABS } from "../widget/VaultNavigation";

type ContentProps = {
  activeTab: string;
  vaultAddress: Address;
};

const VaultDetailManageView = ({ activeTab, vaultAddress }: ContentProps) => {
  const activeIndex = VAULT_VIEW_TABS.indexOf(activeTab);

  return (
    <div className="w-full">
      {/* Carousel Content */}
      <div className="overflow-hidden relative">
        {" "}
        {/* Set appropriate height */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          <div className="w-full flex-shrink-0 p-4">
            <VaultDetailDashboardView vaultAddress={vaultAddress} />
          </div>
          <div className="w-full flex-shrink-0 p-4">
            <VaultDetailLendingView vaultAddress={vaultAddress} />
          </div>
          <div className="w-full flex-shrink-0 p-4">
            <VaultDetailBorrowingView vaultAddress={vaultAddress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetailManageView;
