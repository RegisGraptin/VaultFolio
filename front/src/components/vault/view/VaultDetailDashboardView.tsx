import React from "react";
import VaultDetailWidget from "../widget/VaultDetailWidget";
import VaultRewardLossWidget from "../widget/VaultRewardLossWidget";

const VaultDetailDashboardView = () => {
  return (
    <>
      <VaultDetailWidget />

      <VaultRewardLossWidget />
    </>
  );
};

export default VaultDetailDashboardView;
