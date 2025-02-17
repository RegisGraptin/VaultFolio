import { formatUnits } from "viem";

export const formatBalance = (value?: bigint, decimals?: number) => {
  if (!value || decimals === undefined) return "0";

  const formattedValue = formatUnits(value, decimals);
  const [integerPart, decimalPart] = formattedValue.split(".");

  // Show only the last 4 decimals
  const truncatedDecimalPart = decimalPart ? decimalPart.slice(-4) : "";
  const truncatedValue = truncatedDecimalPart
    ? `${integerPart}.${truncatedDecimalPart}`
    : integerPart;

  return truncatedValue;

  // FIXME: See how we can improve the formatting
  // return new Intl.NumberFormat("en-US", {
  //   style: "decimal",
  //   minimumFractionDigits: 2,
  //   maximumFractionDigits: 2,
  //   useGrouping: true,
  // }).format(BigInt(truncatedValue));
};

export const convertAssetToUSD = (
  tokenAmount: bigint,
  tokenDecimals: number,
  oraclePriceUSD: bigint,
  ORACLE_PRICE_DECIMALS: number = 8
) => {
  // Just in case, take the number defined in the environment variable
  if (process.env.NEXT_PUBLIC_ORACLE_PRICE_DECIMALS) {
    ORACLE_PRICE_DECIMALS = Number(
      process.env.NEXT_PUBLIC_ORACLE_PRICE_DECIMALS
    );
  }

  console.log("tokenAmount:", tokenAmount);

  // const totalDecimals = BigInt(10 ** (tokenDecimals + ORACLE_PRICE_DECIMALS));

  // console.log("totalDecimals: ", totalDecimals);

  // Convert token amount to base units (i.e., adjust for decimals)
  let formattedAmount = tokenAmount * oraclePriceUSD;
  const formattedAmountSTR = formatUnits(
    formattedAmount,
    tokenDecimals + ORACLE_PRICE_DECIMALS
  );

  // const divisor = BigInt(10 ** ORACLE_PRICE_DECIMALS);
  // const value = formattedAmount / divisor;

  console.log("formattedAmount: ", formattedAmount);

  // const formattedValue = BigInt(formatUnits(formattedAmount, tokenDecimals));

  // Format with thousands separators and 2 decimal places
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(Number(formattedAmountSTR));
};
