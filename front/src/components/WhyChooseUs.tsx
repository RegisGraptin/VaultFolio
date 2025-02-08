import { IoIosPricetags } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import { RiRefundFill } from "react-icons/ri";
import { SiLetsencrypt } from "react-icons/si";

export default function WhyChooseUs() {
  // FIXME:

  // ## 🌍 Why It Matters

  // - **Passive income, stress-free**: No need to micromanage positions.
  // - **More control, fewer risks**: Separate funds into strategies.
  // - **On-chain automation**: Reduce operational costs and errors.

  // ## 5. Why Choose Us?

  // - ✅ **No More Wallet Fatigue:** One private key, endless strategies.
  // - 📈 **Compound Effortlessly:** Reinvest yields faster than manual claiming.
  // - 🛡️ **Risk-Adjusted Design:** Protect capital without sacrificing growth.

  // _Explanation:_

  // - Reinforce key differentiators (single wallet, automation, risk management).
  // - Use checkmarks/icons for quick readability.

  return (
    <>
      <section id="about" className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why choose {process.env.NEXT_PUBLIC_SITE_NAME}?
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Confidentially launch your token and let buyers bid securely with
            Zama’s fhEVM—ensuring privacy at the bid process and auction
            fairness from start to settlement.
          </p>
        </div>
        <div className="pt-20 mx-auto max-w-2xl lg:max-w-4xl">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16 h-40">
              <div className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <MdDashboardCustomize />
                </div>
                <h3>Multi-Vault System</h3>
              </div>
              <div className="mt-2 text-base leading-7 text-gray-600">
                <p>
                  <b>Compartmentalize risk, not your attention.</b>
                </p>
                <p>
                  - Create unlimited vaults for specific strategies (e.g.,
                  “Stablecoin Staking,” “Leveraged ETH”). <br />- Isolate
                  liquidity—one vault’s failure doesn’t affect others.
                </p>
              </div>
            </div>
            <div className="relative pl-16 h-40">
              <div className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <SiLetsencrypt />
                </div>
                <h3>Auto-Strategies</h3>
              </div>
              <div className="mt-2 text-base leading-7 text-gray-600">
                <p>
                  <b>Set it. Forget it. Earn more.</b>
                </p>
                <p>
                  - Automatically reinvest 20% of yield into BTC. - Use 50% of
                  rewards to repay loans. - Customize rules for every vault.
                </p>
              </div>
            </div>
            <div className="relative pl-16 h-40">
              <div className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <IoIosPricetags />
                </div>
                <h3>Cross-Protocol Rebalancing</h3>
              </div>
              <div className="mt-2 text-base leading-7 text-gray-600">
                <p>
                  <b>Optimize yields across AAVE, Compound, and more.</b>
                </p>

                <p>
                  - Allocate capital between protocols based on APY shifts. -
                  Built on Scroll L2 for low-cost transactions.
                </p>
              </div>
            </div>
            <div className="relative pl-16 h-40">
              <div className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <RiRefundFill />
                </div>
                <h3>Health Guard</h3>
              </div>
              <div className="mt-2 text-base leading-7 text-gray-600">
                FIXME:
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

//FIXME:
// ### Feature 1: Multi-Vault System

// **"Compartmentalize risk, not your attention."**

// - Create unlimited vaults for specific strategies (e.g., “Stablecoin Staking,” “Leveraged ETH”).
// - Isolate liquidity—one vault’s failure doesn’t affect others.

// ### Feature 2: Auto-Strategies

// **"Set it. Forget it. Earn more."**

// - Automatically reinvest 20% of yield into BTC.
// - Use 50% of rewards to repay loans.
// - Customize rules for every vault.

// ### Feature 3: Cross-Protocol Rebalancing

// **"Optimize yields across AAVE, Compound, and more."**

// - Allocate capital between protocols based on APY shifts.
// - Built on Scroll L2 for low-cost transactions.

// ### Feature 4: Health Guard

// **"Sleep through market dips."**

// - Auto-liquidation prevention via dynamic thresholds.
// - SMS/email alerts for critical changes.

// _Explanation:_

// - Lead with user-centric benefits, not technical specs.
// - Use subheaders as mini value propositions.

// ---
