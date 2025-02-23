"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";

import { BiBarChartSquare } from "react-icons/bi";
import { IoWallet } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useAccount, useDisconnect } from "wagmi";
import { Address } from "viem";
import { useListVaults, useVault } from "@/utils/hook/vault";
import {
  getMenuColorStyle,
  getVaultColor,
  VAULT_COLORS,
} from "@/utils/vault/colors";
import { FaVault } from "react-icons/fa6";

const VaultCardItem = ({ vaultAddress }: { vaultAddress: Address }) => {
  const { data: vaultName } = useVault(vaultAddress, "name");
  const { data: vaultColorIndex } = useVault(vaultAddress, "color");

  return (
    <li className="mb-2">
      <Link
        href={`/vaults/${vaultAddress}`}
        className={`flex items-center p-2 ${getMenuColorStyle(vaultColorIndex as number)} rounded`}
      >
        {vaultName ? (
          <FaVault className={`mx-2 text-2xl`} />
        ) : (
          <IoWallet className={`mx-2 text-2xl`} />
        )}

        <span>{vaultName ? (vaultName as string) : "My Wallet"}</span>
      </Link>
    </li>
  );
};

const SidebarMenu = () => {
  const { address: userAddress } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: vaultAddresses = [] } = useListVaults(userAddress);

  const [showVaults, setShowVaults] = useState(false);

  const toggleVaults = () => {
    setShowVaults(!showVaults);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white w-80">
      {/* Top Section with Logo and App Name */}
      <div className="p-6 border-b border-gray-700">
        <Link
          href="/"
          className="w-full flex justify-center space-x-3 rtl:space-x-reverse"
          title={process.env.NEXT_PUBLIC_SITE_NAME}
        >
          <Image
            src="/images/logo.svg"
            className="h-8 filter invert"
            alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Logo`}
            width={32}
            height={32}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 text-lg">
        <ul>
          <li className="mb-2">
            <Link
              title="Dashboard"
              href="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <BiBarChartSquare className="mx-2 text-2xl" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="mb-2">
            <span className="w-full flex items-center">
              <Link
                title="Vaults"
                href="/vaults"
                className="w-full flex items-center p-2 rounded hover:bg-gray-700 rounded"
              >
                <IoWallet className="mx-2 text-2xl" />
                <span>Vaults</span>
              </Link>
              <button
                onClick={toggleVaults}
                className="p-3 rounded hover:bg-gray-700 rounded"
              >
                <svg
                  className={`w-4 h-4 ml-auto transform ${showVaults ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </span>

            {showVaults && (
              <ul className="pl-4 mt-2">
                <VaultCardItem vaultAddress={userAddress as Address} />

                {(vaultAddresses as Address[]) &&
                  (vaultAddresses as Address[]).map(
                    (vaultAddress: Address, index: number) => {
                      return (
                        <VaultCardItem
                          key={index}
                          vaultAddress={vaultAddress}
                        />
                      );
                    }
                  )}

                {/* Should I add a new vault entry? */}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Bottom Section with Settings and Logout */}
      <div className="p-4 border-t text-lg border-gray-700">
        <ul>
          <li className="mb-2">
            <Link
              title="Settings"
              href="/settings"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <IoMdSettings className="mx-2 text-2xl" />
              <span>Settings</span>
            </Link>
          </li>
          <li className="mb-2">
            <button
              onClick={() => disconnect()}
              className="w-full flex items-center p-2 hover:bg-gray-700 rounded"
            >
              <IoIosLogOut className="mx-2 text-2xl" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
