
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const cardRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 18);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width) * 100;

      const y =
        ((event.clientY - rect.top) / rect.height) * 100;

      const rotateX = ((y - 50) / 50) * -1.4;
      const rotateY = ((x - 50) / 50) * 1.4;

      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
    };

    const handlePointerLeave = () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please agree to the terms before creating your account.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      alert(
        `Account created!\n\nName: ${fullName}\nEmail: ${email}`
      );
    }, 900);
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: #263114;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Display",
            "SF Pro Text",
            "Segoe UI",
            sans-serif;
          background: #dfe9b0;
        }

        button,
        input {
          font: inherit;
        }

        /* =========================
           PAGE
        ========================= */

        .ios-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;

          background:
            radial-gradient(
              650px circle at 5% 8%,
              rgba(193, 218, 70, 0.48),
              transparent 68%
            ),
            radial-gradient(
              650px circle at 95% 15%,
              rgba(235, 242, 155, 0.68),
              transparent 67%
            ),
            radial-gradient(
              700px circle at 82% 105%,
              rgba(179, 205, 67, 0.38),
              transparent 68%
            ),
            radial-gradient(
              560px circle at 18% 90%,
              rgba(249, 251, 216, 0.78),
              transparent 68%
            ),
            linear-gradient(
              135deg,
              #d9e5a2 0%,
              #edf3cb 45%,
              #d8e5a0 100%
            );
        }

        .ios-page::before {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              115deg,
              rgba(255,255,255,0.34),
              transparent 22%,
              transparent 68%,
              rgba(255,255,255,0.18)
            );

          z-index: -3;
        }

        .ios-page::after {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0.12;

          background-image:
            radial-gradient(
              rgba(255,255,255,0.9) 0.6px,
              transparent 0.7px
            );

          background-size: 5px 5px;

          mix-blend-mode: soft-light;

          z-index: -2;
        }

        /* =========================
           AMBIENT LIGHT
        ========================= */

        .ambient {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          filter: blur(2px);
        }

        .ambient-one {
          width: 460px;
          height: 460px;

          left: -170px;
          top: 8%;

          background:
            radial-gradient(
              circle at 35% 35%,
              rgba(196, 221, 74, 0.62),
              rgba(182, 207, 63, 0.25) 42%,
              transparent 72%
            );

          box-shadow:
            inset -35px -35px 90px
            rgba(255,255,255,0.22);
        }

        .ambient-two {
          width: 520px;
          height: 520px;

          right: -190px;
          top: 16%;

          background:
            radial-gradient(
              circle at 35% 30%,
              rgba(246, 249, 192, 0.86),
              rgba(206, 225, 107, 0.30) 46%,
              transparent 73%
            );
        }

        .ambient-three {
          width: 410px;
          height: 410px;

          left: 33%;
          bottom: -190px;

          background:
            radial-gradient(
              circle,
              rgba(171, 198, 57, 0.32),
              rgba(220, 233, 137, 0.15) 48%,
              transparent 72%
            );
        }

        /* =========================
           GLASS HEADER
        ========================= */

        .ios-header {
          position: fixed;

          top: 18px;
          left: 50%;

          transform: translateX(-50%);

          width: min(920px, calc(100% - 32px));
          height: 64px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 18px;

          border-radius: 24px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.16),
              rgba(255,255,255,0.035) 42%,
              rgba(225,238,165,0.07)
            );

          border:
            1px solid rgba(255,255,255,0.72);

          backdrop-filter:
            blur(45px)
            saturate(220%)
            brightness(116%);

          -webkit-backdrop-filter:
            blur(45px)
            saturate(220%)
            brightness(116%);

          box-shadow:
            0 25px 65px rgba(63,77,17,0.14),
            0 8px 25px rgba(70,85,19,0.07),
            inset 0 1px 1px rgba(255,255,255,0.90),
            inset 0 -1px 1px rgba(74,89,20,0.04);

          overflow: hidden;

          z-index: 20;

          transition:
            top 0.3s ease,
            height 0.3s ease,
            box-shadow 0.3s ease;
        }

        .ios-header::before {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,0.42),
              transparent 24%,
              transparent 66%,
              rgba(255,255,255,0.10)
            ),
            radial-gradient(
              ellipse at 50% -100%,
              rgba(255,255,255,0.52),
              transparent 65%
            );

          opacity: 0.75;
        }

        .ios-header::after {
          content: "";

          position: absolute;

          left: 8%;
          right: 8%;
          top: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.95),
              transparent
            );

          opacity: 0.75;
        }

        .ios-header.scrolled {
          top: 10px;
          height: 58px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.20),
              rgba(255,255,255,0.045),
              rgba(225,238,165,0.08)
            );

          box-shadow:
            0 26px 70px rgba(63,77,17,0.17),
            inset 0 1px 1px rgba(255,255,255,0.94);
        }

        .header-brand,
        .header-status {
          position: relative;
          z-index: 2;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #293414;

          font-size: 17px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .header-dot {
          width: 35px;
          height: 35px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: #394718;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.34),
              rgba(194,216,87,0.09)
            );

          border:
            1px solid rgba(255,255,255,0.66);

          backdrop-filter:
            blur(24px)
            saturate(190%);

          -webkit-backdrop-filter:
            blur(24px)
            saturate(190%);

          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.88),
            inset 0 -1px 1px rgba(70,87,17,0.04),
            0 8px 22px rgba(72,87,21,0.10);
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 7px 12px;

          border-radius: 999px;

          color: #596633;

          font-size: 12px;
          font-weight: 650;

          background:
            rgba(255,255,255,0.065);

          border:
            1px solid rgba(255,255,255,0.42);

          backdrop-filter:
            blur(22px)
            saturate(180%);

          -webkit-backdrop-filter:
            blur(22px)
            saturate(180%);

          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.58);
        }

        .status-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #91ae35;

          box-shadow:
            0 0 0 4px rgba(145,174,53,0.14),
            0 0 15px rgba(145,174,53,0.38);
        }

        /* =========================
           REGISTER AREA
        ========================= */

        .register-zone {
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            115px 20px
            65px;
        }

        /* =========================
           GLASS CARD
        ========================= */

        .glass-card {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;

          position: relative;

          width: min(455px, 100%);

          padding:
            38px 39px
            31px;

          border-radius: 38px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.105) 0%,
              rgba(255,255,255,0.025) 35%,
              rgba(221,237,157,0.035) 65%,
              rgba(255,255,255,0.075) 100%
            );

          border:
            1px solid rgba(255,255,255,0.76);

          backdrop-filter:
            blur(48px)
            saturate(225%)
            brightness(116%)
            contrast(103%);

          -webkit-backdrop-filter:
            blur(48px)
            saturate(225%)
            brightness(116%)
            contrast(103%);

          box-shadow:
            0 55px 130px rgba(48,63,10,0.18),
            0 25px 65px rgba(67,82,17,0.10),
            0 0 0 1px rgba(255,255,255,0.15),
            inset 0 2px 2px rgba(255,255,255,0.96),
            inset 2px 0 2px rgba(255,255,255,0.30),
            inset -2px 0 2px rgba(255,255,255,0.10),
            inset 0 -2px 3px rgba(67,82,15,0.08),
            inset 0 0 45px rgba(255,255,255,0.075);

          transform:
            perspective(1400px)
            rotateX(var(--rx))
            rotateY(var(--ry));

          transition:
            transform 0.16s ease,
            box-shadow 0.35s ease;

          overflow: hidden;
          isolation: isolate;
        }

        .glass-card::before {
          content: "";

          position: absolute;
          inset: -3px;

          pointer-events: none;

          background:
            radial-gradient(
              500px circle at var(--mx) var(--my),
              rgba(255,255,255,0.40) 0%,
              rgba(237,247,181,0.16) 18%,
              rgba(209,232,116,0.065) 38%,
              transparent 68%
            );

          opacity: 0.92;

          filter: blur(3px);

          mix-blend-mode: screen;

          z-index: 0;
        }

        .glass-card::after {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          border-radius: inherit;

          background:
            linear-gradient(
              118deg,
              rgba(255,255,255,0.46) 0%,
              rgba(255,255,255,0.17) 9%,
              rgba(255,255,255,0.025) 22%,
              transparent 37%
            ),
            radial-gradient(
              ellipse at 50% -20%,
              rgba(255,255,255,0.40),
              transparent 58%
            ),
            radial-gradient(
              ellipse at 50% 115%,
              rgba(168,198,57,0.09),
              transparent 60%
            );

          opacity: 0.82;

          z-index: 1;
        }

        .glass-card > * {
          position: relative;
          z-index: 5;
        }

        .top-light {
          position: absolute;

          top: -170px;
          left: 50%;

          transform: translateX(-50%);

          width: 430px;
          height: 270px;

          background:
            radial-gradient(
              ellipse,
              rgba(255,255,255,0.52) 0%,
              rgba(255,255,255,0.20) 27%,
              rgba(255,255,255,0.045) 50%,
              transparent 73%
            );

          filter: blur(20px);

          pointer-events: none;

          opacity: 0.75;

          z-index: 2;
        }

        /* =========================
           LOGO
        ========================= */

        .logo {
          width: 62px;
          height: 62px;

          margin:
            0 auto
            18px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 21px;

          color: #374517;

          font-size: 25px;
          font-weight: 800;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.28),
              rgba(190,214,82,0.07)
            );

          border:
            1px solid rgba(255,255,255,0.70);

          backdrop-filter:
            blur(25px)
            saturate(200%);

          -webkit-backdrop-filter:
            blur(25px)
            saturate(200%);

          box-shadow:
            inset 0 1px 2px rgba(255,255,255,0.95),
            inset 0 -1px 2px rgba(70,87,17,0.05),
            0 18px 38px rgba(70,85,19,0.12);
        }

        /* =========================
           TEXT
        ========================= */

        .title {
          margin: 0;

          text-align: center;

          color: #273214;

          font-size: 31px;
          line-height: 1.15;

          font-weight: 760;

          letter-spacing: -1.1px;

          text-shadow:
            0 1px 0 rgba(255,255,255,0.60);
        }

        .subtitle {
          margin:
            9px 0
            24px;

          text-align: center;

          color: #697545;

          font-size: 14px;
          line-height: 1.5;
        }

        /* =========================
           ERROR
        ========================= */

        .error {
          margin-bottom: 17px;

          padding:
            12px 14px;

          border-radius: 15px;

          color: #7d3b31;

          font-size: 13px;
          line-height: 1.4;

          background:
            rgba(255,225,220,0.16);

          border:
            1px solid rgba(255,190,180,0.44);

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.55);
        }

        /* =========================
           FORM
        ========================= */

        .label {
          display: block;

          margin:
            0 0
            7px;

          color: #53602d;

          font-size: 13px;
          font-weight: 650;
        }

        .input-wrap {
          position: relative;
          margin-bottom: 15px;
        }

        .input {
          width: 100%;

          height: 50px;

          padding:
            0 16px;

          border-radius: 17px;

          outline: none;

          color: #2c3619;

          font-size: 14px;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.13),
              rgba(255,255,255,0.025)
            );

          border:
            1px solid rgba(255,255,255,0.48);

          backdrop-filter:
            blur(22px)
            saturate(175%);

          -webkit-backdrop-filter:
            blur(22px)
            saturate(175%);

          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.70),
            inset 0 -1px 1px rgba(72,88,17,0.035),
            0 6px 18px rgba(67,82,17,0.035);

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .input::placeholder {
          color: #8b9564;
        }

        .input:focus {
          border-color:
            rgba(149,175,57,0.60);

          background:
            rgba(255,255,255,0.20);

          box-shadow:
            0 0 0 4px rgba(161,186,68,0.10),
            0 8px 22px rgba(70,85,18,0.06),
            inset 0 1px 1px rgba(255,255,255,0.86);
        }

        /* =========================
           PASSWORD BUTTON
        ========================= */

        .show-button {
          position: absolute;

          top: 50%;
          right: 9px;

          transform: translateY(-50%);

          height: 34px;

          padding:
            0 11px;

          border-radius: 11px;

          color: #617031;

          background:
            rgba(255,255,255,0.075);

          border:
            1px solid rgba(255,255,255,0.40);

          backdrop-filter:
            blur(18px);

          -webkit-backdrop-filter:
            blur(18px);

          cursor: pointer;

          font-size: 12px;
          font-weight: 650;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .show-button:hover {
          background:
            rgba(255,255,255,0.18);
        }

        .show-button:active {
          transform:
            translateY(-50%)
            scale(0.96);
        }

        /* =========================
           TERMS
        ========================= */

        .terms {
          display: flex;
          align-items: flex-start;
          gap: 9px;

          margin:
            4px 0
            20px;

          color: #687443;

          font-size: 12px;
          line-height: 1.45;

          cursor: pointer;
        }

        .terms input {
          appearance: none;

          flex: 0 0 auto;

          width: 16px;
          height: 16px;

          margin: 1px 0 0;

          border-radius: 5px;

          border:
            1px solid rgba(108,124,44,0.30);

          background:
            rgba(255,255,255,0.13);

          cursor: pointer;
        }

        .terms input:checked {
          background: #99af3d;
          border-color: #99af3d;
        }

        .terms input:checked::after {
          content: "";

          display: block;

          width: 4px;
          height: 8px;

          margin-left: 5px;
          margin-top: 2px;

          border:
            solid white;

          border-width:
            0 2px 2px 0;

          transform: rotate(45deg);
        }

        .terms strong {
          color: #586827;
          font-weight: 700;
        }

        /* =========================
           REGISTER BUTTON
        ========================= */

        .register-button-main {
          position: relative;

          width: 100%;
          height: 54px;

          overflow: hidden;

          border-radius: 17px;

          border:
            1px solid rgba(255,255,255,0.52);

          color: #faffea;

          background:
            linear-gradient(
              135deg,
              rgba(116,141,32,0.90),
              rgba(159,181,56,0.86)
            );

          box-shadow:
            0 17px 34px rgba(80,97,23,0.20),
            inset 0 1px 1px rgba(255,255,255,0.44),
            inset 0 -1px 1px rgba(65,81,16,0.13);

          cursor: pointer;

          font-size: 14px;
          font-weight: 700;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .register-button-main::before {
          content: "";

          position: absolute;

          top: 0;
          left: -100%;

          width: 70%;
          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.28),
              transparent
            );

          transform: skewX(-20deg);

          transition:
            left 0.55s ease;
        }

        .register-button-main:hover::before {
          left: 140%;
        }

        .register-button-main:hover:not(:disabled) {
          transform:
            translateY(-2px);

          filter:
            brightness(1.05);

          box-shadow:
            0 23px 40px rgba(80,97,23,0.25),
            inset 0 1px 1px rgba(255,255,255,0.48);
        }

        .register-button-main:active:not(:disabled) {
          transform:
            scale(0.985);
        }

        .register-button-main.loading {
          opacity: 0.72;
          cursor: wait;
        }

        .register-button-main:disabled {
          cursor: not-allowed;
        }

        /* =========================
           DIVIDER
        ========================= */

        .divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin:
            23px 0
            20px;
        }

        .divider-line {
          flex: 1;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(96,112,38,0.20),
              transparent
            );
        }

        .divider-text {
          color: #899361;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1px;
        }

        /* =========================
           LOGIN LINK
        ========================= */

        .login-text {
          text-align: center;

          color: #737d50;

          font-size: 12px;
        }

        .login-button {
          padding: 0;

          border: 0;

          background: transparent;

          color: #586827;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;
        }

        .login-button:hover {
          color: #3f4d18;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {
          .ios-header {
            width:
              calc(100% - 20px);

            top: 10px;

            height: 58px;

            padding:
              0 14px;

            border-radius: 20px;
          }

          .header-brand {
            font-size: 15px;
          }

          .header-status {
            padding:
              6px 9px;

            font-size: 10px;
          }

          .register-zone {
            padding:
              95px 15px
              45px;
          }

          .glass-card {
            width:
              min(455px, 100%);

            padding:
              31px 23px
              26px;

            border-radius: 31px;

            backdrop-filter:
              blur(40px)
              saturate(210%)
              brightness(114%);

            -webkit-backdrop-filter:
              blur(40px)
              saturate(210%)
              brightness(114%);
          }

          .title {
            font-size: 28px;
          }

          .subtitle {
            margin-bottom: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glass-card,
          .ios-header,
          .register-button-main,
          .show-button {
            transition: none;
          }
        }
      `}</style>

      <main className="ios-page">

        {/* HEADER */}

        <header
          className={`ios-header ${
            scrolled ? "scrolled" : ""
          }`}
        >
          <div className="header-brand">
            <div className="header-dot">
              S
            </div>

            <span>
              SignLearnAI
            </span>
          </div>

          <div className="header-status">
            <span className="status-dot" />
            Create account
          </div>
        </header>

        {/* AMBIENT BACKGROUND */}

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        {/* REGISTER */}

        <section className="register-zone">

          <form
            ref={cardRef}
            onSubmit={handleRegister}
            className="glass-card"
          >

            <div className="top-light" />

            {/* LOGO */}

            <div className="logo">
              S
            </div>

            {/* TITLE */}

            <h1 className="title">
              Create Account
            </h1>

            <p className="subtitle">
              Join SignLearnAI and start learning
            </p>

            {/* ERROR */}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* FULL NAME */}

            <label
              htmlFor="fullName"
              className="label"
            >
              Full name
            </label>

            <div className="input-wrap">
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
                className="input"
              />
            </div>

            {/* EMAIL */}

            <label
              htmlFor="email"
              className="label"
            >
              Email address
            </label>

            <div className="input-wrap">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                className="input"
              />
            </div>

            {/* PASSWORD */}

            <label
              htmlFor="password"
              className="label"
            >
              Password
            </label>

            <div className="input-wrap">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                className="input"
                style={{
                  paddingRight: "72px",
                }}
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <label
              htmlFor="confirmPassword"
              className="label"
            >
              Confirm password
            </label>

            <div className="input-wrap">

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
                className="input"
                style={{
                  paddingRight: "72px",
                }}
              />

              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                checked={agree}
                onChange={(event) =>
                  setAgree(event.target.checked)
                }
              />

              <span>
                I agree to the{" "}
                <strong>
                  Terms of Service
                </strong>{" "}
                and{" "}
                <strong>
                  Privacy Policy
                </strong>
              </span>

            </label>

            {/* REGISTER */}

            <button
              type="submit"
              disabled={loading}
              className={`register-button-main ${
                loading ? "loading" : ""
              }`}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

            {/* DIVIDER */}

            <div className="divider">

              <div className="divider-line" />

              <span className="divider-text">
                OR
              </span>

              <div className="divider-line" />

            </div>

            {/* LOGIN */}

            <div className="login-text">

              Already have an account?{" "}

              <button
                type="button"
                className="login-button"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Sign in
              </button>

            </div>

          </form>

        </section>

      </main>
    </>
  );
}

