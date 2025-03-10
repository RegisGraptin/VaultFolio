import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault - VaultFolio",
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
