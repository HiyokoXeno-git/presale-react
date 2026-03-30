export default function MessageModal({ type, message, txHash, onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

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
        border: `1px solid ${isSuccess ? "rgba(106,198,69,0.3)" : "rgba(255,80,80,0.3)"}`,
        borderRadius: "20px",
        padding: "32px 28px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        boxShadow: `0 0 40px ${isSuccess ? "rgba(106,198,69,0.1)" : "rgba(255,80,80,0.1)"}`,
        position: "relative",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          borderRadius: "20px 20px 0 0",
          background: isSuccess
            ? "linear-gradient(90deg, #6AC645, #4ade80)"
            : "linear-gradient(90deg, #ff5050, #ff9050)",
        }} />

        {/* Icon */}
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {isSuccess ? "✅" : "❌"}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800, fontSize: "18px",
          color: isSuccess ? "#6AC645" : "#ff6060",
          marginBottom: "10px",
        }}>
          {isSuccess ? "Purchase Successful" : "Transaction Failed"}
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
              href={`https://testnet.bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontSize: "12px", color: "#00E5FF",
                textDecoration: "none",
                padding: "6px 14px",
                background: "rgba(0,229,255,0.08)",
                borderRadius: "100px",
                border: "1px solid rgba(0,229,255,0.2)",
              }}
            >
              🔗 View on BSCScan
            </a>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            padding: "12px 32px",
            background: isSuccess
              ? "linear-gradient(135deg, #6AC645, #4ade80)"
              : "rgba(255,255,255,0.08)",
            color: isSuccess ? "#06060F" : "#F0F0FF",
            border: "none", borderRadius: "100px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800, fontSize: "14px",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {isSuccess ? "Done" : "Close"}
        </button>
      </div>
    </div>
  );
}
