import { useState } from "react";
import { supabase } from "./supabase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage({ type: "error", text: error.message });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage({ type: "error", text: error.message });
        else setMessage({ type: "success", text: "Account created! Check your email to confirm, then log in." });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) setMessage({ type: "error", text: error.message });
        else setMessage({ type: "success", text: "Password reset email sent! Check your inbox." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "13px 16px",
    color: "#d8d0e8",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: 24,
    }}>
      {/* Background gradient orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,111,255,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,237,202,0.06) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "20%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(143,211,244,0.05) 0%, transparent 70%)",
        }} />
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 420,
      }}>
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#7c6f8a", textTransform: "uppercase", marginBottom: 12 }}>
            Anthropic Learning Path
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 700, margin: "0 0 10px",
            background: "linear-gradient(135deg, #c9b8ff 0%, #8fd3f4 50%, #a8edca 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            Your AI Mastery Digest
          </h1>
          <p style={{ color: "#5a6a7a", fontSize: 13, margin: 0 }}>
            From prompt engineering to agentic systems
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(20,12,36,0.95) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          padding: 36,
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Mode tabs */}
          {mode !== "forgot" && (
            <div style={{
              display: "flex", background: "rgba(255,255,255,0.03)",
              borderRadius: 10, padding: 4, marginBottom: 28,
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              {["login", "signup"].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setMessage(null); }}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 7,
                    border: "none", cursor: "pointer",
                    fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                    transition: "all 0.2s",
                    background: mode === m ? "rgba(201,184,255,0.12)" : "transparent",
                    color: mode === m ? "#c9b8ff" : "#5a6a7a",
                    letterSpacing: "0.03em",
                  }}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {mode === "forgot" && (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => { setMode("login"); setMessage(null); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#5a6a7a", fontSize: 13, padding: 0,
                  fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6
                }}
              >
                ← Back to sign in
              </button>
              <h2 style={{ color: "#d8d0e8", fontSize: 18, fontWeight: 600, margin: "16px 0 4px" }}>
                Reset your password
              </h2>
              <p style={{ color: "#5a6a7a", fontSize: 13, margin: 0 }}>
                Enter your email and we'll send you a reset link.
              </p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13,
              background: message.type === "error" ? "rgba(244,114,182,0.08)" : "rgba(168,237,202,0.08)",
              border: `1px solid ${message.type === "error" ? "rgba(244,114,182,0.25)" : "rgba(168,237,202,0.25)"}`,
              color: message.type === "error" ? "#f472b6" : "#a8edca",
            }}>
              {message.text}
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#7c8a9a", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(201,184,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password field */}
          {mode !== "forgot" && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: "#7c8a9a", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,184,255,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              {mode === "login" && (
                <button
                  onClick={() => { setMode("forgot"); setMessage(null); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#5a6a7a", fontSize: 12, padding: "8px 0 0",
                    fontFamily: "'Inter', sans-serif", display: "block",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={e => e.target.style.color = "#c9b8ff"}
                  onMouseLeave={e => e.target.style.color = "#5a6a7a"}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 10,
              border: "1px solid rgba(201,184,255,0.3)",
              background: loading ? "rgba(201,184,255,0.06)" : "rgba(201,184,255,0.12)",
              color: loading ? "#5a6a7a" : "#c9b8ff",
              fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer",
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.background = "rgba(201,184,255,0.2)"; e.target.style.borderColor = "rgba(201,184,255,0.5)"; }}}
            onMouseLeave={e => { e.target.style.background = loading ? "rgba(201,184,255,0.06)" : "rgba(201,184,255,0.12)"; e.target.style.borderColor = "rgba(201,184,255,0.3)"; }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#3a4a5a", fontSize: 12, marginTop: 24 }}>
          Your personal AI learning tracker
        </p>
      </div>
    </div>
  );
}
