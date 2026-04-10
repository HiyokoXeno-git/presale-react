// ── Purchase Rescue Queue ────────────────────────────────────────────────────
// Saves confirmed purchase payloads to localStorage BEFORE calling savePurchase.
// If savePurchase fails (network error, session expire, browser close during mining),
// the payload survives. On next PresalePage mount, flushQueue() retries all pending saves.

const QUEUE_KEY = "hyk_rescue_queue";

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/** Add a confirmed payload to the queue. Called right after receipt is received. */
export function enqueue(payload) {
  const queue = readQueue();
  // Avoid duplicates by txHash
  if (queue.some(item => item.txHash?.toLowerCase() === payload.txHash?.toLowerCase())) return;
  queue.push({ ...payload, _queuedAt: Date.now() });
  writeQueue(queue);
}

/** Remove a successfully saved entry from the queue. */
export function dequeue(txHash) {
  const queue = readQueue().filter(
    item => item.txHash?.toLowerCase() !== txHash?.toLowerCase()
  );
  writeQueue(queue);
}

/** Return all pending entries. */
export function getPending() {
  return readQueue();
}
