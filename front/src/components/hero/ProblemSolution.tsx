interface Item {
  emoji: string;
  title: string;
  content: string | React.ReactNode;
}

// Potential other pains:
// - Monitoring positions daily is frustrating and inefficient.

const cons: Item[] = [
  {
    emoji: "😫",
    title: "Fragmented Management",
    content: (
      <>
        <span className="font-bold">Juggling multiple wallets</span> for
        different strategies.
      </>
    ),
  },
  {
    emoji: "⏰",
    title: "Manual Work",
    content: (
      <>
        Claiming rewards, repaying loans, and rebalancing{" "}
        <span className="font-bold">takes hours</span>.
      </>
    ),
  },
  {
    emoji: "🔄",
    title: "Risk Spillover",
    content: (
      <>
        One failed strategy{" "}
        <span className="font-bold">risks your entire portfolio</span>.
      </>
    ),
  },
];

const pros: Item[] = [
  {
    emoji: "🗃️",
    title: "Isolated Vaults",
    content: (
      <>
        <span className="font-bold">Separate strategies by risk level</span>{" "}
        (e.g., &quot;Safe Staking&quot; vs. &quot;High-Yield ETH&quot;)
      </>
    ),
  },
  {
    emoji: "🤖",
    title: "Auto-Pilot Yield",
    content: (
      <>
        Let your earnings repay loans, reinvest, or auto-buy assets{" "}
        <span className="font-bold">automatically</span>.
      </>
    ),
  },
  {
    emoji: "📊",
    title: "Unified Dashboard",
    content: (
      <>
        Monitor, adjust, and optimize—
        <span className="font-bold">all in one place</span>.
      </>
    ),
  },
];

export default function ProblemSolution() {
  return (
    <>
      <section className="py-24 px-6 bg-gradient-to-b from-zinc-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Tired of managing all your DeFi positions?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Managing your DeFi risks should be intuitive and simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Problem Column */}
            <div className="space-y-8 text-rose-700 p-8 rounded-lg mx-2">
              <div className="mb-8 text-center">
                <h3 className="inline-block text-lg font-semibold bg-red-50 text-red-700 px-6 py-2 rounded-full">
                  Your DeFi Positions Now
                </h3>
              </div>

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
            <div className="space-y-8 text-blue-700 p-8 rounded-lg mx-2">
              <div className="mb-8 text-center">
                <h3 className="inline-block text-lg font-semibold bg-blue-50 text-blue-700 px-6 py-2 rounded-full">
                  VaultFolio Solutions
                  {/* Your Defi positions with VaultFolio */}
                </h3>
              </div>

              {pros.map((pro, index) => {
                return (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-500 transform transition hover:-translate-y-1"
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
