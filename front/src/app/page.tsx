import type { NextPage } from "next";
import React from "react";

import Footer from "../components/Footer";
import Faq from "../components/Faq";
import ProblemSolution from "../components/ProblemSolution";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Hero from "../components/Hero";
import Cta from "@/components/Cta";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <WhyChooseUs />
      <Cta />
      <Faq />
      <Footer />
    </div>
  );
};

export default Home;

// FIXME:
// # SEO & Structure Tips

// 1. **Keywords:**

//    - Primary: “DeFi strategy automation,” “multi-vault wallet,” “yield management”
//    - Secondary: “isolate risk DeFi,” “auto-compound lending protocols”
//    - Use in headers, meta description, and alt text (e.g., “DeFi vault dashboard screenshot”).

// 2. **Meta Description:**
//    “Automate DeFi strategies, isolate risk with multi-vaults, and manage lending protocols in one place. Built on Scroll L2.”

// 3. **Internal Linking:**

//    - Link to your hackathon article for context.
//    - Add a blog section for updates (post-launch).

// 4. **Visual Flow:**

//    - Use hero → problem/solution → features → CTA → FAQ.
//    - Break text with subheaders, bullet points, and icons.

// 5. **Tone:**
//    Friendly but professional. Avoid overly technical terms (“non-custodial” is okay, but explain if needed).

// ---

// **Final Note:**
// Focus on benefits over features. DeFi users care about saving time, reducing risk, and maximizing yields—structure your copy around these themes. Use the blog to dive into technical details, but keep the landing page action-oriented.
