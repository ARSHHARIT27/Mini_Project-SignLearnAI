
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const cardRef = useRef<HTMLFormElement>(null);

  /*
  =====================================================
  SCROLL DETECTION
  =====================================================
  */

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

  /*
  =====================================================
  FLUID GLASS CARD
  =====================================================
  */

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width) * 100;

      const y =
        ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);

      const rotateX = ((y - 50) / 50) * -1.2;
      const rotateY = ((x - 50) / 50) * 1.2;

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
    };

    const handlePointerLeave = () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    card.addEventListener(
      "pointermove",
      handlePointerMove
    );

    card.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      card.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      card.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  /*
  =====================================================
  LOGIN
  =====================================================
  */

  function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
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
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
        }

        body {
          background: #01040b;
        }

        /*
        =====================================================
        PAGE
        =====================================================
        */

        .ios-page {
          --mx: 50%;
          --my: 50%;
          --rx: 0deg;
          --ry: 0deg;

          min-height: 125vh;
          width: 100%;

          position: relative;
          overflow: hidden;

          background:
            radial-gradient(
              700px circle at 12% 5%,
              rgba(7, 42, 92, 0.25),
              transparent 62%
            ),
            radial-gradient(
              650px circle at 90% 92%,
              rgba(20, 29, 105, 0.18),
              transparent 63%
            ),
            radial-gradient(
              450px circle at 50% 45%,
              rgba(3, 27, 59, 0.11),
              transparent 70%
            ),
            linear-gradient(
              145deg,
              #01030a 0%,
              #010713 42%,
              #01040b 100%
            );

          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Display",
            "SF Pro Text",
            "Helvetica Neue",
            Arial,
            sans-serif;

          color: #f5f8fc;
        }

        /*
        =====================================================
        AMBIENT NAVY LIGHT
        =====================================================
        */

        .ambient {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(78px);

          opacity: 0.34;

          animation:
            ambientFloat 16s
            ease-in-out
            infinite;
        }

        .ambient-one {
          width: 360px;
          height: 360px;

          left: -160px;
          top: -130px;

          background:
            rgba(7, 54, 118, 0.34);
        }

        .ambient-two {
          width: 430px;
          height: 430px;

          right: -190px;
          bottom: -190px;

          background:
            rgba(25, 31, 120, 0.25);

          animation-delay: -6s;
        }

        .ambient-three {
          width: 230px;
          height: 230px;

          right: 18%;
          top: 12%;

          background:
            rgba(7, 80, 145, 0.10);

          animation-delay: -10s;
        }

        @keyframes ambientFloat {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0);
          }

          50% {
            transform:
              translate3d(18px, -15px, 0);
          }
        }

        /*
        =====================================================
        IOS LIQUID GLASS HEADER
        =====================================================
        */

        .ios-header {
          position: fixed;

          top: 14px;
          left: 50%;

          transform:
            translateX(-50%)
            translateY(0);

          width:
            min(
              calc(100% - 32px),
              1050px
            );

          height: 58px;

          z-index: 100;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 17px;

          border-radius: 21px;

          background:
            linear-gradient(
              135deg,
              rgba(14, 35, 65, 0.34),
              rgba(2, 13, 29, 0.22)
            );

          border:
            1px solid
            rgba(125, 174, 220, 0.10);

          backdrop-filter:
            blur(34px)
            saturate(175%)
            brightness(105%);

          -webkit-backdrop-filter:
            blur(34px)
            saturate(175%)
            brightness(105%);

          box-shadow:
            0 8px 32px
              rgba(0, 0, 0, 0.22),

            0 2px 10px
              rgba(0, 22, 52, 0.18),

            inset 0 1px 1px
              rgba(150, 200, 240, 0.11),

            inset 0 -1px 1px
              rgba(0, 0, 0, 0.16);

          transition:
            background 500ms
              cubic-bezier(.2,.8,.2,1),

            backdrop-filter 500ms
              cubic-bezier(.2,.8,.2,1),

            -webkit-backdrop-filter 500ms
              cubic-bezier(.2,.8,.2,1),

            border-color 500ms ease,

            box-shadow 500ms ease,

            transform 500ms
              cubic-bezier(.2,.8,.2,1),

            height 500ms
              cubic-bezier(.2,.8,.2,1);

          overflow: hidden;

          isolation: isolate;
        }

        /*
        Moving liquid refraction.
        */

        .ios-header::before {
          content: "";

          position: absolute;

          inset: -80px;

          border-radius: inherit;

          pointer-events: none;

          background:
            radial-gradient(
              260px circle at 15% 0%,
              rgba(48, 126, 202, 0.17),
              transparent 68%
            ),

            radial-gradient(
              300px circle at 85% 100%,
              rgba(45, 65, 170, 0.12),
              transparent 70%
            );

          opacity: 0.65;

          transform:
            translate3d(0, 0, 0);

          transition:
            opacity 500ms ease,
            transform 700ms
              cubic-bezier(.2,.8,.2,1);
        }

        /*
        Moving glass reflection.
        */

        .ios-header::after {
          content: "";

          position: absolute;

          top: -100%;
          left: -45%;

          width: 42%;
          height: 300%;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(135, 190, 235, 0.08),
              rgba(190, 220, 245, 0.12),
              transparent
            );

          transform:
            skewX(-18deg)
            translateX(0);

          opacity: 0;

          transition:
            opacity 500ms ease;
        }

        /*
        =====================================================
        SCROLLED HEADER
        =====================================================
        */

        .ios-header.scrolled {
          top: 10px;

          height: 55px;

          transform:
            translateX(-50%)
            translateY(0);

          background:
            linear-gradient(
              135deg,
              rgba(16, 42, 76, 0.48),
              rgba(3, 17, 36, 0.38)
            );

          border:
            1px solid
            rgba(132, 187, 232, 0.19);

          backdrop-filter:
            blur(42px)
            saturate(190%)
            brightness(108%);

          -webkit-backdrop-filter:
            blur(42px)
            saturate(190%)
            brightness(108%);

          box-shadow:
            0 18px 48px
              rgba(0, 0, 0, 0.38),

            0 5px 20px
              rgba(0, 28, 65, 0.28),

            inset 0 1px 1px
              rgba(180, 220, 250, 0.18),

            inset 0 -1px 1px
              rgba(0, 0, 0, 0.20);
        }

        .ios-header.scrolled::before {
          opacity: 1;

          transform:
            translate3d(
              8px,
              -4px,
              0
            )
            scale(1.05);
        }

        .ios-header.scrolled::after {
          opacity: 1;

          animation:
            glassReflection 5s
            ease-in-out
            infinite;
        }

        @keyframes glassReflection {
          0% {
            transform:
              skewX(-18deg)
              translateX(-20%);
          }

          50% {
            transform:
              skewX(-18deg)
              translateX(240%);
          }

          100% {
            transform:
              skewX(-18deg)
              translateX(240%);
          }
        }

        /*
        =====================================================
        HEADER CONTENT
        =====================================================
        */

        .header-brand,
        .header-status {
          position: relative;

          z-index: 5;
        }

        .header-brand {
          display: flex;
          align-items: center;

          gap: 10px;

          color:
            rgba(241, 247, 253, 0.91);

          font-size: 15px;

          font-weight: 650;

          letter-spacing: -0.15px;

          text-shadow:
            0 1px 10px
            rgba(0, 0, 0, 0.18);
        }

        .header-dot {
          width: 29px;
          height: 29px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background:
            linear-gradient(
              145deg,
              rgba(43, 113, 180, 0.80),
              rgba(10, 45, 86, 0.72)
            );

          border:
            1px solid
            rgba(155, 207, 246, 0.19);

          color:
            rgba(242, 249, 255, 0.96);

          font-size: 11px;

          font-weight: 750;

          box-shadow:
            0 5px 15px
              rgba(0, 35, 82, 0.28),

            inset 0 1px 1px
              rgba(220, 240, 255, 0.16),

            inset 0 -1px 1px
              rgba(0, 0, 0, 0.18);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          transition:
            transform 400ms
              cubic-bezier(.2,.8,.2,1),

            box-shadow 400ms ease;
        }

        .ios-header:hover .header-dot {
          transform:
            scale(1.04)
            translateY(-1px);

          box-shadow:
            0 7px 18px
              rgba(0, 45, 100, 0.34),

            inset 0 1px 1px
              rgba(220, 240, 255, 0.20);
        }

        .header-status {
          display: flex;
          align-items: center;

          gap: 7px;

          color:
            rgba(165, 193, 219, 0.50);

          font-size: 11px;

          font-weight: 500;

          transition:
            color 400ms ease;
        }

        .ios-header.scrolled .header-status {
          color:
            rgba(183, 207, 229, 0.64);
        }

        .status-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background:
            #3c82c5;

          box-shadow:
            0 0 8px
              rgba(60, 130, 197, 0.42),

            0 0 16px
              rgba(60, 130, 197, 0.16);

          transition:
            box-shadow 400ms ease,
            transform 400ms ease;
        }

        .ios-header.scrolled .status-dot {
          transform:
            scale(1.15);

          box-shadow:
            0 0 9px
              rgba(70, 145, 215, 0.60),

            0 0 18px
              rgba(60, 130, 197, 0.24);
        }

        /*
        =====================================================
        LOGIN SECTION
        =====================================================
        */

        .login-zone {
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding:
            95px 24px 110px;

          position: relative;

          z-index: 5;
        }

        /*
        =====================================================
        LOGIN GLASS
        =====================================================
        */

        .glass-card {
          width: 100%;
          max-width: 425px;

          position: relative;

          padding: 38px;

          border-radius: 31px;

          background:
            linear-gradient(
              145deg,
              rgba(9, 27, 51, 0.68),
              rgba(2, 12, 27, 0.70)
            );

          border:
            1px solid
            rgba(145, 181, 216, 0.16);

          backdrop-filter:
            blur(44px)
            saturate(145%);

          -webkit-backdrop-filter:
            blur(44px)
            saturate(145%);

          box-shadow:
            0 40px 100px
              rgba(0, 0, 0, 0.58),

            0 12px 40px
              rgba(0, 18, 45, 0.30),

            inset 0 1px 1px
              rgba(190, 220, 248, 0.11),

            inset 0 -1px 1px
              rgba(0, 0, 0, 0.40);

          transform:
            perspective(1100px)
            rotateX(var(--rx))
            rotateY(var(--ry));

          transition:
            transform 180ms ease-out,
            box-shadow 350ms ease,
            border-color 350ms ease;

          isolation: isolate;
        }

        .glass-card::before {
          content: "";

          position: absolute;

          inset: 0;

          border-radius: inherit;

          pointer-events: none;

          background:
            radial-gradient(
              280px circle
              at var(--mx) var(--my),
              rgba(61, 126, 193, 0.13),
              rgba(23, 65, 108, 0.035) 43%,
              transparent 72%
            );

          opacity: 0.9;
        }

        .glass-card::after {
          content: "";

          position: absolute;

          inset: 0;

          border-radius: inherit;

          pointer-events: none;

          background:
            linear-gradient(
              135deg,
              rgba(188, 219, 244, 0.14),
              transparent 15%,
              transparent 80%,
              rgba(67, 113, 163, 0.06)
            );

          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);

          mask-composite: exclude;

          padding: 1px;
        }

        .glass-card:hover {
          border-color:
            rgba(150, 190, 226, 0.21);

          box-shadow:
            0 45px 110px
              rgba(0, 0, 0, 0.62),

            0 15px 45px
              rgba(0, 22, 55, 0.35),

            inset 0 1px 1px
              rgba(200, 228, 250, 0.14),

            inset 0 -1px 1px
              rgba(0, 0, 0, 0.40);
        }

        .top-light {
          position: absolute;

          top: 1px;
          left: 15%;

          width: 70%;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(205, 228, 248, 0.32),
              transparent
            );

          pointer-events: none;
        }

        /*
        =====================================================
        LOGO
        =====================================================
        */

        .logo {
          width: 64px;
          height: 64px;

          margin:
            0 auto 19px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              #225f9f,
              #124a8a 52%,
              #102e61
            );

          border:
            1px solid
            rgba(185, 216, 244, 0.17);

          color: #f3f8ff;

          font-size: 25px;

          font-weight: 700;

          box-shadow:
            0 14px 32px
              rgba(0, 39, 95, 0.34),

            inset 0 1px 1px
              rgba(255,255,255,0.18);

          transition:
            transform 300ms
              cubic-bezier(.2,.8,.2,1),

            box-shadow 300ms ease;
        }

        .glass-card:hover .logo {
          transform:
            translateY(-2px)
            scale(1.015);

          box-shadow:
            0 18px 38px
              rgba(0, 48, 115, 0.42),

            inset 0 1px 1px
              rgba(255,255,255,0.22);
        }

        /*
        =====================================================
        TEXT
        =====================================================
        */

        .title {
          margin: 0;

          text-align: center;

          color: #f3f7fc;

          font-size: 29px;

          line-height: 1.15;

          font-weight: 700;

          letter-spacing: -0.7px;
        }

        .subtitle {
          margin:
            9px 0 29px;

          text-align: center;

          color:
            rgba(184, 204, 225, 0.60);

          font-size: 14px;

          line-height: 1.5;
        }

        .label {
          display: block;

          margin-bottom: 8px;

          color:
            rgba(211, 226, 241, 0.76);

          font-size: 13px;

          font-weight: 600;
        }

        /*
        =====================================================
        INPUTS
        =====================================================
        */

        .input-wrap {
          position: relative;

          margin-bottom: 18px;
        }

        .input {
          width: 100%;

          height: 51px;

          padding: 0 15px;

          border-radius: 15px;

          outline: none;

          background:
            rgba(1, 9, 21, 0.67);

          border:
            1px solid
            rgba(142, 177, 211, 0.12);

          color: #f5f8fc;

          font-size: 14px;

          box-shadow:
            inset 0 1px 2px
              rgba(0,0,0,0.24),

            inset 0 0 0 1px
              rgba(255,255,255,0.012);

          transition:
            background 250ms ease,
            border-color 250ms ease,
            box-shadow 250ms ease,
            transform 250ms ease;
        }

        .input::placeholder {
          color:
            rgba(158, 183, 208, 0.38);
        }

        .input:hover {
          background:
            rgba(2, 13, 29, 0.76);

          border-color:
            rgba(150, 190, 225, 0.18);
        }

        .input:focus {
          transform:
            translateY(-1px);

          background:
            rgba(4, 19, 39, 0.80);

          border-color:
            rgba(73, 132, 195, 0.48);

          box-shadow:
            0 0 0 4px
              rgba(33, 100, 172, 0.10),

            0 8px 24px
              rgba(0, 30, 75, 0.18),

            inset 0 1px 2px
              rgba(150, 195, 235, 0.05);
        }

        /*
        =====================================================
        SHOW PASSWORD
        =====================================================
        */

        .show-button {
          position: absolute;

          right: 9px;

          top: 50%;

          transform:
            translateY(-50%);

          padding: 7px 10px;

          border-radius: 9px;

          border:
            1px solid
            rgba(145, 180, 215, 0.11);

          background:
            rgba(66, 101, 138, 0.10);

          color: #83acd4;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .show-button:hover {
          background:
            rgba(82, 127, 172, 0.17);

          transform:
            translateY(-50%)
            scale(1.03);
        }

        .show-button:active {
          transform:
            translateY(-50%)
            scale(0.94);
        }

        /*
        =====================================================
        ERROR
        =====================================================
        */

        .error {
          margin-bottom: 17px;

          padding: 11px 13px;

          border-radius: 13px;

          background:
            rgba(92, 22, 32, 0.25);

          border:
            1px solid
            rgba(215, 100, 112, 0.17);

          color: #efb5bb;

          font-size: 13px;

          backdrop-filter:
            blur(16px);

          -webkit-backdrop-filter:
            blur(16px);

          animation:
            errorIn 280ms
            cubic-bezier(.2,.8,.2,1);
        }

        @keyframes errorIn {
          from {
            opacity: 0;

            transform:
              translateY(-5px)
              scale(0.98);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        /*
        =====================================================
        OPTIONS
        =====================================================
        */

        .options {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-top: 2px;

          margin-bottom: 24px;
        }

        .remember {
          display: flex;

          align-items: center;

          gap: 8px;

          color:
            rgba(185, 204, 224, 0.59);

          font-size: 13px;

          cursor: pointer;
        }

        .remember input {
          width: 15px;
          height: 15px;

          margin: 0;

          accent-color: #3d82c4;

          cursor: pointer;
        }

        .forgot {
          padding: 4px;

          border: none;

          background: transparent;

          color: #78a9d8;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .forgot:hover {
          color: #afd0ef;

          transform:
            translateY(-1px);
        }

        /*
        =====================================================
        LOGIN BUTTON
        =====================================================
        */

        .login-button {
          width: 100%;

          height: 52px;

          position: relative;

          overflow: hidden;

          border-radius: 15px;

          border:
            1px solid
            rgba(178, 213, 245, 0.17);

          background:
            linear-gradient(
              135deg,
              #286ba9,
              #185794 48%,
              #203f82
            );

          color: #ffffff;

          font-size: 15px;

          font-weight: 650;

          cursor: pointer;

          box-shadow:
            0 12px 28px
              rgba(0, 48, 110, 0.30),

            inset 0 1px 1px
              rgba(255,255,255,0.18);

          transition:
            transform 180ms
              cubic-bezier(.2,.8,.2,1),

            box-shadow 250ms ease,

            filter 250ms ease;
        }

        .login-button::before {
          content: "";

          position: absolute;

          top: -30%;

          left: -80%;

          width: 45%;

          height: 160%;

          transform:
            skewX(-20deg);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(215, 237, 255, 0.17),
              transparent
            );

          transition:
            left 600ms ease;
        }

        .login-button:hover::before {
          left: 140%;
        }

        .login-button:hover {
          transform:
            translateY(-1px);

          filter:
            brightness(1.06);

          box-shadow:
            0 16px 34px
              rgba(0, 48, 115, 0.36),

            inset 0 1px 1px
              rgba(255,255,255,0.21);
        }

        .login-button:active {
          transform:
            translateY(1px)
            scale(0.985);

          box-shadow:
            0 7px 15px
              rgba(0, 40, 90, 0.24),

            inset 0 2px 3px
              rgba(0,0,0,0.16);
        }

        .login-button:disabled {
          cursor: not-allowed;

          opacity: 0.72;

          transform: none;
        }

        /*
        =====================================================
        LIQUID LOADING
        =====================================================
        */

        .login-button.loading::after {
          content: "";

          position: absolute;

          width: 180%;

          height: 240%;

          left: -40%;

          top: -70%;

          border-radius: 48%;

          background:
            rgba(180, 220, 255, 0.08);

          animation:
            liquid 1.5s
            ease-in-out
            infinite;
        }

        @keyframes liquid {
          0% {
            transform:
              translateX(-25%)
              rotate(0deg);
          }

          50% {
            transform:
              translateX(25%)
              rotate(180deg);
          }

          100% {
            transform:
              translateX(-25%)
              rotate(360deg);
          }
        }

        /*
        =====================================================
        DIVIDER
        =====================================================
        */

        .divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin:
            25px 0 20px;
        }

        .divider-line {
          flex: 1;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(145, 178, 208, 0.13),
              transparent
            );
        }

        .divider-text {
          color:
            rgba(162, 185, 209, 0.38);

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 1.2px;
        }

        /*
        =====================================================
        REGISTER
        =====================================================
        */

        .register {
          text-align: center;

          color:
            rgba(184, 203, 223, 0.55);

          font-size: 13px;
        }

        .register-button {
          padding: 0;

          border: none;

          background: transparent;

          color: #78a9d8;

          font-size: 13px;

          font-weight: 650;

          cursor: pointer;

          transition:
            color 180ms ease,
            text-shadow 180ms ease;
        }

        .register-button:hover {
          color: #b1d1ee;

          text-shadow:
            0 0 12px
            rgba(73, 132, 195, 0.28);
        }

        /*
        =====================================================
        SCROLL SPACE
        =====================================================
        */

        .scroll-space {
          height: 25vh;

          display: flex;

          justify-content: center;

          align-items: flex-start;

          position: relative;

          z-index: 3;
        }

        .scroll-hint {
          color:
            rgba(120, 153, 185, 0.25);

          font-size: 10px;

          letter-spacing: 1.4px;

          text-transform: uppercase;
        }

        /*
        =====================================================
        MOBILE
        =====================================================
        */

        @media (max-width: 520px) {
          .ios-header {
            width:
              calc(100% - 22px);

            top: 9px;

            height: 56px;

            border-radius: 19px;

            padding:
              0 14px;
          }

          .ios-header.scrolled {
            top: 7px;

            height: 53px;
          }

          .header-status {
            display: none;
          }

          .login-zone {
            padding:
              92px 15px 80px;
          }

          .glass-card {
            padding:
              30px 23px;

            border-radius: 27px;
          }

          .title {
            font-size: 27px;
          }
        }

        /*
        =====================================================
        REDUCED MOTION
        =====================================================
        */

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .ambient,
          .glass-card,
          .logo,
          .input,
          .login-button,
          .error,
          .ios-header {
            animation: none !important;

            transition: none !important;
          }
        }
      `}</style>

      <main className="ios-page">

        {/* Floating Liquid Glass Header */}

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

            Secure login
          </div>
        </header>

        {/* Ambient background */}

        <div className="ambient ambient-one" />

        <div className="ambient ambient-two" />

        <div className="ambient ambient-three" />

        {/* Login */}

        <section className="login-zone">
          <form
            ref={cardRef}
            onSubmit={handleLogin}
            className="glass-card"
          >
            <div className="top-light" />

            <div className="logo">
              S
            </div>

            <h1 className="title">
              Welcome Back
            </h1>

            <p className="subtitle">
              Sign in to continue to your account
            </p>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

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
                placeholder="Enter your password"
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
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            <div className="options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                Remember me
              </label>

              <button
                type="button"
                className="forgot"
                onClick={() =>
                  alert(
                    "Enter your email and we will send a reset link."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`login-button ${
                loading
                  ? "loading"
                  : ""
              }`}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            <div className="divider">
              <div className="divider-line" />

              <span className="divider-text">
                OR
              </span>

              <div className="divider-line" />
            </div>

            <div className="register">
              Don't have an account?{" "}

              <button
                type="button"
                className="register-button"
                onClick={() =>
                  alert(
                    "Registration page coming soon."
                  )
                }
              >
                Create account
              </button>
            </div>
          </form>
        </section>

        <div className="scroll-space">
          <span className="scroll-hint">
           
          </span>
        </div>

      </main>
    </>
  );
}

