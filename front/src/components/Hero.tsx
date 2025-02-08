import SubscribeButton from "./button/SubscribeButton";

export default function Hero() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simplify DeFi Loans: Isolate Risk, Automate Everything
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Turn hours of manual monitoring into set-and-forget rules for
            lending, borrowing, and yield compounding in a single wallet.
          </p>
          {/* Create isolated vaults, automate yield allocation, and manage multiple
            strategies from a single wallet. */}

          <SubscribeButton />
        </div>
      </section>
    </>
  );
}
