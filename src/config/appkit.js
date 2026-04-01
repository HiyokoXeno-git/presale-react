import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";
import { CONFIG } from "./config";

const bscTestnet = defineChain({
  id: CONFIG.chainId,
  caipNetworkId: `eip155:${CONFIG.chainId}`,
  chainNamespace: "eip155",
  name: CONFIG.networkName,
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"] },
  },
  blockExplorers: {
    default: { name: "BscScan Testnet", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
});

const ethersAdapter = new EthersAdapter();

export const modal = createAppKit({
  adapters: [ethersAdapter],
  projectId: CONFIG.walletConnectProjectId,
  networks: [bscTestnet],
  defaultNetwork: bscTestnet,
  metadata: {
    name: "HIYOKO Presale",
    description: "Buy HYK tokens in the HIYOKO presale",
    url: "http://52.65.232.128",
    icons: ["/HiyokoLogo.png"],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#FFD84D",
    "--w3m-border-radius-master": "12px",
  },
});
