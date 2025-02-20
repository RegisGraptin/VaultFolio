import Image from "next/image";
import { LENDING_TOKENS, Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address, erc20Abi, formatUnits, getAddress } from "viem";
import { useAccount, useBalance } from "wagmi";
import PopupButton from "../button/PopupButton";
import SupplyFormModal from "./SupplyFormModal";

import { useOracle, usePriceOracle } from "@/utils/hook/oracle";
import { convertAssetToUSD, formatBalance } from "@/utils/tokens/balance";
import RowDashboardAsset from "./RowAsset";

const ORACLE_PRICE_DECIMALS = 8;

const LendRowAsset = ({
  vaultAddress,
  assetAddress,
}: {
  vaultAddress: Address;
  assetAddress: Address;
}) => {
  const { address: userAddress } = useAccount();

  let token: Token = TOKEN_ASSETS[assetAddress.toLowerCase()];

  const { data: userBalanceToken } = useBalance({
    address: userAddress,
    token: assetAddress,
  });

  return (
    <>
      <RowDashboardAsset
        vaultAddress={vaultAddress}
        assetAddress={assetAddress}
        mode="lend"
        actionButton={SupplyButton}
        actionComponent={SupplyFormModal}
      />
    </>
  );
};

export default LendRowAsset;
