import { FaKey, FaListCheck, FaMoneyBill, FaVault } from "react-icons/fa6";

const features = [
  {
    icon: <FaKey />,
    title: "Unified Interface",
    subtitle: "One wallet to rule them all",
    content:
      "No more juggling 10 wallets or manual micromanagement. Manage all your DeFi strategies in one secure interface.",
  },
  {
    icon: <FaVault />,
    title: "Isolated Strategies",
    subtitle: "Compartmentalize risk, not your attention",
    content:
      "Create dedicated vaults for specific strategies as “Stablecoin Lending“ or “Leveraged ETH” and isolate your risks.",
  },

  {
    icon: <FaListCheck />,
    title: "Custom Rules",
    subtitle: "Your Strategies, Your rules",
    content:
      "Customize rules for every vault. Automatically reinvest 20% of yield into BTC or use 50% of rewards to repay loans—it's all under your control.",
  },
  {
    icon: <FaMoneyBill />,
    title: "Optimize fees",
    subtitle: "Built on Scroll L2",
    content:
      "Enjoy minimal fees and fast transactions. Even small strategies benefit when high gas costs are a thing of the past.",
  },
];

export default function WhyChooseUs() {
  return (
    <>
      <section id="about" className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-primary">
            Why choose {process.env.NEXT_PUBLIC_SITE_NAME}?
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-center mb-10">
            Not just another protocol—unify every strategy in one vault.
          </h2>
        </div>
        <div className="pt-20 mx-auto max-w-2xl lg:max-w-4xl">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => {
              return (
                <article key={index} className="relative pl-16 h-40">
                  <div className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <h4 className="mt-1 text-base font-medium text-gray-700">
                      {feature.subtitle}
                    </h4>
                  </div>
                  <div className="mt-2 text-base leading-7 text-gray-600">
                    <p>{feature.content}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
