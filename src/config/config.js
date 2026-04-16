export const CONFIG = {
  chainId: 97,
  chainHex: "0x61",
  networkName: "BSC Testnet",

  // Get your free Project ID at https://cloud.walletconnect.com
  walletConnectProjectId: "e518620b775fc7327c5c9c6b8f9282f6",

  presaleAddress: "0x806B1FaA90535f22757B5F4fd43F692b4c4e78e6",
  vestingAddress: "0xCb19532b53D9e123F23c962e0c473a6473646ec6",
  tokenAddress: "0x17B40DBFc5B5f8db3a5878232a96F3Eed73B9423",
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