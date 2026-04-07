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
    // Store today's date (local) so we can expire at 23:59
    const today = new Date().toDateString();
    localStorage.setItem("hyk_session_date", today);
  }
  return data;
}

// Returns false if session date is not today (expired at midnight)
function isSessionDateValid() {
  const stored = localStorage.getItem("hyk_session_date");
  if (!stored) return false;
  return stored === new Date().toDateString();
}

export async function validateSession() {
  const token  = localStorage.getItem("hyk_token");
  const wallet = localStorage.getItem("hyk_wallet");
  if (!token || !wallet) return false;

  // Expire session if it's a new day (past 23:59 from login day)
  if (!isSessionDateValid()) {
    localStorage.removeItem("hyk_token");
    localStorage.removeItem("hyk_wallet");
    localStorage.removeItem("hyk_session_date");
    return false;
  }

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
  localStorage.removeItem("hyk_session_date");
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

export async function getAnnouncements() {
  try {
    const res = await fetch(`${CONFIG.presaleApiBaseUrl}/getAnnouncements.php`);
    const text = await res.text();
    if (!text) return [];
    const data = JSON.parse(text);
    if (Array.isArray(data)) return data;
    if (data?.success && Array.isArray(data.data)) return data.data;
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