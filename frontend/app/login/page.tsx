tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    alert(`Email: ${email}\nPassword: ${password}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "320px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Login</h1>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </main>
  );
}

