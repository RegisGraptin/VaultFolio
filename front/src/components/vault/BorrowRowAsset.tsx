import { Token, TOKEN_ASSETS } from "@/utils/tokens/tokens";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

import RowDashboardAsset from "./RowAsset";
import VaultBorrowFormModal from "./borrow/VaultBorrowFormModal";

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

  const BorrowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Supply ${token.name}`}
      onClick={onClick}
      disabled={false} // FIXME: check health factor
    >
      Borrow
    </button>
  );

  return (
    <>
      <RowDashboardAsset
        vaultAddress={vaultAddress}
        assetAddress={assetAddress}
        actionButton={BorrowButton}
        actionComponent={VaultBorrowFormModal}
      />
    </>
  );
};

export default LendRowAsset;
