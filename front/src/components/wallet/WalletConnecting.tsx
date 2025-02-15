const WalletConnecting = () => (
  <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Checking Wallet Connection...
      </h2>
      <p className="text-gray-600">This should only take a moment</p>
    </div>
  </div>
);

export default WalletConnecting;
