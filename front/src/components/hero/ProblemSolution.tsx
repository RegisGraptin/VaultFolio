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
      <section className="py-16 bg-gradient-to-b from-zinc-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Tired of managing all your DeFi positions?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Problem Column */}
            <div className="space-y-8 bg-rose-100/75 text-rose-700 p-8 rounded-lg mx-2">
              <h3 className="text-center font-bold text-lg mb-4">
                Your DeFi Positions Now
              </h3>
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
            <div className="space-y-8 bg-emerald-100/70 text-emerald-700 p-8 rounded-lg mx-2">
              <h3 className="text-center font-bold text-lg mb-4">
                Your Defi positions with VaultFolio
              </h3>
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
