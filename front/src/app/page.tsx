import type { Metadata, NextPage } from "next";
import React from "react";

import Footer from "../components/common/Footer";
import Faq from "../components/hero/Faq";
import ProblemSolution from "../components/hero/ProblemSolution";
import HowItWorks from "../components/hero/HowItWorks";
import WhyChooseUs from "../components/hero/WhyChooseUs";
import Hero from "../components/hero/Hero";
import Cta from "@/components/hero/Cta";

export const metadata: Metadata = {
  title:
    "VaultFolio - Simplify Your DeFi Strategy | Unified Management & Automated Yield",
  description:
    "VaultFolio revolutionizes decentralized finance. Manage all your DeFi strategies in one secure platform—automate yield, isolate risk, and maximize returns on Scroll L2. Join the waitlist today!",
  keywords:
    "VaultFolio, DeFi, decentralized finance, yield automation, unified wallet, risk isolation, Scroll L2, lending protocol, crypto management, blockchain automation",
  alternates: {
    canonical: "https://www.vaultfolio.xyz",
  },
  openGraph: {
    type: "website",
    title: "VaultFolio - Simplify Your DeFi Strategy",
    description:
      "Experience a seamless, all-in-one platform for managing your DeFi investments. Automate yield, isolate risk, and unify your strategies with VaultFolio.",
    siteName: "VaultFolio",
    url: "https://www.vaultfolio.xyz",
    images: "/images/og.webp",
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultFolio - Simplify Your DeFi Strategy",
    description:
      "Manage all your DeFi strategies in one secure interface. Automate yield, isolate risk, and maximize returns on Scroll L2. Join the waitlist now!",
    images: "/images/og-twitter.webp",
  },
};

const Home: NextPage = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <WhyChooseUs />
      <Cta />
      <Faq />
      <Footer />
    </main>
  );
};

export default Home;
