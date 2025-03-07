"use client";

import Link from "next/link";

export default function Hero() {
  const handleSmoothScroll = (e) => {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100/50 text-blue-600 rounded-full text-sm font-medium shadow-sm">
              DeFi shouldn't feel like a part time job
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
            Turn DeFi Chaos into Strategic Control with
            <span className="relative inline-block mx-2">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 blur-2xl opacity-60 animate-pulse"></span>
              <span className="relative text-blue-600">VaultFolio</span>
            </span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Isolate risks in dedicated vaults, build your own yield automations,
            and manage all your DeFi strategies—all from one wallet.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" title="Dashboard">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-lg font-semibold text-white transition-all transform hover:scale-105 shadow-sm hover:shadow-md">
                Get Started
              </button>
            </Link>
            <a href="#demo" title="Watch Demo" onClick={handleSmoothScroll}>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-gray-300 hover:border-blue-600 rounded-xl text-lg font-semibold text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </button>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Non-Custodial
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
              Deployed on Scroll
            </div>
          </div>
        </div>

        {/* Video Preview Section */}
        <div
          id="demo"
          className="mt-16 max-w-6xl mx-auto rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg"
        >
          <div className="aspect-video relative">
            <iframe
              className="w-full h-full"
              src=""
              title="Vaultfolio Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
