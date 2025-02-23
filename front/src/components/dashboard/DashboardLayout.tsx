"use client";

import { useAccount } from "wagmi";
import SidebarMenu from "./SidebarMenu";
import WalletConnecting from "../wallet/WalletConnecting";
import WalletDisconnected from "../wallet/WalletDisconnected";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, status } = useAccount();

  // Handle loading state while checking connection status
  if (status === "connecting" || status === "reconnecting") {
    return <WalletConnecting />;
  }

  // Handle disconnected state
  if (!isConnected) {
    return <WalletDisconnected />;
  }

  return (
    <>
      <div className="flex">
        <SidebarMenu />
        <main className="bg-gray-50 w-full min-h-screen p-6 overflow-scroll">
          {children}
        </main>
      </div>
    </>
  );
}
