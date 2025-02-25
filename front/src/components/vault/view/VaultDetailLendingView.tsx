import { useAave } from "@/utils/hook/aave";
import React from "react";
import { Address, getAddress } from "viem";
import VaultSupplyRow from "../supply/VaultSupplyRow";

const VaultDetailLendingView = ({
  vaultAddress,
}: {
  vaultAddress: Address;
}) => {
  const { data: assetAddresses, error } = useAave("getReservesList");

  return (
    <div className="m-2 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-extrabold py-5">Your supplies</h2>
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
                Supply
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
                    <VaultSupplyRow
                      key={index}
                      vaultAddress={vaultAddress}
                      assetAddress={getAddress(assetAddress)}
                    />
                  );
                }
              )}
          </tbody>
        </table>

        {error?.message}
      </div>
    </div>
  );
};

export default VaultDetailLendingView;
