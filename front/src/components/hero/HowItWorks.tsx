import Link from "next/link";
import { FaArrowRight, FaListCheck, FaVault } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";

export default function HowItWorks() {
  const steps = [
    {
      title: "Set Up Your Vault",
      description: "Create your vault and defined your strategies.",
      icon: <FaVault />,
      webm: "",
      mp4: "/videos/VaultFolioDemo.mp4",
    },
    {
      title: "Configure Your Rules",
      description:
        "Define actions like “Invest 30% yield in ETH” or “Repay loans with yield.”",
      icon: <FaListCheck />,
      webm: "",
      mp4: "/videos/VaultFolioDemo.mp4",
    },
    {
      title: "Sit Back & Earn",
      description:
        "Let your strategy flow seamlessly, with full control and easy adjustments.",
      icon: <TbPigMoney />,
      webm: "",
      mp4: "/videos/VaultFolioDemo.mp4",
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text font-semibold text-sm uppercase tracking-widest">
            Why VaultFolio
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Manage your{" "}
            <span className="relative whitespace-nowrap">
              <span className="absolute -bottom-2 left-0 h-3 w-full bg-indigo-100/80 z-0" />
              <span className="relative">Strategies</span>
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            Discover how our platform transforms your daily operations through
            intuitive features and smart automation.
          </p>
        </div>

        {/* Video Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col gap-16 md:gap-24 ${index % 2 ? "md:flex-row" : " md:flex-row-reverse"}`}
            >
              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Video Container */}
              <div className="flex-1 relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-xl transform transition-all group-hover:shadow-2xl">
                  <video
                    className="w-full h-auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls={false}
                  >
                    {/* <source src={step.webm} type="video/webm" /> */}
                    <source src={step.mp4} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Link href={"/dashboard"} title="Start Your Strategy">
            <button className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
              Start Your Strategy
              <FaArrowRight className="ml-3 w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>

    // <section className="py-16 px-4 bg-gray-50">
    //   <div className="max-w-6xl mx-auto">
    //     <p className="mb-3 text-center text-sm font-medium uppercase tracking-wider text-primary">
    //       How it works?
    //     </p>
    //     <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-center mb-20">
    //       Launch Your Vault
    //     </h2>

    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    //       {steps.map((step, index) => (
    //         <div key={step.title} className="flex-1 relative">
    //           {/* Mobile step number and line */}
    //           <div className="md:hidden flex items-center gap-4 mb-4">
    //             <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
    //               {index + 1}
    //             </div>
    //             <div className="flex-1 h-px bg-blue-200" />
    //           </div>

    //           {/* Step card */}
    //           <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    //             {/* Desktop number indicator */}
    //             <div className="hidden md:flex absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full items-center justify-center text-xl font-bold">
    //               {index + 1}
    //             </div>

    //             {/* Icon placeholder - replace with your SVG */}
    //             <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
    //               <span className="text-xl">{step.icon}</span>
    //             </div>

    //             <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
    //             <p className="text-gray-600 leading-relaxed">
    //               {step.description}
    //             </p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}
