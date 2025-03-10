import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaults Dashboard - VaultFolio",
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
