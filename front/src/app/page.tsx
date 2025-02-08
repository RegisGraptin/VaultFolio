import type { NextPage } from "next";
import React from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Faq from "../components/Faq";
import ProblemSolution from "../components/ProblemSolution";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Hero from "../components/Hero";

const Home: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <WhyChooseUs />
      {/* CTA Section */}
      <section
        id="cta"
        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Be Part of the Future of Open Finance
          </h2>
          <p className="text-lg mb-8">
            We are building on **Scroll**, leveraging Layer 2 technology for
            **low fees & high efficiency**. **Join the waitlist today and be
            among the first to try it!**
          </p>
          <a href="#" title="Create an auction">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
              Join the waitlist
            </button>
          </a>
        </div>
      </section>
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
