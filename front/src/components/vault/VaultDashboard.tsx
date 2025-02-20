"use client";

import { Address, getAddress } from "viem";
import { useReadContract } from "wagmi";

import AAVEPool from "@/abi/Pool.json";
import VaultSupplyRow from "./supply/VaultSupplyRow";
import VaultBorrowRow from "./borrow/VaultBorrowRow";

const VaultDashboard = ({ vaultAddress }: { vaultAddress: Address }) => {
  const { data: assetAddresses, error } = useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL!),
    abi: AAVEPool.abi,
    functionName: "getReservesList",
    args: [],
  });

  // FIXME: Should we create table component for the lending/borrowing information
  // Avoiding to defined the table here? Need to think about it!

  return (
    <>
      <section className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-extrabold">Vault information</h1>

        <div className="grid grid-cols-1 md:grid-cols-2">
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

          <div className="m-2 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-extrabold py-5">Your borrows</h2>
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
        </div>
      </section>
    </>
  );
};

export default VaultDashboard;
