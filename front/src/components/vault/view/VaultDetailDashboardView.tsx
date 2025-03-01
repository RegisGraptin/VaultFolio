import React from "react";
import VaultDetailWidget from "../widget/VaultDetailWidget";
import VaultRewardLossWidget from "../widget/VaultRewardLossWidget";
import { Address } from "viem";

const VaultDetailDashboardView = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <VaultDetailWidget vaultAddress={vaultAddress} />

        <VaultRewardLossWidget vaultAddress={vaultAddress} />
      </div>
    </>
  );
};

export default VaultDetailDashboardView;
