export const CONFIG = {
  chainId: 56,
  chainHex: "0x38",
  networkName: "BSC Mainnet",

  // Get your free Project ID at https://cloud.walletconnect.com
  walletConnectProjectId: "e518620b775fc7327c5c9c6b8f9282f6",

  presaleAddress: "0x76Bf46FD3386B6c95bf2945307d8d82407Cfb631",
  vestingAddress: "0x7897D7C4bf585CeC8653BDe75c1da3bF8E1e5b2d",
  tokenAddress: "0x76b7d57071997412Edb522809ff21e26DC01De19",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  

  presaleApiBaseUrl: "https://presale.hiyoko.io/presale/api",
  adminApiBaseUrl: "https://presale.hiyoko.io/admin/api",

  usdtDecimals: 18,
  tokenDecimals: 18,

  // BSCScan Mainnet API
  bscscanApiUrl: "https://api.bscscan.com/api",
  bscscanApiKey: import.meta.env.VITE_BSCSCAN_API_KEY ?? "YourApiKeyToken",

  // Presale end date — May 1 2026 07:00 WIB = 2026-05-01T00:00:00Z (UTC)
  presaleEndDate: "2026-06-01T00:00:00Z",
};