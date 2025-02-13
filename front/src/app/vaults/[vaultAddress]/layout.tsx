import { AAVEPositionProvider } from "@/components/aave/AAVEPositionProvider";
import { getAddress } from "viem";

export default async function VaultLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { vaultAddress: string };
}) {
  // FIXME: address can be undefined

  const { vaultAddress } = await params;

  return (
    <>
      <AAVEPositionProvider contractAddress={getAddress(vaultAddress)}>
        {children}
      </AAVEPositionProvider>
    </>
  );
}
