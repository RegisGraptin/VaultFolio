import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  scroll,
  scrollSepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_SITE_NAME!,
  projectId: process.env.REOWN_PROJECT_ID!,
  chains: [
    scroll,
    ...(process.env.DEV_ENV === "true" ? [scrollSepolia] : []),
  ],
  ssr: true,
});
