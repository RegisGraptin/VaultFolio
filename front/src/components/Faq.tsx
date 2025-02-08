"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who is this for?",
    answer:
      "Anyone using lending protocols who wants **better risk control, automation, and higher efficiency.**",
  },
  {
    question: "How is this different from AAVE/Compound?",
    answer: "We don’t replace lending protocols—we help you use them smarter.",
  },
  {
    question: "Is my wallet secure?",
    answer: "Non-custodial design. You control keys; we never touch funds.",
  },
  {
    question: "What chains do you support?",
    answer: "Launching on Scroll L2.",
  },
];

// **What platforms do you support?**
// We are exploring integrations with **AAVE, Compound, and Scroll-native protocols.**

const Faq = () => {
  const [openIndexes, setOpenIndexes] = useState<Number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className="max-w-3xl mx-auto py-32 px-4 p-4">
      <h2 className="text-3xl font-manrope font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{item.question}</span>
              <span
                className={`transform transition-transform ${openIndexes.includes(index) ? "rotate-180" : ""}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndexes.includes(index)
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 bg-white">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
