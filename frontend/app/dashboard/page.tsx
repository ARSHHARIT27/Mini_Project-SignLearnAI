"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type IconName =
  | "grid"
  | "book"
  | "camera"
  | "brain"
  | "chart"
  | "trophy"
  | "settings"
  | "search"
  | "bell"
  | "chevron"
  | "play"
  | "pause"
  | "stop"
  | "maximize"
  | "mirror"
  | "refresh"
  | "target"
  | "clock"
  | "check"
  | "lock"
  | "arrow"
  | "flame"
  | "spark"
  | "users"
  | "help"
  | "logout"
  | "close"
  | "menu"
  | "cameraOff"
  | "volume"
  | "bookmark"
  | "more"
  | "activity"
  | "shield"
  | "zap"
  | "hand"
  | "playCircle";

/* =========================================================
   INLINE ICON SYSTEM
   No external icon package required.
========================================================= */

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
      );

    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
          <path d="M4 5.5V20" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
        </svg>
      );

    case "camera":
      return (
        <svg {...common}>
          <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );

    case "cameraOff":
      return (
        <svg {...common}>
          <path d="m3 3 18 18" />
          <path d="M9 7H7a2 2 0 0 0-2 2v8" />
          <path d="M17 7h1a2 2 0 0 1 2 2v7" />
          <path d="m9 5 1.5-2h3L15 5" />
          <path d="M8 19h9" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      );

    case "brain":
      return (
        <svg {...common}>
          <path d="M9.5 4.5A3 3 0 0 0 6 7.3 3.2 3.2 0 0 0 4 10a3.3 3.3 0 0 0 2 3.05A3.2 3.2 0 0 0 9 18a3 3 0 0 0 3-3V7a3 3 0 0 0-2.5-2.5Z" />
          <path d="M14.5 4.5A3 3 0 0 1 18 7.3 3.2 3.2 0 0 1 20 10a3.3 3.3 0 0 1-2 3.05A3.2 3.2 0 0 1 15 18a3 3 0 0 1-3-3V7a3 3 0 0 1 2.5-2.5Z" />
          <path d="M8 9h1M15 9h1M8 13h1M15 13h1" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h17" />
          <path d="m7 15 4-4 3 2 5-7" />
        </svg>
      );

    case "trophy":
      return (
        <svg {...common}>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
          <path d="M12 13v4M8 21h8M9 17h6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20h-2.4v-.21a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15 1.7 1.7 0 0 0 6.91 14H6.7v-2.4h.21A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V5h2.4v.21A1.7 1.7 0 0 0 16.16 6.76a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1.03H21v2.4h-.21A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "play":
      return (
        <svg {...common}>
          <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />
        </svg>
      );

    case "stop":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      );

    case "maximize":
      return (
        <svg {...common}>
          <path d="M8 3H3v5M3 3l6 6M16 3h5v5M21 3l-6 6M8 21H3v-5M3 21l6-6M16 21h5v-5M21 21l-6-6" />
        </svg>
      );

    case "mirror":
      return (
        <svg {...common}>
          <path d="M12 4v16M8 7 4 9v6l4 2V7Zm8 0 4 2v6l-4 2V7Z" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.8-4L3 9M3 4v5h5M4 13a8 8 0 0 0 14.8 4L21 15M21 20v-5h-5" />
        </svg>
      );

    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "flame":
      return (
        <svg {...common}>
          <path d="M12 22c4 0 7-2.7 7-7 0-3.2-2-5.4-4.4-7.8.1 2.2-1.1 3.5-2.4 4.3.1-3.7-1.8-6.6-4.2-8.5.1 4.5-4 6.7-4 11.4C4 18.8 7.2 22 12 22Z" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z" />
          <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
        </svg>
      );

    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.7 9a2.4 2.4 0 1 1 3.9 1.9c-1.1.8-1.6 1.2-1.6 2.6M12 17h.01" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );

    case "volume":
      return (
        <svg {...common}>
          <path d="M5 10v4h3l4 3V7l-4 3H5Z" />
          <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
        </svg>
      );

    case "bookmark":
      return (
        <svg {...common}>
          <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4V4Z" />
        </svg>
      );

    case "more":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="19" cy="12" r="1" fill="currentColor" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v6c0 5-3.2 8-8 9-4.8-1-8-4-8-9V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "zap":
      return (
        <svg {...common}>
          <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </svg>
      );

    case "hand":
      return (
        <svg {...common}>
          <path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 9V3.8a1.5 1.5 0 0 1 3 0V10M13 9V5a1.5 1.5 0 0 1 3 0v6M16 11V8a1.5 1.5 0 0 1 3 0v7c0 4-2.5 6-6 6h-1c-3 0-5.5-1.5-7-4l-2-4a1.6 1.6 0 0 1 2.8-1.5L7 14V11" />
        </svg>
      );

    case "playCircle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 5 4-5 4V8Z" fill="currentColor" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c.5-3.2 2.5-5 6-5s5.5 1.8 6 5M16 5.5a3 3 0 0 1 0 5.8M17 15c2.2.3 3.5 1.9 4 4" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   DATA
========================================================= */

const lessons = [
  {
    title: "ASL Alphabet",
    description: "Master the 26 fundamental handshapes.",
    progress: 72,
    level: "Beginner",
    duration: "18 min",
    icon: "A",
  },
  {
    title: "Everyday Greetings",
    description: "Learn signs for common conversations.",
    progress: 44,
    level: "Beginner",
    duration: "24 min",
    icon: "Hi",
  },
  {
    title: "Numbers & Counting",
    description: "Practice numbers from 1 to 100.",
    progress: 28,
    level: "Beginner",
    duration: "16 min",
    icon: "01",
  },
  {
    title: "Family & People",
    description: "Build your everyday vocabulary.",
    progress: 12,
    level: "Intermediate",
    duration: "31 min",
    icon: "FM",
  },
];

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

const activities = [
  {
    title: "Alphabet practice",
    meta: "12 signs completed",
    time: "Today",
    icon: "hand" as IconName,
  },
  {
    title: "Greetings lesson",
    meta: "7 / 16 signs",
    time: "Yesterday",
    icon: "book" as IconName,
  },
  {
    title: "Quick quiz",
    meta: "8 / 10 correct",
    time: "Yesterday",
    icon: "brain" as IconName,
  },
];

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const cvLoadedRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [mirror, setMirror] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [opencvStatus, setOpencvStatus] =
    useState("Loading vision engine");
  const [visionFPS, setVisionFPS] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [targetSign, setTargetSign] = useState("A");
  const [practiceScore, setPracticeScore] = useState(0);
  const [detected, setDetected] = useState(false);

  /* =========================================================
     LOAD OPENCV
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).cv) {
      cvLoadedRef.current = true;
      setOpencvStatus("OpenCV ready");
      return;
    }

    const existing = document.querySelector(
      'script[data-opencv="true"]'
    );

    if (existing) return;

    const script = document.createElement("script");

    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.dataset.opencv = "true";

    script.onload = () => {
      const waitForCV = () => {
        if ((window as any).cv) {
          cvLoadedRef.current = true;
          setOpencvStatus("OpenCV ready");
        } else {
          window.setTimeout(waitForCV, 250);
        }
      };

      waitForCV();
    };

    script.onerror = () => {
      setOpencvStatus("Vision engine unavailable");
    };

    document.body.appendChild(script);
  }, []);

  /* =========================================================
     CAMERA PROCESSING
  ========================================================= */

  const processCameraFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = processingCanvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animationRef.current =
        requestAnimationFrame(processCameraFrame);

      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = 640;
    const height = 480;

    canvas.width = width;
    canvas.height = height;

    ctx.save();

    if (mirror) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    ctx.restore();

    if (cvLoadedRef.current && (window as any).cv) {
      try {
        const cv = (window as any).cv;

        const src = cv.imread(canvas);
        const gray = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        const mean = cv.mean(gray);

        if (mean && mean[0] > 0) {
          setVisionFPS((previous) =>
            previous >= 30 ? 30 : previous + 1
          );
        }

        src.delete();
        gray.delete();
      } catch {
        /* Keep camera running if CV processing fails. */
      }
    }

    animationRef.current =
      requestAnimationFrame(processCameraFrame);
  }, [mirror]);

  /* =========================================================
     START CAMERA
  ========================================================= */

  const startCamera = async () => {
    setCameraError("");

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        "Your browser does not support webcam access."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setSessionSeconds(0);
      setVisionFPS(0);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current =
        requestAnimationFrame(processCameraFrame);
    } catch (error) {
      console.error(error);

      setCameraError(
        "Camera access was blocked. Please allow camera permission in your browser."
      );
    }
  };

  /* =========================================================
     STOP CAMERA
  ========================================================= */

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setDetected(false);
    setVisionFPS(0);
  };

  /* =========================================================
     SESSION TIMER
  ========================================================= */

  useEffect(() => {
    if (!cameraActive) return;

    const interval = window.setInterval(() => {
      setSessionSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [cameraActive]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  /* =========================================================
     FULLSCREEN
  ========================================================= */

  const toggleFullscreen = async () => {
    const element =
      document.getElementById("camera-stage");

    if (!element) return;

    if (!document.fullscreenElement) {
      await element.requestFullscreen?.();
      setFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remaining = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remaining}`;
  };

  const scrollToPractice = () => {
    document
      .getElementById("practice")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const changeSign = () => {
    const currentIndex =
      alphabet.indexOf(targetSign);

    const next =
      alphabet[
        (currentIndex + 1) %
          alphabet.length
      ];

    setTargetSign(next);
    setDetected(false);
    setPracticeScore(0);
  };

  const handlePractice = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }

    setDetected(true);

    setPracticeScore((score) =>
      Math.min(score + 8, 100)
    );
  };

  const navigation = [
    {
      label: "Dashboard",
      icon: "grid" as IconName,
    },
    {
      label: "Learn",
      icon: "book" as IconName,
    },
    {
      label: "Practice",
      icon: "camera" as IconName,
    },
    {
      label: "Quiz",
      icon: "brain" as IconName,
    },
    {
      label: "Progress",
      icon: "chart" as IconName,
    },
  ];

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          color: #202617;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(219, 237, 135, 0.65),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 15%,
              rgba(195, 220, 111, 0.42),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #f3f7e3 0%,
              #e8efc5 45%,
              #f5f8e9 100%
            );
        }

        button,
        input {
          font: inherit;
        }

        button {
          border: 0;
        }

        .dashboard-page {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow-x: hidden;
        }

        /* =====================================================
           AMBIENT
        ===================================================== */

        .ambient {
          position: fixed;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(60px);
          z-index: 0;
        }

        .ambient-one {
          width: 330px;
          height: 330px;
          top: -100px;
          left: 20%;
          background: rgba(213, 235, 119, 0.3);
        }

        .ambient-two {
          width: 280px;
          height: 280px;
          right: 8%;
          top: 35%;
          background: rgba(189, 220, 100, 0.22);
        }

        .ambient-three {
          width: 300px;
          height: 300px;
          bottom: -100px;
          left: 15%;
          background: rgba(224, 239, 165, 0.55);
        }

        .ambient-four {
          width: 220px;
          height: 220px;
          right: 25%;
          bottom: 8%;
          background: rgba(201, 224, 117, 0.18);
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          position: fixed;
          z-index: 50;
          top: 18px;
          left: 18px;
          bottom: 18px;
          width: 248px;
          padding: 22px 14px;
          border: 1px solid rgba(255, 255, 255, 0.82);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.72),
              rgba(239, 246, 207, 0.48)
            );
          backdrop-filter: blur(32px) saturate(160%);
          -webkit-backdrop-filter: blur(32px) saturate(160%);
          box-shadow:
            0 25px 60px rgba(77, 91, 33, 0.11),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 3px 8px 22px;
        }

        .brand-logo {
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: linear-gradient(
            145deg,
            #dbe991,
            #b9cf67
          );
          color: #27310e;
          font-size: 17px;
          font-weight: 750;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 8px 20px rgba(108, 127, 44, 0.16);
        }

        .sidebar-brand strong {
          display: block;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .sidebar-brand span {
          display: block;
          margin-top: 3px;
          color: #727a61;
          font-size: 11px;
          font-weight: 500;
        }

        .profile-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.72);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.36);
          margin-bottom: 20px;
        }

        .profile-avatar,
        .top-avatar {
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #26300f;
          color: #edf6c4;
          font-weight: 700;
        }

        .profile-avatar {
          width: 35px;
          height: 35px;
          font-size: 13px;
        }

        .profile-info {
          min-width: 0;
          flex: 1;
        }

        .profile-info strong {
          display: block;
          font-size: 12px;
          font-weight: 650;
        }

        .profile-info span {
          display: block;
          margin-top: 2px;
          color: #7c826d;
          font-size: 11px;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
        }

        .nav-label {
          display: block;
          padding: 0 10px 8px;
          color: #899076;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .nav-label-gap {
          margin-top: 24px;
        }

        .nav-item {
          width: 100%;
          min-height: 42px;
          padding: 0 11px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 11px;
          border-radius: 13px;
          background: transparent;
          color: #667055;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
          font-weight: 550;
          transition:
            background 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #252d17;
          transform: translateX(2px);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.78);
          color: #26310e;
          font-weight: 650;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.6),
            0 5px 15px rgba(72, 87, 31, 0.06);
        }

        .nav-live {
          margin-left: auto;
          padding: 3px 6px;
          border-radius: 6px;
          background: #dbe991;
          color: #394512;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .sidebar-bottom {
          padding-top: 14px;
          border-top: 1px solid rgba(104, 117, 70, 0.12);
        }

        .privacy-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px;
          margin-bottom: 10px;
          border-radius: 14px;
          background: rgba(230, 240, 190, 0.5);
        }

        .privacy-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.68);
          color: #637528;
        }

        .privacy-card strong {
          display: block;
          font-size: 10px;
          font-weight: 700;
        }

        .privacy-card span {
          display: block;
          margin-top: 2px;
          color: #81896d;
          font-size: 9px;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main-area {
          width: calc(100% - 284px);
          margin-left: 284px;
          position: relative;
          z-index: 1;
        }

        .topbar {
          height: 72px;
          margin: 18px 24px 0;
          padding: 0 18px 0 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.48);
          backdrop-filter: blur(28px) saturate(150%);
          -webkit-backdrop-filter: blur(28px) saturate(150%);
          box-shadow:
            0 12px 35px rgba(77, 91, 33, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #8b927c;
          font-size: 12px;
          font-weight: 500;
        }

        .breadcrumb strong {
          color: #343d22;
          font-weight: 650;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .search-box {
          width: 235px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.43);
          color: #8c947b;
        }

        .search-box input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #30381f;
          font-size: 12px;
        }

        .search-box input::placeholder {
          color: #9ba18e;
        }

        .search-box kbd {
          padding: 2px 5px;
          border: 1px solid rgba(100, 111, 73, 0.12);
          border-radius: 5px;
          color: #969d89;
          font-size: 9px;
        }

        .icon-button {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.76);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.42);
          color: #65704d;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.72);
          color: #2d3719;
          transform: translateY(-1px);
        }

        .icon-button.small {
          width: 31px;
          height: 31px;
          border-radius: 9px;
        }

        .notification-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          margin: -20px 0 0 16px;
          border: 1px solid white;
          border-radius: 50%;
          background: #9ebc3c;
        }

        .top-avatar {
          width: 36px;
          height: 36px;
          font-size: 12px;
        }

        .mobile-menu-wrap {
          display: none;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 34px 24px 60px;
        }

        .hero-section {
          min-height: 190px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          padding: 12px 8px 34px;
        }

        .eyebrow,
        .section-kicker {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #84905d;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .eyebrow-dot,
        .live-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9ebd3e;
          box-shadow: 0 0 0 4px rgba(158, 189, 62, 0.12);
        }

        .hero-section h1 {
          margin: 13px 0 10px;
          color: #252d18;
          font-size: clamp(40px, 4vw, 54px);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 750;
        }

        .hero-section h1 span {
          color: #829d2e;
        }

        .hero-section p {
          max-width: 590px;
          margin: 0;
          color: #737b64;
          font-size: 15px;
          line-height: 1.65;
          font-weight: 450;
        }

        .hero-practice-button,
        .primary-action,
        .start-camera {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 650;
          transition: all 180ms ease;
        }

        .hero-practice-button {
          min-width: 160px;
          height: 46px;
          padding: 0 16px;
          background: #293512;
          color: #f5f9df;
          box-shadow: 0 10px 24px rgba(43, 54, 18, 0.17);
        }

        .hero-practice-button:hover,
        .primary-action:hover,
        .start-camera:hover {
          transform: translateY(-2px);
          box-shadow: 0 13px 28px rgba(43, 54, 18, 0.2);
        }

        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .stat-card {
          min-height: 118px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.65),
              rgba(242, 248, 216, 0.43)
            );
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 12px 32px rgba(79, 94, 35, 0.065),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .stat-icon {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex: 0 0 37px;
          border-radius: 11px;
          background: rgba(220, 235, 157, 0.65);
          color: #667c25;
        }

        .stat-content span {
          display: block;
          color: #858d73;
          font-size: 11px;
          font-weight: 550;
        }

        .stat-content strong {
          display: block;
          margin-top: 4px;
          color: #2d351e;
          font-size: 25px;
          line-height: 1.1;
          letter-spacing: -0.035em;
          font-weight: 720;
        }

        .stat-content small {
          display: block;
          margin-top: 5px;
          color: #969d88;
          font-size: 10px;
          font-weight: 500;
        }

        .stat-content small.positive {
          color: #78932d;
        }

        .stat-decoration {
          position: absolute;
          right: 14px;
          bottom: 8px;
          color: rgba(128, 153, 47, 0.08);
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -0.08em;
        }

        .mini-chart {
          position: absolute;
          right: 15px;
          bottom: 17px;
          height: 34px;
          display: flex;
          align-items: flex-end;
          gap: 4px;
        }

        .mini-chart span {
          width: 4px;
          border-radius: 10px;
          background: #b7cc6d;
        }

        .mini-chart span:nth-child(1) {
          height: 10px;
        }

        .mini-chart span:nth-child(2) {
          height: 15px;
        }

        .mini-chart span:nth-child(3) {
          height: 13px;
        }

        .mini-chart span:nth-child(4) {
          height: 21px;
        }

        .mini-chart span:nth-child(5) {
          height: 17px;
        }

        .mini-chart span:nth-child(6) {
          height: 28px;
        }

        .mini-chart span:nth-child(7) {
          height: 33px;
        }

        /* =====================================================
           GLASS PANELS
        ===================================================== */

        .glass-panel {
          border: 1px solid rgba(255, 255, 255, 0.8);
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.7),
              rgba(239, 247, 207, 0.42)
            );
          backdrop-filter: blur(28px) saturate(145%);
          -webkit-backdrop-filter: blur(28px) saturate(145%);
          box-shadow:
            0 16px 45px rgba(75, 91, 33, 0.075),
            inset 0 1px 0 rgba(255, 255, 255, 0.92);
        }

        /* =====================================================
           PRACTICE
        ===================================================== */

        .practice-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.75fr) minmax(280px, 0.75fr);
          gap: 16px;
          margin-top: 16px;
        }

        .camera-card {
          min-width: 0;
          padding: 21px;
          border-radius: 22px;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 16px;
        }

        .panel-heading h2,
        .section-header h2,
        .alphabet-header h2,
        .activity-card h2,
        .achievement-card h2 {
          margin: 6px 0 4px;
          color: #29321c;
          font-size: 20px;
          line-height: 1.2;
          letter-spacing: -0.025em;
          font-weight: 700;
        }

        .panel-heading p,
        .section-header p,
        .alphabet-header p {
          margin: 0;
          color: #858d75;
          font-size: 12px;
          line-height: 1.5;
        }

        .vision-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.42);
          color: #78815f;
          white-space: nowrap;
          font-size: 10px;
          font-weight: 550;
        }

        .vision-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c1c6b1;
        }

        .vision-status span.status-online {
          background: #86a92c;
          box-shadow: 0 0 0 4px rgba(134, 169, 44, 0.1);
        }

        .camera-stage {
          min-height: 470px;
          position: relative;
          overflow: hidden;
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(105, 128, 39, 0.15),
              transparent 36%
            ),
            #11150d;
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 18px 40px rgba(25, 31, 12, 0.15);
        }

        .camera-stage:fullscreen {
          width: 100vw;
          height: 100vh;
          border-radius: 0;
        }

        .camera-video {
          width: 100%;
          height: 100%;
          min-height: 470px;
          display: block;
          object-fit: cover;
        }

        .camera-video.mirrored {
          transform: scaleX(-1);
        }

        .processing-canvas {
          display: none;
        }

        .camera-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 30px;
          text-align: center;
          color: white;
          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(168, 195, 77, 0.13),
              transparent 30%
            );
        }

        .camera-orb {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(229, 241, 174, 0.18);
          border-radius: 21px;
          background: rgba(226, 239, 171, 0.09);
          color: #d9e8a5;
          box-shadow:
            0 0 45px rgba(162, 191, 75, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .camera-placeholder h3 {
          margin: 17px 0 7px;
          font-size: 20px;
          font-weight: 650;
          letter-spacing: -0.02em;
        }

        .camera-placeholder p {
          max-width: 330px;
          margin: 0 0 18px;
          color: rgba(232, 238, 211, 0.63);
          font-size: 12px;
          line-height: 1.6;
        }

        .start-camera {
          height: 42px;
          padding: 0 16px;
          background: #dceca1;
          color: #29340e;
        }

        .camera-error {
          max-width: 390px;
          margin-top: 14px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 150, 150, 0.18);
          border-radius: 9px;
          background: rgba(150, 38, 38, 0.18);
          color: #ffc4c4;
          font-size: 11px;
        }

        .camera-grid {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image:
            linear-gradient(
              rgba(225, 240, 171, 0.3) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(225, 240, 171, 0.3) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          pointer-events: none;
        }

        .camera-top-left,
        .camera-top-right {
          position: absolute;
          top: 16px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(12px);
          color: rgba(240, 246, 220, 0.8);
          font-size: 9px;
          font-weight: 650;
          letter-spacing: 0.08em;
        }

        .camera-top-left {
          left: 16px;
        }

        .camera-top-right {
          right: 16px;
        }

        .rec-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b9d957;
          box-shadow: 0 0 0 4px rgba(185, 217, 87, 0.12);
        }

        .camera-frame-corners {
          position: absolute;
          inset: 15%;
          pointer-events: none;
        }

        .corner {
          position: absolute;
          width: 25px;
          height: 25px;
          border-color: rgba(222, 239, 165, 0.65);
          border-style: solid;
        }

        .corner.tl {
          top: 0;
          left: 0;
          border-width: 2px 0 0 2px;
        }

        .corner.tr {
          top: 0;
          right: 0;
          border-width: 2px 2px 0 0;
        }

        .corner.bl {
          bottom: 0;
          left: 0;
          border-width: 0 0 2px 2px;
        }

        .corner.br {
          right: 0;
          bottom: 0;
          border-width: 0 2px 2px 0;
        }

        .hand-guide {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          color: rgba(233, 241, 209, 0.68);
          pointer-events: none;
        }

        .guide-circle {
          width: 82px;
          height: 82px;
          display: grid;
          place-items: center;
          border: 1px dashed rgba(218, 235, 161, 0.4);
          border-radius: 50%;
          color: rgba(218, 235, 161, 0.7);
        }

        .hand-guide span {
          padding: 5px 8px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.3);
          font-size: 9px;
        }

        .detection-badge {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border: 1px solid rgba(203, 229, 117, 0.2);
          border-radius: 9px;
          background: rgba(103, 130, 33, 0.68);
          backdrop-filter: blur(10px);
          color: #f2f8d6;
          font-size: 10px;
          font-weight: 600;
        }

        .camera-toolbar {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 12px;
        }

        .camera-controls {
          display: flex;
          gap: 5px;
        }

        .camera-control {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 9px;
          border-radius: 8px;
          background: transparent;
          color: #727b60;
          cursor: pointer;
          font-size: 10px;
          font-weight: 550;
        }

        .camera-control:hover {
          background: rgba(255, 255, 255, 0.48);
          color: #30391f;
        }

        .small-start {
          height: 36px;
          min-width: 78px;
          padding: 0 12px;
        }

        .stop-camera {
          height: 36px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 12px;
          border-radius: 9px;
          background: rgba(118, 48, 48, 0.08);
          color: #9a5555;
          cursor: pointer;
          font-size: 10px;
          font-weight: 600;
        }

        /* =====================================================
           SIDE PRACTICE
        ===================================================== */

        .practice-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .target-card,
        .accuracy-card {
          border-radius: 20px;
          padding: 20px;
        }

        .target-card {
          flex: 1;
        }

        .target-header,
        .accuracy-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .target-header span,
        .accuracy-top span {
          display: block;
          color: #91997e;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 0.12em;
        }

        .target-header strong {
          display: block;
          margin-top: 5px;
          color: #38421f;
          font-size: 14px;
          font-weight: 650;
        }

        .target-sign {
          height: 170px;
          position: relative;
          display: grid;
          place-items: center;
          margin: 18px 0 13px;
          overflow: hidden;
          border-radius: 16px;
          background:
            radial-gradient(
              circle,
              rgba(213, 230, 148, 0.65),
              rgba(237, 244, 211, 0.3)
            );
        }

        .target-letter {
          position: relative;
          z-index: 2;
          color: #647827;
          font-size: 76px;
          line-height: 1;
          font-weight: 750;
          letter-spacing: -0.06em;
        }

        .target-ring {
          position: absolute;
          width: 125px;
          height: 125px;
          border: 1px solid rgba(130, 154, 56, 0.18);
          border-radius: 50%;
        }

        .target-card h3 {
          margin: 0 0 6px;
          color: #30391f;
          font-size: 16px;
          font-weight: 680;
        }

        .target-card > p {
          margin: 0;
          color: #818a70;
          font-size: 11px;
          line-height: 1.6;
        }

        .target-tip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 15px 0;
          padding: 10px;
          border-radius: 11px;
          background: rgba(220, 235, 169, 0.38);
        }

        .target-tip > div {
          color: #79922e;
        }

        .target-tip span {
          color: #78805f;
          font-size: 10px;
          line-height: 1.5;
        }

        .primary-action {
          width: 100%;
          height: 42px;
          background: #293512;
          color: #f4f8df;
        }

        .accuracy-card {
          min-height: 132px;
        }

        .accuracy-top strong {
          display: block;
          margin-top: 4px;
          color: #30391f;
          font-size: 28px;
          line-height: 1;
          font-weight: 720;
          letter-spacing: -0.04em;
        }

        .accuracy-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(220, 235, 157, 0.55);
          color: #70872a;
        }

        .progress-track,
        .goal-track,
        .achievement-progress .progress-track {
          height: 6px;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(125, 140, 86, 0.12);
        }

        .progress-value {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #9dbd3c,
            #c3d875
          );
        }

        .accuracy-card .progress-track {
          margin: 17px 0 10px;
        }

        .accuracy-bottom {
          display: flex;
          justify-content: space-between;
          color: #8a9278;
          font-size: 9px;
        }

        .accuracy-bottom strong {
          color: #65782c;
          font-weight: 650;
        }

        /* =====================================================
           GOAL
        ===================================================== */

        .goal-card {
          min-height: 112px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 16px;
          padding: 19px;
          border-radius: 18px;
        }

        .goal-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          flex: 0 0 46px;
          border-radius: 13px;
          background: rgba(216, 232, 151, 0.62);
          color: #6d8528;
        }

        .goal-main {
          flex: 1;
          min-width: 0;
        }

        .goal-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .goal-title span {
          color: #90977e;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 0.1em;
        }

        .goal-title h3 {
          margin: 4px 0 0;
          color: #30391f;
          font-size: 15px;
          font-weight: 650;
        }

        .goal-title > strong {
          color: #71862e;
          font-size: 15px;
          font-weight: 700;
        }

        .goal-track {
          margin: 9px 0 7px;
        }

        .goal-track div {
          height: 100%;
          border-radius: inherit;
          background: #a9c74e;
        }

        .goal-main p {
          margin: 0;
          color: #8a927b;
          font-size: 10px;
        }

        .secondary-action {
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.44);
          color: #65733f;
          cursor: pointer;
          font-size: 10px;
          font-weight: 600;
        }

        .secondary-action:hover {
          background: rgba(255, 255, 255, 0.72);
        }

        /* =====================================================
           SECTIONS
        ===================================================== */

        .learning-section {
          margin-top: 42px;
        }

        .section-header,
        .alphabet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 16px;
        }

        .section-header h2,
        .alphabet-header h2 {
          font-size: 24px;
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          color: #70812f;
          cursor: pointer;
          font-size: 11px;
          font-weight: 650;
        }

        .lesson-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .lesson-card {
          min-width: 0;
          padding: 17px;
          border-radius: 17px;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .lesson-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 20px 45px rgba(75, 91, 33, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.92);
        }

        .lesson-top {
          display: flex;
          justify-content: space-between;
        }

        .lesson-symbol {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(215, 232, 149, 0.58);
          color: #657a29;
          font-size: 14px;
          font-weight: 750;
        }

        .lesson-meta {
          display: flex;
          gap: 7px;
          margin-top: 15px;
        }

        .lesson-meta span {
          padding: 4px 6px;
          border-radius: 6px;
          background: rgba(219, 230, 184, 0.42);
          color: #87906f;
          font-size: 8px;
          font-weight: 600;
        }

        .lesson-card h3 {
          margin: 10px 0 5px;
          color: #30391f;
          font-size: 14px;
          line-height: 1.3;
          font-weight: 680;
        }

        .lesson-card p {
          min-height: 34px;
          margin: 0;
          color: #89917a;
          font-size: 10px;
          line-height: 1.55;
        }

        .lesson-progress {
          margin-top: 14px;
        }

        .lesson-progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          color: #919a7e;
          font-size: 9px;
        }

        .lesson-progress-label strong {
          color: #74882e;
          font-weight: 650;
        }

        .lesson-button {
          width: 100%;
          height: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.55);
          color: #5f6e37;
          cursor: pointer;
          font-size: 10px;
          font-weight: 620;
        }

        .lesson-button:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        /* =====================================================
           ALPHABET
        ===================================================== */

        .alphabet-section {
          margin-top: 16px;
          padding: 21px;
          border-radius: 20px;
        }

        .alphabet-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 7px;
        }

        .letter-card {
          min-width: 0;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          border: 1px solid rgba(255, 255, 255, 0.65);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.4);
          color: #67734a;
          cursor: pointer;
          transition: all 160ms ease;
        }

        .letter-card span {
          font-size: 17px;
          line-height: 1;
          font-weight: 700;
        }

        .letter-card small {
          color: #a0a78e;
          font-size: 7px;
        }

        .letter-card:hover,
        .letter-card.selected {
          border-color: rgba(167, 193, 77, 0.5);
          background: rgba(218, 234, 156, 0.7);
          color: #52661e;
          transform: translateY(-2px);
        }

        /* =====================================================
           LOWER GRID
        ===================================================== */

        .lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .activity-card,
        .achievement-card {
          min-height: 250px;
          padding: 21px;
          border-radius: 20px;
        }

        .section-header.compact {
          align-items: center;
        }

        .activity-list {
          margin-top: 14px;
        }

        .activity-row {
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 11px;
          border-bottom: 1px solid rgba(105, 119, 71, 0.08);
        }

        .activity-row:last-child {
          border-bottom: 0;
        }

        .activity-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(218, 233, 160, 0.52);
          color: #6d822a;
        }

        .activity-copy {
          flex: 1;
        }

        .activity-copy strong {
          display: block;
          color: #39421f;
          font-size: 11px;
          font-weight: 650;
        }

        .activity-copy span {
          display: block;
          margin-top: 3px;
          color: #949b86;
          font-size: 9px;
        }

        .activity-row time {
          color: #a0a68f;
          font-size: 9px;
        }

        .achievement-card {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(190, 216, 104, 0.3),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.7),
              rgba(232, 242, 193, 0.45)
            );
        }

        .achievement-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          border-radius: 14px;
          background: #293512;
          color: #dceba3;
        }

        .achievement-card h2 {
          margin-top: 7px;
          font-size: 21px;
        }

        .achievement-card p {
          max-width: 380px;
          margin: 7px 0 20px;
          color: #858e74;
          font-size: 11px;
          line-height: 1.6;
        }

        .achievement-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          color: #828b6e;
          font-size: 10px;
        }

        .achievement-label strong {
          color: #70852a;
        }

        .achievement-card .secondary-action {
          margin-top: 18px;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .dashboard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 35px;
          padding: 18px 4px;
          border-top: 1px solid rgba(105, 118, 73, 0.1);
          color: #929a82;
          font-size: 9px;
        }

        .footer-brand {
          color: #6e7b4e;
          font-weight: 650;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 1180px) {
          .sidebar {
            width: 220px;
          }

          .main-area {
            width: calc(100% - 248px);
            margin-left: 248px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .lesson-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .alphabet-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            transform: translateX(-115%);
            transition: transform 220ms ease;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 40;
            border: 0;
            background: rgba(29, 34, 16, 0.18);
            backdrop-filter: blur(3px);
          }

          .main-area {
            width: 100%;
            margin-left: 0;
          }

          .mobile-menu-wrap {
            display: block;
          }

          .topbar {
            gap: 10px;
          }

          .breadcrumb {
            flex: 1;
          }

          .search-box {
            display: none;
          }

          .practice-layout {
            grid-template-columns: 1fr;
          }

          .practice-side {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .hero-section {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .topbar {
            margin: 10px 10px 0;
            height: 62px;
            padding: 0 11px;
            border-radius: 16px;
          }

          .top-avatar {
            width: 32px;
            height: 32px;
          }

          .content {
            padding: 24px 12px 40px;
          }

          .hero-section {
            padding: 10px 4px 25px;
          }

          .hero-section h1 {
            font-size: 38px;
          }

          .hero-section p {
            font-size: 13px;
          }

          .hero-practice-button {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat-card {
            min-height: 105px;
            padding: 14px;
          }

          .stat-icon {
            width: 31px;
            height: 31px;
            flex-basis: 31px;
          }

          .stat-content strong {
            font-size: 20px;
          }

          .stat-content span {
            font-size: 9px;
          }

          .stat-content small {
            font-size: 8px;
          }

          .camera-card {
            padding: 13px;
          }

          .camera-stage {
            min-height: 360px;
          }

          .camera-video {
            min-height: 360px;
          }

          .panel-heading {
            flex-direction: column;
          }

          .vision-status {
            align-self: flex-start;
          }

          .camera-controls {
            flex-wrap: wrap;
          }

          .camera-control span {
            display: none;
          }

          .practice-side {
            grid-template-columns: 1fr;
          }

          .goal-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .goal-main {
            min-width: calc(100% - 65px);
          }

          .goal-card .secondary-action {
            width: 100%;
          }

          .lesson-grid {
            grid-template-columns: 1fr;
          }

          .alphabet-header,
          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .alphabet-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .lower-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <main className="dashboard-page">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />
        <div className="ambient ambient-four" />

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`sidebar ${
            mobileMenu ? "sidebar-open" : ""
          }`}
        >
          <div className="sidebar-brand">
            <div className="brand-logo">S</div>

            <div>
              <strong>SignLearnAI</strong>
              <span>AI learning studio</span>
            </div>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">A</div>

            <div className="profile-info">
              <strong>Welcome back</strong>
              <span>Keep learning today</span>
            </div>

            <button
              className="icon-button small"
              aria-label="More options"
            >
              <Icon name="more" size={17} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <span className="nav-label">
              Workspace
            </span>

            {navigation.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${
                  activeNav === item.label
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActiveNav(item.label);

                  if (item.label === "Practice") {
                    scrollToPractice();
                  }

                  setMobileMenu(false);
                }}
              >
                <Icon
                  name={item.icon}
                  size={18}
                />

                <span>{item.label}</span>

                {item.label === "Practice" && (
                  <span className="nav-live">
                    LIVE
                  </span>
                )}
              </button>
            ))}

            <span className="nav-label nav-label-gap">
              Your learning
            </span>

            <button className="nav-item">
              <Icon name="trophy" size={18} />
              <span>Achievements</span>
            </button>

            <button className="nav-item">
              <Icon name="bookmark" size={18} />
              <span>Saved signs</span>
            </button>

            <button className="nav-item">
              <Icon name="activity" size={18} />
              <span>Activity</span>
            </button>
          </nav>

          <div className="sidebar-bottom">
            <div className="privacy-card">
              <div className="privacy-icon">
                <Icon name="shield" size={17} />
              </div>

              <div>
                <strong>Camera privacy</strong>
                <span>
                  Video stays on your device
                </span>
              </div>
            </div>

            <button className="nav-item">
              <Icon name="settings" size={18} />
              <span>Settings</span>
            </button>

            <button
              className="nav-item"
              onClick={() => {
                stopCamera();
                window.location.href = "/login";
              }}
            >
              <Icon name="logout" size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {mobileMenu && (
          <button
            className="mobile-overlay"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
          />
        )}

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        <section className="main-area">
          <header className="topbar">
            <div className="mobile-menu-wrap">
              <button
                className="icon-button mobile-menu"
                onClick={() =>
                  setMobileMenu(!mobileMenu)
                }
                aria-label="Open menu"
              >
                <Icon name="menu" size={20} />
              </button>
            </div>

            <div className="breadcrumb">
              <span>Workspace</span>

              <Icon name="chevron" size={13} />

              <strong>Dashboard</strong>
            </div>

            <div className="topbar-actions">
              <div className="search-box">
                <Icon name="search" size={16} />

                <input
                  placeholder="Search signs, lessons..."
                  aria-label="Search"
                />

                <kbd>/</kbd>
              </div>

              <button
                className="icon-button"
                aria-label="Notifications"
              >
                <Icon name="bell" size={18} />
                <span className="notification-dot" />
              </button>

              <div className="top-avatar">A</div>
            </div>
          </header>

          <div className="content">
            {/* =================================================
                HERO
            ================================================= */}

            <section className="hero-section">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  YOUR LEARNING SPACE
                </div>

                <h1>
                  Learn.
                  <span> Practice.</span>
                  <br />
                  Sign.
                </h1>

                <p>
                  Build real sign-language confidence
                  with guided lessons and AI-powered
                  camera practice.
                </p>
              </div>

              <button
                className="hero-practice-button"
                onClick={scrollToPractice}
              >
                <Icon name="camera" size={17} />
                Start practice
                <Icon name="arrow" size={16} />
              </button>
            </section>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="flame" size={19} />
                </div>

                <div className="stat-content">
                  <span>Current streak</span>
                  <strong>7 days</strong>
                  <small>Keep it going</small>
                </div>

                <div className="stat-decoration">
                  07
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="target" size={19} />
                </div>

                <div className="stat-content">
                  <span>Weekly accuracy</span>
                  <strong>86%</strong>
                  <small className="positive">
                    +8.4% this week
                  </small>
                </div>

                <div className="mini-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="clock" size={19} />
                </div>

                <div className="stat-content">
                  <span>Practice time</span>
                  <strong>4h 32m</strong>
                  <small>This month</small>
                </div>

                <div className="stat-decoration">
                  4.5
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Icon name="zap" size={19} />
                </div>

                <div className="stat-content">
                  <span>Total XP</span>
                  <strong>2,480</strong>
                  <small>Level 8 learner</small>
                </div>

                <div className="stat-decoration">
                  XP
                </div>
              </div>
            </section>

            {/* =================================================
                PRACTICE
            ================================================= */}

            <section
              id="practice"
              className="practice-layout"
            >
              <div className="camera-card glass-panel">
                <div className="panel-heading">
                  <div>
                    <div className="section-kicker">
                      <span className="live-indicator" />
                      AI PRACTICE STUDIO
                    </div>

                    <h2>
                      Practice with your camera
                    </h2>

                    <p>
                      Show the target sign naturally
                      in front of your webcam.
                    </p>
                  </div>

                  <div className="vision-status">
                    <span
                      className={
                        opencvStatus ===
                        "OpenCV ready"
                          ? "status-online"
                          : ""
                      }
                    />

                    {opencvStatus}
                  </div>
                </div>

                <div
                  id="camera-stage"
                  className={`camera-stage ${
                    cameraActive
                      ? "camera-running"
                      : ""
                  } ${
                    fullscreen
                      ? "camera-fullscreen"
                      : ""
                  }`}
                >
                  <video
                    ref={videoRef}
                    className={`camera-video ${
                      mirror ? "mirrored" : ""
                    }`}
                    playsInline
                    muted
                  />

                  <canvas
                    ref={processingCanvasRef}
                    className="processing-canvas"
                  />

                  {!cameraActive && (
                    <div className="camera-placeholder">
                      <div className="camera-orb">
                        <Icon
                          name="camera"
                          size={30}
                        />
                      </div>

                      <h3>Camera practice</h3>

                      <p>
                        Start your webcam to practice
                        signs with live vision
                        feedback.
                      </p>

                      <button
                        className="start-camera"
                        onClick={startCamera}
                      >
                        <Icon
                          name="camera"
                          size={17}
                        />
                        Enable camera
                      </button>

                      {cameraError && (
                        <div className="camera-error">
                          {cameraError}
                        </div>
                      )}
                    </div>
                  )}

                  {cameraActive && (
                    <>
                      <div className="camera-grid" />

                      <div className="camera-top-left">
                        <span className="rec-dot" />
                        LIVE
                      </div>

                      <div className="camera-top-right">
                        <span>
                          {visionFPS || 24} FPS
                        </span>

                        <span>
                          {formatTime(
                            sessionSeconds
                          )}
                        </span>
                      </div>

                      <div className="camera-frame-corners">
                        <span className="corner tl" />
                        <span className="corner tr" />
                        <span className="corner bl" />
                        <span className="corner br" />
                      </div>

                      <div className="hand-guide">
                        <div className="guide-circle">
                          <Icon
                            name="hand"
                            size={37}
                          />
                        </div>

                        <span>
                          Place your hand inside
                          the frame
                        </span>
                      </div>

                      {detected && (
                        <div className="detection-badge">
                          <Icon
                            name="check"
                            size={14}
                          />
                          Practice frame captured
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="camera-toolbar">
                  <div className="camera-controls">
                    <button
                      className="camera-control"
                      onClick={() =>
                        setMirror(!mirror)
                      }
                      title="Mirror camera"
                    >
                      <Icon
                        name="mirror"
                        size={17}
                      />

                      <span>Mirror</span>
                    </button>

                    <button
                      className="camera-control"
                      onClick={toggleFullscreen}
                      title="Fullscreen"
                    >
                      <Icon
                        name="maximize"
                        size={17}
                      />

                      <span>Fullscreen</span>
                    </button>

                    <button
                      className="camera-control"
                      onClick={() => {
                        setDetected(false);
                        setPracticeScore(0);
                      }}
                    >
                      <Icon
                        name="refresh"
                        size={17}
                      />

                      <span>Reset</span>
                    </button>
                  </div>

                  {cameraActive ? (
                    <button
                      className="stop-camera"
                      onClick={stopCamera}
                    >
                      <Icon
                        name="stop"
                        size={16}
                      />
                      Stop camera
                    </button>
                  ) : (
                    <button
                      className="start-camera small-start"
                      onClick={startCamera}
                    >
                      <Icon
                        name="play"
                        size={15}
                      />
                      Start
                    </button>
                  )}
                </div>
              </div>

              {/* TARGET */}

              <aside className="practice-side">
                <div className="target-card glass-panel">
                  <div className="target-header">
                    <div>
                      <span>TARGET SIGN</span>
                      <strong>Alphabet</strong>
                    </div>

                    <button
                      className="icon-button small"
                      onClick={changeSign}
                      aria-label="Next sign"
                    >
                      <Icon
                        name="refresh"
                        size={16}
                      />
                    </button>
                  </div>

                  <div className="target-sign">
                    <div className="target-letter">
                      {targetSign}
                    </div>

                    <div className="target-ring" />
                  </div>

                  <h3>
                    Sign "{targetSign}"
                  </h3>

                  <p>
                    Hold the correct handshape
                    clearly in front of the camera.
                  </p>

                  <div className="target-tip">
                    <div>
                      <Icon
                        name="spark"
                        size={15}
                      />
                    </div>

                    <span>
                      Tip: Keep your palm visible
                      and avoid covering your
                      fingers.
                    </span>
                  </div>

                  <button
                    className="primary-action"
                    onClick={handlePractice}
                  >
                    <Icon
                      name={
                        cameraActive
                          ? "playCircle"
                          : "camera"
                      }
                      size={17}
                    />

                    {cameraActive
                      ? "Check my sign"
                      : "Start practice"}
                  </button>
                </div>

                <div className="accuracy-card glass-panel">
                  <div className="accuracy-top">
                    <div>
                      <span>SESSION SCORE</span>

                      <strong>
                        {practiceScore}%
                      </strong>
                    </div>

                    <div className="accuracy-icon">
                      <Icon
                        name="target"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{
                        width: `${practiceScore}%`,
                      }}
                    />
                  </div>

                  <div className="accuracy-bottom">
                    <span>Hand position</span>
                    <strong>
                      {detected
                        ? "Detected"
                        : "Waiting"}
                    </strong>
                  </div>
                </div>
              </aside>
            </section>

            {/* =================================================
                DAILY GOAL
            ================================================= */}

            <section className="goal-card glass-panel">
              <div className="goal-icon">
                <Icon name="target" size={23} />
              </div>

              <div className="goal-main">
                <div className="goal-title">
                  <div>
                    <span>TODAY'S GOAL</span>

                    <h3>
                      Practice 15 signs
                    </h3>
                  </div>

                  <strong>9 / 15</strong>
                </div>

                <div className="goal-track">
                  <div
                    style={{
                      width: "60%",
                    }}
                  />
                </div>

                <p>
                  You're 60% through today's
                  goal. Keep your streak alive.
                </p>
              </div>

              <button
                className="secondary-action"
                onClick={scrollToPractice}
              >
                Continue
                <Icon name="arrow" size={15} />
              </button>
            </section>

            {/* =================================================
                LEARNING
            ================================================= */}

            <section className="learning-section">
              <div className="section-header">
                <div>
                  <span className="section-kicker">
                    CURRICULUM
                  </span>

                  <h2>Continue learning</h2>

                  <p>
                    Pick up exactly where you
                    left off.
                  </p>
                </div>

                <button className="view-all">
                  View all
                  <Icon name="arrow" size={14} />
                </button>
              </div>

              <div className="lesson-grid">
                {lessons.map((lesson) => (
                  <article
                    key={lesson.title}
                    className="lesson-card glass-panel"
                  >
                    <div className="lesson-top">
                      <div className="lesson-symbol">
                        {lesson.icon}
                      </div>

                      <button
                        className="icon-button small"
                        aria-label="Save lesson"
                      >
                        <Icon
                          name="bookmark"
                          size={15}
                        />
                      </button>
                    </div>

                    <div className="lesson-meta">
                      <span>
                        {lesson.level}
                      </span>

                      <span>
                        {lesson.duration}
                      </span>
                    </div>

                    <h3>{lesson.title}</h3>

                    <p>
                      {lesson.description}
                    </p>

                    <div className="lesson-progress">
                      <div className="lesson-progress-label">
                        <span>Progress</span>

                        <strong>
                          {lesson.progress}%
                        </strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-value"
                          style={{
                            width: `${lesson.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button className="lesson-button">
                      <Icon
                        name="play"
                        size={14}
                      />
                      Continue
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* =================================================
                ALPHABET LAB
            ================================================= */}

            <section className="alphabet-section glass-panel">
              <div className="alphabet-header">
                <div>
                  <span className="section-kicker">
                    QUICK PRACTICE
                  </span>

                  <h2>Alphabet lab</h2>

                  <p>
                    Select a letter and practice
                    it with your camera.
                  </p>
                </div>

                <button className="secondary-action">
                  Full alphabet
                  <Icon name="arrow" size={14} />
                </button>
              </div>

              <div className="alphabet-grid">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`letter-card ${
                      targetSign === letter
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setTargetSign(letter);
                      scrollToPractice();
                    }}
                  >
                    <span>{letter}</span>
                    <small>Practice</small>
                  </button>
                ))}
              </div>
            </section>

            {/* =================================================
                LOWER GRID
            ================================================= */}

            <section className="lower-grid">
              <div className="activity-card glass-panel">
                <div className="section-header compact">
                  <div>
                    <span className="section-kicker">
                      HISTORY
                    </span>

                    <h2>Recent activity</h2>
                  </div>

                  <button
                    className="icon-button small"
                    aria-label="More activity"
                  >
                    <Icon
                      name="more"
                      size={16}
                    />
                  </button>
                </div>

                <div className="activity-list">
                  {activities.map((activity) => (
                    <div
                      className="activity-row"
                      key={activity.title}
                    >
                      <div className="activity-icon">
                        <Icon
                          name={activity.icon}
                          size={17}
                        />
                      </div>

                      <div className="activity-copy">
                        <strong>
                          {activity.title}
                        </strong>

                        <span>
                          {activity.meta}
                        </span>
                      </div>

                      <time>
                        {activity.time}
                      </time>
                    </div>
                  ))}
                </div>
              </div>

              <div className="achievement-card glass-panel">
                <div className="achievement-icon">
                  <Icon
                    name="trophy"
                    size={24}
                  />
                </div>

                <span className="section-kicker">
                  NEXT MILESTONE
                </span>

                <h2>Alphabet Explorer</h2>

                <p>
                  Learn 20 alphabet signs to
                  unlock your next achievement.
                </p>

                <div className="achievement-progress">
                  <div className="achievement-label">
                    <span>17 / 20</span>
                    <strong>85%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{
                        width: "85%",
                      }}
                    />
                  </div>
                </div>

                <button className="secondary-action">
                  View achievements
                  <Icon
                    name="arrow"
                    size={14}
                  />
                </button>
              </div>
            </section>

            <footer className="dashboard-footer">
              <span className="footer-brand">
                SignLearnAI
              </span>

              <span>
                AI-powered sign language learning
                workspace
              </span>

              <span>
                Camera processing stays local
              </span>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}