import React from "react";
import VaultDetailDashboardView from "./VaultDetailDashboardView";
import VaultDetailLendingView from "./VaultDetailLendingView";
import VaultDetailBorrowingView from "./VaultDetailBorrowingView";
import { Address } from "viem";

type ContentProps = {
  activeTab: string;
  vaultAddress: Address;
};

const VaultDetailManageView = ({ activeTab, vaultAddress }: ContentProps) => {
  return (
    <div className="transition-opacity duration-300 ease-out">
      {activeTab === "Dashboard" && <VaultDetailDashboardView />}

      {activeTab === "Lending" && (
        <VaultDetailLendingView vaultAddress={vaultAddress} />
      )}

      {activeTab === "Borrowing" && (
        <VaultDetailBorrowingView vaultAddress={vaultAddress} />
      )}
    </div>
  );
};

export default VaultDetailManageView;
