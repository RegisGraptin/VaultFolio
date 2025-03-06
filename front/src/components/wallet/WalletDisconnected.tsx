import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletDisconnected = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to VaultFolio
      </h1>
      <p className="text-gray-600 mb-6">
        Connect your wallet to view and manage your vaults
      </p>
      <div className="flex justify-center">
        <ConnectButton
          label="Connect Wallet"
          showBalance={false}
          accountStatus="address"
          chainStatus="none"
        />
      </div>
    </div>
  </div>
);

export default WalletDisconnected;
