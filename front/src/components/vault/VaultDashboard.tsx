"use client";

import { getAddress } from "viem";
import { useReadContract } from "wagmi";

import AAVEPool from "@/abi/Pool.json";
import RowDashboardAsset from "./RowAsset";

const VaultDashboard = () => {
  // Get the available assets
  // FIXME::

  // 0x11fcfe756c05ad438e312a7fd934381537d3cffe;

  const { data: assetAddresses, error } = useReadContract({
    address: getAddress(process.env.NEXT_PUBLIC_AAVE_POOL_SCROLL!),
    abi: AAVEPool.abi,
    functionName: "getReservesList",
    args: [],
  });

  return (
    <>
      <section className="container mx-auto py-16 px-4">
        <h1>Vault information</h1>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 rounded-xl shadow-lg">
            <h2>Your supplies</h2>
            <div>
              {assetAddresses &&
                assetAddresses.map((assetAddress: string, index: number) => {
                  return (
                    <RowDashboardAsset
                      key={index}
                      assetAddress={getAddress(assetAddress)}
                    />
                  );
                })}

              {error?.message}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VaultDashboard;
