import { FaListCheck, FaVault } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";

export default function HowItWorks() {
  const steps = [
    {
      title: "Set Up Your Vault",
      description: "Name your strategy and set your risk tolerance.",
      icon: <FaVault />,
    },
    {
      title: "Configure Your Rules",
      description:
        "Define actions like “Invest 30% yield in ETH” or “Repay loans with yield.”",
      icon: <FaListCheck />,
    },
    {
      title: "Sit Back & Earn",
      description:
        "Let your strategy flow seamlessly, with full control and easy adjustments.",
      icon: <TbPigMoney />,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <p className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-primary">
          How it works?
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-center mb-20">
          Launch Your Vault
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex-1 relative">
              {/* Mobile step number and line */}
              <div className="md:hidden flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1 h-px bg-blue-200" />
              </div>

              {/* Step card */}
              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Desktop number indicator */}
                <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full items-center justify-center text-xl font-bold">
                  {index + 1}
                </div>

                {/* Icon placeholder - replace with your SVG */}
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-xl">{step.icon}</span>
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
