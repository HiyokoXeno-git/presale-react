import { CONFIG } from "../config/config";

export async function fetchBnbQuote(walletAddress, bnbAmount) {
  const response = await fetch(`${CONFIG.presaleApiBaseUrl}/signBnbQuote.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      walletAddress,
      bnbAmount
    })
  });

  const text = await response.text();

  if (!text) {
    throw new Error("signBnbQuote.php returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`signBnbQuote.php did not return valid JSON. Response: ${text}`);
  }
}

export async function getUserTransactions(walletAddress) {
  const url = `${CONFIG.adminApiBaseUrl}/getUsers.php?wallet=${encodeURIComponent(walletAddress)}`;
  const response = await fetch(url);
  const text = await response.text();
  if (!text) return [];
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function savePurchase(payload) {
  const safePayload = JSON.parse(
    JSON.stringify(payload, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

  const response = await fetch(`${CONFIG.adminApiBaseUrl}/savePurchase.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(safePayload)
  });

  const text = await response.text();

  if (!text) {
    throw new Error("savePurchase.php returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`savePurchase.php did not return valid JSON. Response: ${text}`);
  }
}