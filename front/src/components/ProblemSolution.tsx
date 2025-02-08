interface Item {
  emoji: string;
  title: string;
  content: string;
}

const cons: Item[] = [
  {
    emoji: "😫",
    title: "Fragmented Management",
    content: "Juggling multiple wallets for different strategies.",
  },
  {
    emoji: "⏰",
    title: "Manual Work",
    content: "Claiming rewards, repaying loans, and rebalancing takes hours.",
  },
  {
    emoji: "🔄",
    title: "Risk Spillover",
    content: "One failed strategy risks your entire portfolio.",
  },
];

const pros: Item[] = [
  {
    emoji: "🗃️",
    title: "Isolated Vaults",
    content:
      'Separate strategies by risk level (e.g., "Safe Staking" vs. "High-Yield ETH")',
  },
  {
    emoji: "🤖",
    title: "Auto-Pilot Yield",
    content:
      "Use earnings to repay loans, buy assets, or compound interest—no manual work.",
  },
  {
    emoji: "📊",
    title: "Unified Dashboard",
    content: "Monitor all positions and protocols in one place.",
  },
];

export default function ProblemSolution() {
  // FIXME: Specify lending / borrowing issues

  // ## 🤯 The Problem

  // - Managing multiple lending strategies requires multiple wallets.
  // - Loan repayments and reinvestments are manual and time-consuming.
  // - Monitoring positions daily is frustrating and inefficient.

  // ---

  // ## 💡 The Solution

  // We provide an **intelligent lending management platform** that enables:

  // - **Multiple risk-adjusted vaults** under a single wallet.
  // - **Automated loan repayments** using earned yield.
  // - **Smart rebalancing** across different lending protocols.

  // ✅ **No more manual monitoring.**
  // ✅ **No need to juggle multiple wallets.**
  // ✅ **Automate & optimize your lending strategy effortlessly.**

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-zinc-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            From Crypto Chaos to
            <br className="hidden md:block" /> Effortless Efficiency
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Problem Column */}
            <div className="space-y-8">
              {cons.map((con, index) => {
                return (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-500 transform transition hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{con.emoji}</span>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {con.title}
                        </h3>
                        <p className="text-gray-600">{con.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Solution Column */}
            <div className="space-y-8">
              {pros.map((pro, index) => {
                return (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-500 transform transition hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{pro.emoji}</span>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {pro.title}
                        </h3>
                        <p className="text-gray-600">{pro.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
