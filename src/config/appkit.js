import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";
import { CONFIG } from "./config";

const bscMainnet = defineChain({
  id: CONFIG.chainId,
  caipNetworkId: `eip155:${CONFIG.chainId}`,
  chainNamespace: "eip155",
  name: CONFIG.networkName,
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.binance.org/"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
});

const ethersAdapter = new EthersAdapter();

export const modal = createAppKit({
  adapters: [ethersAdapter],
  projectId: CONFIG.walletConnectProjectId,
  networks: [bscMainnet],
  defaultNetwork: bscMainnet,
  metadata: {
    name: "HIYOKO Presale",
    description: "Buy HYK tokens in the HIYOKO presale",
    url: "https://presale.hiyoko.io",
    icons: ["/HiyokoLogo.png"],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#FFD94E",
    "--w3m-border-radius-master": "12px",
  },
});
