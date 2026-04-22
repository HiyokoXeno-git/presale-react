export const CONFIG = {
  chainId: 56,
  chainHex: "0x38",
  networkName: "BSC Mainnet",

  // Get your free Project ID at https://cloud.walletconnect.com
  walletConnectProjectId: "e518620b775fc7327c5c9c6b8f9282f6",

  presaleAddress: "0xD10383EE18322cACBC568eDa637a5Ad624925a81",
  vestingAddress: "0x863D2189c55E3Ae663011bEf19159af8061398De",
  tokenAddress: "0x3251afe0C8ed2451C6dC2bB371A593e567dBc510",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",

  presaleApiBaseUrl: "https://presale.hiyoko.io/presale/api",
  adminApiBaseUrl: "https://presale.hiyoko.io/admin/api",

  usdtDecimals: 18,
  tokenDecimals: 18,

  // BSCScan Mainnet API
  bscscanApiUrl: "https://api.bscscan.com/api",
  bscscanApiKey: import.meta.env.VITE_BSCSCAN_API_KEY ?? "YourApiKeyToken",

  // Presale end date — May 1 2026 07:00 WIB = 2026-05-01T00:00:00Z (UTC)
  presaleEndDate: "2026-05-01T00:00:00Z",
};