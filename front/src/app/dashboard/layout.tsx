import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Dashboard - VaultFolio",
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
