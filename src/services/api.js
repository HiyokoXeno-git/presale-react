import { CONFIG } from "../config/config";

// ── Server-side session (24 h TTL) ───────────────────────────────────────────

export async function createSession(walletAddress) {
  const res = await fetch(`${CONFIG.presaleApiBaseUrl}/session.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  const data = await res.json();
  if (data?.success && data.token) {
    localStorage.setItem("hyk_token", data.token);
    localStorage.setItem("hyk_wallet", walletAddress.toLowerCase());
  }
  return data;
}

export async function validateSession() {
  const token  = localStorage.getItem("hyk_token");
  const wallet = localStorage.getItem("hyk_wallet");
  if (!token || !wallet) return false;
  try {
    const res = await fetch(
      `${CONFIG.presaleApiBaseUrl}/session.php?token=${encodeURIComponent(token)}&wallet=${encodeURIComponent(wallet)}`
    );
    const data = await res.json();
    return !!data?.valid;
  } catch {
    return false;
  }
}

export async function destroySession() {
  const token = localStorage.getItem("hyk_token");
  localStorage.removeItem("hyk_token");
  localStorage.removeItem("hyk_wallet");
  localStorage.removeItem("hyk_session"); // legacy key cleanup
  if (!token) return;
  try {
    await fetch(`${CONFIG.presaleApiBaseUrl}/session.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch { /* ignore */ }
}

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

export async function getPresaleStats() {
  const response = await fetch(`${CONFIG.adminApiBaseUrl}/getStats.php`);
  const text = await response.text();
  if (!text) return null;
  try {
    const data = JSON.parse(text);
    return data?.success ? data.data : null;
  } catch {
    return null;
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