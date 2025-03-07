"use client";

import Image from "next/image";

export default function Cta() {
  const handleSmoothScroll = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const demoSection = document.getElementById("demo");
    if (demoSection) {
      demoSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gray-900 py-32 px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/30 to-blue-500/30 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-tight">
              DeFi Management
              <span className="relative whitespace-nowrap">
                <span className="absolute -bottom-2 left-0 h-3 w-full bg-indigo-500/30" />
                <span className="relative">Simplified</span>
              </span>
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-gray-300">
              Focus on your strategy, not wallet management.{" "}
              <span className="block lg:inline">
                Get started in under 2 minutes.
              </span>
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Now
                <svg
                  className="ml-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#demo"
                onClick={handleSmoothScroll}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-lg transition-all hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Watch Demo
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["punk", "milady", "pudgy"].map((i) => (
                    <img
                      key={i}
                      src={`/images/avatars/${i}.webp`}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">Join now</span>
              </div>
              {/*
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-6 w-6 text-green-400" />
                <span className="text-sm text-gray-300">Audited Security</span>
              </div> 
              */}
            </div>
          </div>

          {/* Visual Element */}
          <div className="flex-1">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <Image
                src="/images/app/mobile-vaults.png"
                alt="VaultFolio Vaults Dashboard"
                width={590}
                height={300}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
