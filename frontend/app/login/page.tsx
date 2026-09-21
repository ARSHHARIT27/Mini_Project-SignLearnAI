
"use client";

import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      alert(
        `Email: ${email}\nPassword: ${password}\nRemember me: ${
          rememberMe ? "Yes" : "No"
        }`
      );
    }, 800);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#eef4ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "30px",
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "0 auto 12px",
              borderRadius: "12px",
              backgroundColor: "#0070f3",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            S
          </div>

          <h1
            style={{
              margin: "0",
              color: "#111827",
              fontSize: "26px",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Login to continue
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "7px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <label
          htmlFor="email"
          style={{
            display: "block",
            marginBottom: "7px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{
            width: "100%",
            padding: "11px",
            marginBottom: "17px",
            boxSizing: "border-box",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />

        <label
          htmlFor="password"
          style={{
            display: "block",
            marginBottom: "7px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Password
        </label>

        <div
          style={{
            position: "relative",
            marginBottom: "12px",
          }}
        >
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "11px 60px 11px 11px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              backgroundColor: "transparent",
              color: "#0070f3",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() =>
              alert("Enter your email and we will send a reset link.")
            }
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#0070f3",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "11px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: loading ? "#6ba3e8" : "#0070f3",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingTop: "18px",
            borderTop: "1px solid #e5e7eb",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => alert("Registration page coming soon.")}
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#0070f3",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            Create account
          </button>
        </div>
      </form>
    </main>
  );
}

