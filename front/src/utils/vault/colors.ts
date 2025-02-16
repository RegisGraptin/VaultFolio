export const VAULT_COLORS: string[] = [
  "red",
  "blue",
  "green",
  "purple",
  "yellow",
];

const colorClasses: Record<string, string> = {
  red: "bg-red-100 text-red-800 border-red-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  green: "bg-green-100 text-green-800 border-green-300",
  purple: "bg-purple-100 text-purple-800 border-purple-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export const getVaultColor = (index: number | undefined): string => {
  if (index === undefined) return "";
  return colorClasses[VAULT_COLORS[index]];
};
