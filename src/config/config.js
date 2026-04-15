export const CONFIG = {
  chainId: 97,
  chainHex: "0x61",
  networkName: "BSC Testnet",

  // Get your free Project ID at https://cloud.walletconnect.com
  walletConnectProjectId: "e518620b775fc7327c5c9c6b8f9282f6",

  presaleAddress: "0x881b9c3095a33B954126FfAC029fD451Aa224eB9",
  vestingAddress: "0x232AD44dD91Fdd7E61aB7c13adD25eD7ed63214e",
  tokenAddress: "0xC171c790aBc13e368775f7112A1554708D52CD03",
  usdtAddress: "0xD0D47E5C93448CA0A30953dDD7db3350362C5Fb9",

  presaleApiBaseUrl: "http://52.65.232.128/presale/api",
  adminApiBaseUrl: "http://52.65.232.128/admin/api",

  usdtDecimals: 6,
  tokenDecimals: 18,

  // BSCScan Testnet API
  bscscanApiUrl: "https://api-testnet.bscscan.com/api",
  bscscanApiKey: import.meta.env.VITE_BSCSCAN_API_KEY ?? "YourApiKeyToken",

  // Presale end date — May 1 2026 07:00 WIB = 2026-05-01T00:00:00Z (UTC)
  presaleEndDate: "2026-05-01T00:00:00Z",
};