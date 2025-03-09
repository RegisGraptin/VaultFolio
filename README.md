<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/RegisGraptin/VaultFolio">
    <img src="./front/public/images/logo.svg" alt="Logo" width="250" height="250">
  </a>

<h3 align="center">VaultFolio</h3>
<p align="center" style="font-style: italic; font-size: 1.2em;">Built during <a href="https://open.scroll.io" title="Scroll Open Hackathon">Scroll Open Hackathon</a></p>
  <p align="center">
    Create multiple DeFi strategies safely in one wallet by isolating risks in separate vaults.
    <br />
    <br />
    <a href="https://github.com/RegisGraptin/VaultFolio">Code</a>
    &middot;
    <a href="https://www.vaultfolio.xyz/">Website</a>
    &middot;
    <a href="https://www.vaultfolio.xyz/videos/DemoVaultFolio.mp4">Video Demo</a>
    
  </p>
</div>


## About VaultFolio

VaultFolio is a risk management platform, allowing you to create dedicated vaults to isolate your risk based on your DeFi strategies. By compartmentalizing collateral, funds in one vault remain protected even if another strategy faces volatility, meaning that you can safely run multiple strategies, from conservative yield to high-risk leveraged positions, within a single wallet.

Imagine running two strategies simultaneously: your long-term "Safety Vault" earning steady rewards from a low-risk stablecoin liquidity pool, while having a “Growth Vault” aggressively leverages ETH for higher returns. By leveraging VaultFolio and having isolated vault for each strategy, one does not impact the collateral of the other, meaning that within a single wallet, you can define and manage your DeFi strategies with no cross-risk exposure.

## Why using VaultFolio?

- Isolate Risk: Eliminate cross-collateral exposure—each strategy operates in its own vault, shielding your assets from volatility elsewhere.
- Simplify Management: Manage and monitor all your DeFi positions from a single wallet.
- Diversify with Confidence: Run conservative, aggressive, or experimental strategies simultaneously within a single wallet all isolated and protected.
- Automate Strategies: Set custom automation actions leveraging your yield. Automatically repay your debt or swap a percent of your reward to another token.

## Protocol Implementation

At the moment, we are using [AAVE](https://aave.com/) as our liquidity protocol. In the future, we are aiming to propose additional services giving you more flexibility in risk allocation.

Once your vault is created, you can  provide liquidity and take on debt inside your vault. Your vault acts as a wrapper from liquidity providers, meaning that all the yield/debt tokens remain within your vault. However, you retain full control over your vault and allocations. 


## Automation strategies

By using VaultFolio, you have the possibility to define automated strategies within your vaults. As an example, you can use a repay strategy allowing you to use the yield reward to pay down your debt. Alternatively, you can create another strategy to take a percent of your yield to swap it for another token, such as BTC.

Regarding the automation integration, we are leveraging Chainlink Automation.
