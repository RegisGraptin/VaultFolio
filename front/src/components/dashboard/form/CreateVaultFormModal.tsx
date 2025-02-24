"use client";

import React, { useEffect, useState } from "react";

import { Address, decodeEventLog } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import Manager from "@/abi/Manager.json";
import { useRouter } from "next/navigation";

import { VAULT_COLORS } from "@/utils/vault/colors";
import LoadingButton from "@/components/button/LoadingButton";

interface VaultCreatedEvent {
  vault: string;
  user: string;
}

const CreateVaultFormModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  const [vaultName, setVaultName] = useState("");

  const [selectedColor, setSelectedColor] = useState(VAULT_COLORS[0]);

  const {
    data: hash,
    error,
    writeContract,
    isPending: txIsPending,
  } = useWriteContract();

  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  function createNewVault() {
    const colorIndex = VAULT_COLORS.indexOf(selectedColor);

    console.log("Create a new vault: '" + vaultName + "' - " + selectedColor);
    console.log(error);

    writeContract({
      address: process.env.NEXT_PUBLIC_MANAGER_ADDRESS as Address,
      abi: Manager.abi,
      functionName: "createVault",
      args: [colorIndex, vaultName],
    });
  }

  useEffect(() => {
    if (!isConfirmed && txReceipt === undefined) {
      return;
    }

    const vaultAddress = txReceipt.logs
      .filter(
        (log) =>
          log.address.toString().toLowerCase() ===
          process.env.NEXT_PUBLIC_MANAGER_ADDRESS?.toLowerCase()
      )
      .map((log) => {
        const event = decodeEventLog({
          abi: Manager.abi,
          topics: log.topics,
          data: log.data,
        });

        if (event.eventName === "VaultCreated") {
          const args = event.args as unknown as VaultCreatedEvent;
          return args.vault;
        }

        return null;
      })
      .find((vault) => vault !== null); // Find the first non-null vault address

    if (vaultAddress) {
      console.log("Vault address found:", vaultAddress);
    } else {
      console.log("VaultCreated event not found in logs.");
    }

    console.log("vaultAddress");
    console.log(vaultAddress);

    router.push(`/vaults/${vaultAddress}`);
  }, [txReceipt]);

  return (
    <>
      <div className="relative mx-auto w-full max-w-[24rem] rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create new vault
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4 p-6">
          <div className="w-full max-w-sm">
            <label className="block mb-2 text-sm text-slate-600">
              Vault Name
            </label>
            <input
              type="text"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Vault Name"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block mb-2 text-sm text-slate-600">
              Choose a Color
            </label>
            <div className="flex justify-center gap-3">
              {VAULT_COLORS.map((color) => {
                return (
                  <div
                    key={color}
                    className={`w-10 h-10 rounded-xl cursor-pointer border-2 transition-all bg-${color}-100 text-${color}-800 ${
                      selectedColor === color
                        ? `scale-110 border-${color}-300`
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0">
          <LoadingButton
            isLoading={txIsPending || isConfirming}
            onClick={() => createNewVault()}
            className="w-full rounded-md bg-slate-800 py-2 px-4 text-white shadow-md transition-all"
          >
            Create
          </LoadingButton>
          <p>{error && error.message}</p>
        </div>
      </div>
    </>
  );
};

export default CreateVaultFormModal;
