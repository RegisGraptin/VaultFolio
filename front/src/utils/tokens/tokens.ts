import { Address } from "viem";

export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

// FIXME:
// const ENV = process.env.NETWORK || "mainnet"; // Default to mainnet
// const ASSET_MAP = ENV === "testnet" ? TESTNET_ASSETS : MAINNET_ASSETS;

// FIXME: KNOWN ISSUE, ALL ADDRESS ARE IN LOWER CASE!!
export const TOKEN_ASSETS: Record<string, Token> = {
  "0x7984e363c38b590bb4ca35aed5133ef2c6619c40": {
    address: "0x7984e363c38b590bb4ca35aed5133ef2c6619c40",
    name: "DAI",
    symbol: "DAI",
    decimals: 18,
  },
  "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801": {
    address: "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801",
    name: "LINK",
    symbol: "LINK",
    decimals: 18,
  },
  "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d": {
    address: "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  "0x5ea79f3190ff37418d42f9b2618688494dbd9693": {
    address: "0x5ea79f3190ff37418d42f9b2618688494dbd9693",
    name: "WBTC",
    symbol: "WBTC",
    decimals: 8,
  },
  "0xb123dce044edf0a755505d9623fba16c0f41cae9": {
    address: "0xb123dce044edf0a755505d9623fba16c0f41cae9",
    name: "WETH",
    symbol: "WETH",
    decimals: 18,
  },
  "0x186c0c26c45a8da1da34339ee513624a9609156d": {
    address: "0x186c0c26c45a8da1da34339ee513624a9609156d",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
  },
  "0xfc2921be7b2762f0e87039905d6019b0ff5978a8": {
    address: "0xfc2921be7b2762f0e87039905d6019b0ff5978a8",
    name: "AAVE",
    symbol: "AAVE",
    decimals: 18,
  },
  "0xdf40f3a3566b4271450083f1ad5732590ba47575": {
    address: "0xdf40f3a3566b4271450083f1ad5732590ba47575",
    name: "EURS",
    symbol: "EURS",
    decimals: 2,
  },
};
