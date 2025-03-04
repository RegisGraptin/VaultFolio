import { useAave } from "@/utils/hook/aave";
import React from "react";
import { Address, getAddress } from "viem";
import VaultBorrowRow from "../borrow/VaultBorrowRow";

const VaultDetailBorrowingView = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const { data: assetAddresses } = useAave("getReservesList");

  return (
    <div className="m-2 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold pb-5">Your borrows</h2>
      <div>
        <table className="w-full table-auto min-w-max">
          <thead className="text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                Assets
              </th>
              <th scope="col" className="px-6 py-3">
                APY
              </th>
              <th scope="col" className="px-6 py-3">
                Debts
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(assetAddresses as Address[]) &&
              (assetAddresses as Address[]).map(
                (assetAddress: string, index: number) => {
                  return (
                    <VaultBorrowRow
                      key={index}
                      vaultAddress={vaultAddress}
                      assetAddress={getAddress(assetAddress)}
                    />
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaultDetailBorrowingView;
