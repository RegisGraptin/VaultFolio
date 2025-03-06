import { FaKey, FaListCheck, FaMoneyBill, FaVault } from "react-icons/fa6";

const features = [
  {
    icon: <FaKey className="h-8 w-8" />,
    title: "Unified Interface",
    content:
      "No more juggling 10 wallets or manual micromanagement. Manage all your DeFi strategies in one secure interface.",
    stat: "90%+ Efficiency Gain",
  },
  {
    icon: <FaVault className="h-8 w-8" />,
    title: "Isolated Strategies",
    content:
      "Create dedicated vaults for specific strategies as “Stablecoin Lending“ or “Leveraged ETH” and isolate your risks.",
    stat: "100% Risk Isolation",
  },
  {
    icon: <FaListCheck className="h-8 w-8" />,
    title: "Custom Rules",
    content:
      "Customize rules for every vault. Automatically reinvest 20% of yield into BTC or use 50% of rewards to repay loans—it's all under your control.",
    stat: "∞ Customization",
  },
  {
    icon: <FaMoneyBill className="h-8 w-8" />,
    title: "Optimize Fees",
    content:
      "Enjoy minimal fees and fast transactions. Even small strategies benefit when high gas costs are a thing of the past.",
    stat: "~70% Cost Reduction",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-widest">
            Why Platform Name
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            DeFi Management
            <span className="relative whitespace-nowrap">
              <span className="absolute -bottom-2 left-0 h-3 w-full bg-indigo-100/80 z-0" />
              <span className="relative">Reinvented</span>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            We&apos;re redefining DeFi management through innovative
            architecture and user-centric design
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 min-h-[400px] flex flex-col"
            >
              {/* Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50/50 opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.content}
                  </p>
                </div>

                {/* Stat now always at bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100/50">
                  <div className="inline-flex items-center text-sm font-semibold text-indigo-600">
                    <span>{feature.stat}</span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Stats */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">15K+</div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Active Strategies
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">$4.2B+</div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Assets Secured
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">99.9%</div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Monitoring
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">150+</div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Integrations
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
