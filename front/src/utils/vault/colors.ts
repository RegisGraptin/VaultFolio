export const VAULT_COLORS: string[] = [
  "red",
  "blue",
  "green",
  "purple",
  "yellow",
];

const colorClasses: Record<string, string> = {
  undefined: "bg-gray-300 text-gray-800 border-gray-300",
  red: "bg-red-100 text-red-800 border-red-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  green: "bg-green-100 text-green-800 border-green-300",
  purple: "bg-purple-100 text-purple-800 border-purple-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export const getVaultColor = (index: number | undefined): string => {
  if (index === undefined) return colorClasses["undefined"];
  return colorClasses[VAULT_COLORS[index]];
};

const menuColorClasses: Record<string, string> = {
  undefined: "hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300",
  red: "hover:bg-red-100 hover:text-red-900 hover:border-red-300",
  blue: "hover:bg-blue-100 hover:text-blue-900 hover:border-blue-300",
  green: "hover:bg-green-100 hover:text-green-900 hover:border-green-300",
  purple: "hover:bg-purple-100 hover:text-purple-900 hover:border-purple-300",
  yellow: "hover:bg-yellow-100 hover:text-yellow-900 hover:border-yellow-300",
};

export const getMenuColorStyle = (index: number | undefined): string => {
  if (index === undefined) return menuColorClasses["undefined"];
  return menuColorClasses[VAULT_COLORS[index]];
};
