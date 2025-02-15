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

//   function getReserveData(address asset) external view returns (DataTypes.ReserveDataLegacy memory);

// FIXME::: Need to automate generation testnet vs mainnet !!

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

export const LENDING_TOKENS: Record<string, Token> = {
  "0x7984e363c38b590bb4ca35aed5133ef2c6619c40": {
    address: "0x99Cb50E6bE36C8096e6731ED7738d93090B710DD",
    name: "Aave Ethereum DAI",
    symbol: "aEthDAI",
    decimals: 18,
  },
  "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801": {
    address: "0x55DD1cDFE13fCa68F6D14D452E2a20cABe191841",
    name: "Aave Ethereum LINK",
    symbol: "aEthLINK",
    decimals: 18,
  },
  "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d": {
    address: "0x6E4A1BcBd3C3038e6957207cadC1A17092DC7ba3",
    name: "Aave Ethereum USDC",
    symbol: "aEthUSDC",
    decimals: 6,
  },
  "0x5ea79f3190ff37418d42f9b2618688494dbd9693": {
    address: "0x43AE2a14AD923915aa85d683D1b7d0d320ae87B2",
    name: "Aave Ethereum WBTC",
    symbol: "aEthWBTC",
    decimals: 8,
  },
  "0xb123dce044edf0a755505d9623fba16c0f41cae9": {
    address: "0x9E8CEC4F2F4596141B62e88966D7167E9db555aD",
    name: "Aave Ethereum WETH",
    symbol: "aEthWETH",
    decimals: 18,
  },
  "0x186c0c26c45a8da1da34339ee513624a9609156d": {
    address: "0x54Cb3ba40705d7CCB18c1C24edD8B602a88eF4CE",
    name: "Aave Ethereum USDT",
    symbol: "aEthUSDT",
    decimals: 6,
  },
  "0xfc2921be7b2762f0e87039905d6019b0ff5978a8": {
    address: "0xC5209E1325A0DBeb28143D82e7E1DE709456Fc8a",
    name: "Aave Ethereum AAVE",
    symbol: "aEthAAVE",
    decimals: 18,
  },
  "0xdf40f3a3566b4271450083f1ad5732590ba47575": {
    address: "0xD49d1CF2886B1c95A94e8a9066E8b298646716b6",
    name: "Aave Ethereum EURS",
    symbol: "aEthEURS",
    decimals: 2,
  },
};
