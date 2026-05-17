export default function MessageModal({ type, message, txHash, onClose }) {
  if (!message) return null;

  const isSuccess   = type === "success";
  const isCancelled = type === "cancelled";

  const accentColor = isSuccess ? "#6AC645" : isCancelled ? "#FFA01C" : "#ff5050";
  const glowColor   = isSuccess ? "rgba(106,198,69,0.1)" : isCancelled ? "rgba(255,159,28,0.1)" : "rgba(255,80,80,0.1)";
  const borderColor = isSuccess ? "rgba(106,198,69,0.3)" : isCancelled ? "rgba(255,159,28,0.3)" : "rgba(255,80,80,0.3)";
  const icon        = isSuccess ? "âœ…" : isCancelled ? "âš ï¸" : "âŒ";
  const title       = isSuccess ? "Purchase Successful" : isCancelled ? "Transaction Cancelled" : "Transaction Failed";
  const btnLabel    = isSuccess ? "Done" : isCancelled ? "OK" : "Close";
  const btnBg       = isSuccess
    ? "linear-gradient(135deg, #6AC645, #4ade80)"
    : isCancelled
      ? "linear-gradient(135deg, #FFA01C, #f59e0b)"
      : "rgba(255,255,255,0.08)";
  const btnColor    = (isSuccess || isCancelled) ? "#06060F" : "#F0F0FF";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: "#0C0C18",
        border: `1px solid ${borderColor}`,
        borderRadius: "20px",
        padding: "32px 28px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        boxShadow: `0 0 40px ${glowColor}`,
        position: "relative",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          borderRadius: "20px 20px 0 0",
          background: isSuccess
            ? "linear-gradient(90deg, #6AC645, #4ade80)"
            : isCancelled
              ? "linear-gradient(90deg, #FFA01C, #f59e0b)"
              : "linear-gradient(90deg, #ff5050, #ff9050)",
        }} />

        {/* Icon */}
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>

        {/* Title */}
        <div style={{
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          fontWeight: 800, fontSize: "18px",
          color: accentColor,
          marginBottom: "10px",
        }}>
          {title}
        </div>

        {/* Message */}
        <div style={{
          fontSize: "14px", color: "#6666AA",
          lineHeight: 1.6, marginBottom: "20px",
        }}>
          {message}
        </div>

        {/* BSCScan link */}
        {txHash && (
          <div style={{ marginBottom: "20px" }}>
            <a
              href={`https://bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontSize: "12px", color: "#06E5FF",
                textDecoration: "none",
                padding: "6px 14px",
                background: "rgba(6,229,255,0.08)",
                borderRadius: "100px",
                border: "1px solid rgba(6,229,255,0.2)",
              }}
            >
              ðŸ”— View on BSCScan
            </a>
          </div>
        )}

        {/* Close / OK button */}
        <button
          onClick={onClose}
          style={{
            padding: "12px 32px",
            background: btnBg,
            color: btnColor,
            border: "none", borderRadius: "100px",
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
            fontWeight: 800, fontSize: "14px",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
