import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { scroll, scrollSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_SITE_NAME!,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  chains: [
    // scroll,
    scrollSepolia,
    // ...(process.env.DEV_ENV === "true" ? [scrollSepolia] : []),
  ],
  transports: {
    [scrollSepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_HTTP!),
  },
  ssr: true,
});
