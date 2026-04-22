export const CONFIG = {
  chainId: 56,
  chainHex: "0x38",
  networkName: "BSC Mainnet",

  // Get your free Project ID at https://cloud.walletconnect.com
  walletConnectProjectId: "e518620b775fc7327c5c9c6b8f9282f6",

  presaleAddress: "0x725AEE2c387d0B765Edbd71230940f839605CCE8",
  vestingAddress: "0xba0D84D4F30eb69571774Ef3Cf9e977756878B5c",
  tokenAddress: "0xc5A0a5d92E1902FcA40A428EeB81E37A2f751BcB",
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