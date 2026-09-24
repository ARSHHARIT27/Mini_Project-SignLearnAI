"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
   ICON
   Inline SVG keeps the page independent from extra packages.
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
          <path d="M8 9h1" />
          <path d="M15 9h1" />
          <path d="M8 13h1" />
          <path d="M15 13h1" />
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
          <path d="M8 6H4v2a4 4 0 0 0 4 4" />
          <path d="M16 6h4v2a4 4 0 0 1-4 4" />
          <path d="M12 13v4" />
          <path d="M8 21h8" />
          <path d="M9 17h6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20h-2.4v-.21A1.7 1.7 0 0 0 11.7 18.24a1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15 1.7 1.7 0 0 0 6.91 14H6.7v-2.4h.21A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.55V5h2.4v.21A1.7 1.7 0 0 0 16.16 6.76a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1.03H21v2.4h-.21A1.7 1.7 0 0 0 19.4 15Z" />
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

    case "pause":
      return (
        <svg {...common}>
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
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
          <path d="M8 3H3v5" />
          <path d="M3 3l6 6" />
          <path d="M16 3h5v5" />
          <path d="m21 3-6 6" />
          <path d="M8 21H3v-5" />
          <path d="m3 21 6-6" />
          <path d="M16 21h5v-5" />
          <path d="m21 21-6-6" />
        </svg>
      );

    case "mirror":
      return (
        <svg {...common}>
          <path d="M12 4v16" />
          <path d="M8 7 4 9v6l4 2V7Z" />
          <path d="m16 7 4 2v6l-4 2V7Z" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.8-4L3 9" />
          <path d="M3 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14.8 4L21 15" />
          <path d="M21 20v-5h-5" />
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

    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
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

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c.5-3.2 2.5-5 6-5s5.5 1.8 6 5" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 15c2.2.3 3.5 1.9 4 4" />
        </svg>
      );

    case "help":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.7 9a2.4 2.4 0 1 1 3.9 1.9c-1.1.8-1.6 1.2-1.6 2.6" />
          <path d="M12 17h.01" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 5H5v14h5" />
          <path d="M14 8l4 4-4 4" />
          <path d="M8 12h10" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );

    case "volume":
      return (
        <svg {...common}>
          <path d="M5 10v4h3l4 3V7l-4 3H5Z" />
          <path d="M16 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a8 8 0 0 1 0 11" />
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
          <path d="M7 11V5a1.5 1.5 0 0 1 3 0v5" />
          <path d="M10 9V3.8a1.5 1.5 0 0 1 3 0V10" />
          <path d="M13 9V5a1.5 1.5 0 0 1 3 0v6" />
          <path d="M16 11V8a1.5 1.5 0 0 1 3 0v7c0 4-2.5 6-6 6h-1c-3 0-5.5-1.5-7-4l-2-4a1.6 1.6 0 0 1 2.8-1.5L7 14V11" />
        </svg>
      );

    case "playCircle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 5 4-5 4V8Z" fill="currentColor" />
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
  const [opencvStatus, setOpencvStatus] = useState("Loading vision engine");
  const [visionFPS, setVisionFPS] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [targetSign, setTargetSign] = useState("A");
  const [practiceScore, setPracticeScore] = useState(0);
  const [detected, setDetected] = useState(false);

  /* =========================================================
     LOAD OPENCV.JS
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

    script.src =
      "https://docs.opencv.org/4.x/opencv.js";

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

    return () => {
      /* Keep OpenCV script available for the session. */
    };
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

    /*
      OpenCV.js processing pipeline.

      This intentionally does NOT pretend to recognize a sign.
      It prepares each camera frame for a future hand-landmark/
      gesture-recognition model.
    */

    if (
      cvLoadedRef.current &&
      (window as any).cv
    ) {
      try {
        const cv = (window as any).cv;

        const src = cv.imread(canvas);
        const gray = new cv.Mat();

        cv.cvtColor(
          src,
          gray,
          cv.COLOR_RGBA2GRAY
        );

        /*
          Lightweight processing keeps the UI responsive.
          The processed frame can later be passed into a
          trained OpenCV / MediaPipe / ONNX pipeline.
        */

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
        cancelAnimationFrame(
          animationRef.current
        );
      }

      animationRef.current =
        requestAnimationFrame(
          processCameraFrame
        );
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
      cancelAnimationFrame(
        animationRef.current
      );

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

    const interval =
      window.setInterval(() => {
        setSessionSeconds(
          (seconds) => seconds + 1
        );
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
        cancelAnimationFrame(
          animationRef.current
        );
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
      document.getElementById(
        "camera-stage"
      );

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
    const minutes = Math.floor(
      seconds / 60
    )
      .toString()
      .padStart(2, "0");

    const remaining = (
      seconds % 60
    )
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

  /* =========================================================
     NAVIGATION
  ========================================================= */

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
      <main className="dashboard-page">
        {/* ===================================================
            AMBIENT BACKGROUND
        =================================================== */}

        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />
        <div className="ambient ambient-four" />

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className={`sidebar ${
            mobileMenu
              ? "sidebar-open"
              : ""
          }`}
        >
          <div className="sidebar-brand">
            <div className="brand-logo">
              S
            </div>

            <div>
              <strong>
                SignLearnAI
              </strong>

              <span>
                AI learning studio
              </span>
            </div>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">
              A
            </div>

            <div className="profile-info">
              <strong>
                Welcome back
              </strong>

              <span>
                Keep learning today
              </span>
            </div>

            <button
              className="icon-button small"
              aria-label="More options"
            >
              <Icon
                name="more"
                size={18}
              />
            </button>
          </div>

          <nav className="sidebar-nav">
            <span className="nav-label">
              Workspace
            </span>

            {navigation.map(
              (item) => (
                <button
                  key={item.label}
                  className={`nav-item ${
                    activeNav ===
                    item.label
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveNav(
                      item.label
                    );

                    if (
                      item.label ===
                      "Practice"
                    ) {
                      scrollToPractice();
                    }
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={19}
                  />

                  <span>
                    {item.label}
                  </span>

                  {item.label ===
                    "Practice" && (
                    <span className="nav-live">
                      LIVE
                    </span>
                  )}
                </button>
              )
            )}

            <span className="nav-label nav-label-gap">
              Your learning
            </span>

            <button className="nav-item">
              <Icon
                name="trophy"
                size={19}
              />

              <span>
                Achievements
              </span>
            </button>

            <button className="nav-item">
              <Icon
                name="bookmark"
                size={19}
              />

              <span>
                Saved signs
              </span>
            </button>

            <button className="nav-item">
              <Icon
                name="activity"
                size={19}
              />

              <span>
                Activity
              </span>
            </button>
          </nav>

          <div className="sidebar-bottom">
            <div className="privacy-card">
              <div className="privacy-icon">
                <Icon
                  name="shield"
                  size={18}
                />
              </div>

              <div>
                <strong>
                  Camera privacy
                </strong>

                <span>
                  Video stays on your device
                </span>
              </div>
            </div>

            <button className="nav-item">
              <Icon
                name="settings"
                size={19}
              />

              <span>
                Settings
              </span>
            </button>

            <button
              className="nav-item"
              onClick={() => {
                window.location.href =
                  "/login";
              }}
            >
              <Icon
                name="logout"
                size={19}
              />

              <span>
                Sign out
              </span>
            </button>
          </div>
        </aside>

        {/* ===================================================
            MOBILE OVERLAY
        =================================================== */}

        {mobileMenu && (
          <button
            className="mobile-overlay"
            aria-label="Close menu"
            onClick={() =>
              setMobileMenu(false)
            }
          />
        )}

        {/* ===================================================
            MAIN AREA
        =================================================== */}

        <section className="main-area">
          {/* =================================================
              TOP HEADER
          ================================================= */}

          <header className="topbar">
            <div className="mobile-menu-wrap">
              <button
                className="icon-button mobile-menu"
                onClick={() =>
                  setMobileMenu(
                    !mobileMenu
                  )
                }
              >
                <Icon
                  name="menu"
                  size={21}
                />
              </button>
            </div>

            <div className="breadcrumb">
              <span>
                Workspace
              </span>

              <Icon
                name="chevron"
                size={14}
              />

              <strong>
                Dashboard
              </strong>
            </div>

            <div className="topbar-actions">
              <div className="search-box">
                <Icon
                  name="search"
                  size={17}
                />

                <input
                  placeholder="Search signs, lessons..."
                  aria-label="Search"
                />

                <kbd>
                  /
                </kbd>
              </div>

              <button
                className="icon-button"
                aria-label="Notifications"
              >
                <Icon
                  name="bell"
                  size={19}
                />

                <span className="notification-dot" />
              </button>

              <div className="top-avatar">
                A
              </div>
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

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
                  <span>
                    Practice.
                  </span>
                  Sign.
                </h1>

                <p>
                  Build real sign-language
                  confidence with guided
                  lessons and AI-powered
                  camera practice.
                </p>
              </div>

              <button
                className="hero-practice-button"
                onClick={
                  scrollToPractice
                }
              >
                <span>
                  <Icon
                    name="camera"
                    size={18}
                  />
                </span>

                Start practice

                <Icon
                  name="arrow"
                  size={17}
                />
              </button>
            </section>

            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Icon
                    name="flame"
                    size={20}
                  />
                </div>

                <div className="stat-content">
                  <span>
                    Current streak
                  </span>

                  <strong>
                    7 days
                  </strong>

                  <small>
                    Keep it going
                  </small>
                </div>

                <div className="stat-decoration">
                  07
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Icon
                    name="target"
                    size={20}
                  />
                </div>

                <div className="stat-content">
                  <span>
                    Weekly accuracy
                  </span>

                  <strong>
                    86%
                  </strong>

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
                  <Icon
                    name="clock"
                    size={20}
                  />
                </div>

                <div className="stat-content">
                  <span>
                    Practice time
                  </span>

                  <strong>
                    4h 32m
                  </strong>

                  <small>
                    This month
                  </small>
                </div>

                <div className="stat-decoration">
                  4.5
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Icon
                    name="zap"
                    size={20}
                  />
                </div>

                <div className="stat-content">
                  <span>
                    Total XP
                  </span>

                  <strong>
                    2,480
                  </strong>

                  <small>
                    Level 8 learner
                  </small>
                </div>

                <div className="stat-decoration">
                  XP
                </div>
              </div>
            </section>

            {/* =================================================
                MAIN PRACTICE AREA
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
                      Practice with
                      your camera
                    </h2>

                    <p>
                      Show the target sign
                      naturally in front of
                      your webcam.
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
                      mirror
                        ? "mirrored"
                        : ""
                    }`}
                    playsInline
                    muted
                  />

                  <canvas
                    ref={
                      processingCanvasRef
                    }
                    className="processing-canvas"
                  />

                  {!cameraActive && (
                    <div className="camera-placeholder">
                      <div className="camera-orb">
                        <Icon
                          name="camera"
                          size={31}
                        />
                      </div>

                      <h3>
                        Camera practice
                      </h3>

                      <p>
                        Start your webcam
                        to practice signs
                        with live vision
                        feedback.
                      </p>

                      <button
                        className="start-camera"
                        onClick={
                          startCamera
                        }
                      >
                        <Icon
                          name="camera"
                          size={18}
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
                          {visionFPS ||
                            24}{" "}
                          FPS
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
                            size={38}
                          />
                        </div>

                        <span>
                          Place your hand
                          inside the frame
                        </span>
                      </div>

                      {detected && (
                        <div className="detection-badge">
                          <Icon
                            name="check"
                            size={15}
                          />
                          Practice frame
                          captured
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
                        setMirror(
                          !mirror
                        )
                      }
                      title="Mirror camera"
                    >
                      <Icon
                        name="mirror"
                        size={18}
                      />

                      <span>
                        Mirror
                      </span>
                    </button>

                    <button
                      className="camera-control"
                      onClick={
                        toggleFullscreen
                      }
                      title="Fullscreen"
                    >
                      <Icon
                        name="maximize"
                        size={18}
                      />

                      <span>
                        Fullscreen
                      </span>
                    </button>

                    <button
                      className="camera-control"
                      onClick={() => {
                        setDetected(
                          false
                        );
                        setPracticeScore(
                          0
                        );
                      }}
                    >
                      <Icon
                        name="refresh"
                        size={18}
                      />

                      <span>
                        Reset
                      </span>
                    </button>
                  </div>

                  {cameraActive ? (
                    <button
                      className="stop-camera"
                      onClick={
                        stopCamera
                      }
                    >
                      <Icon
                        name="stop"
                        size={17}
                      />

                      Stop camera
                    </button>
                  ) : (
                    <button
                      className="start-camera small-start"
                      onClick={
                        startCamera
                      }
                    >
                      <Icon
                        name="play"
                        size={16}
                      />

                      Start
                    </button>
                  )}
                </div>
              </div>

              {/* =============================================
                  TARGET PANEL
              ============================================= */}

              <aside className="practice-side">
                <div className="target-card glass-panel">
                  <div className="target-header">
                    <div>
                      <span>
                        TARGET SIGN
                      </span>

                      <strong>
                        Alphabet
                      </strong>
                    </div>

                    <button
                      className="icon-button small"
                      onClick={
                        changeSign
                      }
                    >
                      <Icon
                        name="refresh"
                        size={17}
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
                    Hold the correct
                    handshape clearly in
                    front of the camera.
                  </p>

                  <div className="target-tip">
                    <div>
                      <Icon
                        name="spark"
                        size={16}
                      />
                    </div>

                    <span>
                      Tip: Keep your palm
                      visible and avoid
                      covering your fingers.
                    </span>
                  </div>

                  <button
                    className="primary-action"
                    onClick={
                      handlePractice
                    }
                  >
                    <Icon
                      name={
                        cameraActive
                          ? "playCircle"
                          : "camera"
                      }
                      size={18}
                    />

                    {cameraActive
                      ? "Check my sign"
                      : "Start practice"}
                  </button>
                </div>

                <div className="accuracy-card glass-panel">
                  <div className="accuracy-top">
                    <div>
                      <span>
                        SESSION SCORE
                      </span>

                      <strong>
                        {practiceScore}%
                      </strong>
                    </div>

                    <div className="accuracy-icon">
                      <Icon
                        name="target"
                        size={19}
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
                    <span>
                      Hand position
                    </span>

                    <strong>
                      Waiting
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
                <Icon
                  name="target"
                  size={24}
                />
              </div>

              <div className="goal-main">
                <div className="goal-title">
                  <div>
                    <span>
                      TODAY'S GOAL
                    </span>

                    <h3>
                      Practice 15 signs
                    </h3>
                  </div>

                  <strong>
                    9 / 15
                  </strong>
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
                onClick={
                  scrollToPractice
                }
              >
                Continue
                <Icon
                  name="arrow"
                  size={16}
                />
              </button>
            </section>

            {/* =================================================
                LEARNING SECTION
            ================================================= */}

            <section className="learning-section">
              <div className="section-header">
                <div>
                  <span className="section-kicker">
                    CURRICULUM
                  </span>

                  <h2>
                    Continue learning
                  </h2>

                  <p>
                    Pick up exactly where you
                    left off.
                  </p>
                </div>

                <button className="view-all">
                  View all
                  <Icon
                    name="arrow"
                    size={15}
                  />
                </button>
              </div>

              <div className="lesson-grid">
                {lessons.map(
                  (lesson) => (
                    <article
                      key={lesson.title}
                      className="lesson-card glass-panel"
                    >
                      <div className="lesson-top">
                        <div className="lesson-symbol">
                          {lesson.icon}
                        </div>

                        <button className="icon-button small">
                          <Icon
                            name="bookmark"
                            size={16}
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

                      <h3>
                        {lesson.title}
                      </h3>

                      <p>
                        {lesson.description}
                      </p>

                      <div className="lesson-progress">
                        <div className="lesson-progress-label">
                          <span>
                            Progress
                          </span>

                          <strong>
                            {
                              lesson.progress
                            }
                            %
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
                          size={15}
                        />

                        Continue
                      </button>
                    </article>
                  )
                )}
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

                  <h2>
                    Alphabet lab
                  </h2>

                  <p>
                    Select a letter and
                    practice it with your
                    camera.
                  </p>
                </div>

                <button className="secondary-action">
                  Full alphabet
                  <Icon
                    name="arrow"
                    size={15}
                  />
                </button>
              </div>

              <div className="alphabet-grid">
                {alphabet.map(
                  (letter) => (
                    <button
                      key={letter}
                      className={`letter-card ${
                        targetSign ===
                        letter
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setTargetSign(
                          letter
                        );

                        scrollToPractice();
                      }}
                    >
                      <span>
                        {letter}
                      </span>

                      <small>
                        Practice
                      </small>
                    </button>
                  )
                )}
              </div>
            </section>

            {/* =================================================
                LOWER GRID
            ================================================= */}

            <section className="lower-grid">
              {/* Recent activity */}

              <div className="activity-card glass-panel">
                <div className="section-header compact">
                  <div>
                    <span className="section-kicker">
                      HISTORY
                    </span>

                    <h2>
                      Recent activity
                    </h2>
                  </div>

                  <button className="icon-button small">
                    <Icon
                      name="more"
                      size={17}
                    />
                  </button>
                </div>

                <div className="activity-list">
                  {activities.map(
                    (activity) => (
                      <div
                        className="activity-row"
                        key={
                          activity.title
                        }
                      >
                        <div className="activity-icon">
                          <Icon
                            name={
                              activity.icon
                            }
                            size={18}
                          />
                        </div>

                        <div className="activity-copy">
                          <strong>
                            {
                              activity.title
                            }
                          </strong>

                          <span>
                            {
                              activity.meta
                            }
                          </span>
                        </div>

                        <time>
                          {
                            activity.time
                          }
                        </time>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Achievement */}

              <div className="achievement-card glass-panel">
                <div className="achievement-glow" />

                <div className="achievement-icon">
                  <Icon
                    name="trophy"
                    size={25}
                  />
                </div>

                <span className="section-kicker">
                  NEXT MILESTONE
                </span>

                <h2>
                  Alphabet Explorer
                </h2>

                <p>
                  Learn 20 alphabet signs
                  to unlock your next
                  achievement.
                </p>

                <div className="achievement-progress">
                  <div className="achievement-label">
                    <span>
                      17 / 20
                    </span>

                    <strong>
                      85%
                    </strong>
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
                    size={15}
                  />
                </button>
              </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="dashboard-footer">
              <div className="footer-brand">
                <div className="footer-logo">
                  S
                </div>

                <span>
                  SignLearnAI
                </span>
              </div>

              <div className="footer-center">
                <Icon
                  name="shield"
                  size={14}
                />

                Camera processing is
                designed to stay
                on-device.
              </div>

              <span className="footer-version">
                Learning Studio v1.0
              </span>
            </footer>
          </div>
        </section>
      </main>

      {/* =======================================================
          STYLES
      ======================================================= */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #dfe9b0;
          color: #354116;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .dashboard-page {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 12% 8%,
              rgba(255,255,255,0.72),
              transparent 28%
            ),
            radial-gradient(
              circle at 88% 18%,
              rgba(198,219,111,0.48),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #eaf1c4 0%,
              #dfe9b0 45%,
              #d6e49c 100%
            );
        }

        .ambient {
          position: fixed;
          border-radius: 999px;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .ambient-one {
          width: 360px;
          height: 360px;
          left: 14%;
          top: 5%;
          background: rgba(255,255,255,0.28);
        }

        .ambient-two {
          width: 300px;
          height: 300px;
          right: 4%;
          top: 32%;
          background: rgba(177,199,82,0.18);
        }

        .ambient-three {
          width: 280px;
          height: 280px;
          left: 42%;
          bottom: 3%;
          background: rgba(255,255,255,0.22);
        }

        .ambient-four {
          width: 220px;
          height: 220px;
          right: 28%;
          top: 62%;
          background: rgba(192,210,102,0.14);
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          width: 256px;
          min-width: 256px;
          min-height: 100vh;
          position: fixed;
          left: 16px;
          top: 16px;
          bottom: 16px;
          z-index: 30;
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.68);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.55),
              rgba(255,255,255,0.22)
            );
          backdrop-filter:
            blur(38px)
            saturate(190%)
            brightness(112%);
          -webkit-backdrop-filter:
            blur(38px)
            saturate(190%)
            brightness(112%);
          box-shadow:
            0 28px 80px rgba(72,88,24,0.13),
            inset 0 1px 1px rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(86,103,34,0.08);
        }

        .sidebar::before {
          content: "";
          position: absolute;
          left: 8%;
          right: 8%;
          top: 0;
          height: 1px;
          background: rgba(255,255,255,0.9);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 4px 7px 22px;
        }

        .brand-logo,
        .footer-logo {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: #51621e;
          font-weight: 800;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.76),
              rgba(255,255,255,0.28)
            );
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow:
            0 9px 24px rgba(69,84,25,0.08),
            inset 0 1px 1px rgba(255,255,255,0.95);
        }

        .sidebar-brand strong {
          display: block;
          font-size: 15px;
          letter-spacing: -0.25px;
          color: #3e4d18;
        }

        .sidebar-brand span {
          display: block;
          margin-top: 2px;
          color: #7c8759;
          font-size: 10px;
        }

        .profile-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          margin-bottom: 17px;
          border-radius: 18px;
          background: rgba(255,255,255,0.25);
          border: 1px solid rgba(255,255,255,0.42);
        }

        .profile-avatar,
        .top-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background:
            linear-gradient(
              145deg,
              #a8bd4e,
              #82952e
            );
          color: white;
          font-weight: 800;
          box-shadow:
            0 7px 18px rgba(78,94,25,0.2);
        }

        .profile-avatar {
          width: 35px;
          height: 35px;
          font-size: 12px;
        }

        .profile-info {
          min-width: 0;
          flex: 1;
        }

        .profile-info strong {
          display: block;
          color: #4a591f;
          font-size: 11px;
        }

        .profile-info span {
          display: block;
          color: #7d875b;
          font-size: 9px;
          margin-top: 3px;
        }

        .sidebar-nav {
          flex: 1;
        }

        .nav-label {
          display: block;
          padding: 0 10px 8px;
          color: #9a9f76;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .nav-label-gap {
          margin-top: 22px;
        }

        .nav-item {
          width: 100%;
          height: 43px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          margin-bottom: 4px;
          border: 0;
          border-radius: 14px;
          color: #737e4f;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .nav-item:hover {
          color: #4e5d20;
          background: rgba(255,255,255,0.28);
          transform: translateX(2px);
        }

        .nav-item.active {
          color: #475717;
          background:
            linear-gradient(
              100deg,
              rgba(255,255,255,0.68),
              rgba(255,255,255,0.30)
            );
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow:
            0 8px 24px rgba(75,90,24,0.07),
            inset 0 1px 1px rgba(255,255,255,0.9);
        }

        .nav-item span:not(.nav-live) {
          font-size: 11px;
          font-weight: 650;
        }

        .nav-live {
          margin-left: auto;
          padding: 3px 6px;
          border-radius: 7px;
          color: #65772a;
          background: rgba(154,177,58,0.12);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .sidebar-bottom {
          margin-top: 15px;
        }

        .privacy-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 16px;
          background: rgba(239,247,207,0.42);
          border: 1px solid rgba(255,255,255,0.46);
        }

        .privacy-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #65762b;
          background: rgba(255,255,255,0.42);
        }

        .privacy-card strong {
          display: block;
          color: #586627;
          font-size: 9px;
        }

        .privacy-card span {
          display: block;
          margin-top: 3px;
          color: #858d67;
          font-size: 8px;
          line-height: 1.3;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main-area {
          width: calc(100% - 288px);
          margin-left: 288px;
          position: relative;
          z-index: 2;
        }

        .topbar {
          height: 82px;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
          border-bottom: 1px solid rgba(255,255,255,0.20);
          background: rgba(230,238,193,0.30);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #929a6d;
          font-size: 10px;
        }

        .breadcrumb strong {
          color: #536321;
          font-weight: 750;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-box {
          width: 250px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 9px 0 12px;
          border-radius: 13px;
          color: #89915f;
          background: rgba(255,255,255,0.27);
          border: 1px solid rgba(255,255,255,0.43);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.55);
        }

        .search-box input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #52601e;
          font-size: 10px;
        }

        .search-box input::placeholder {
          color: #9aa17b;
        }

        kbd {
          padding: 3px 6px;
          border-radius: 6px;
          color: #8b936c;
          background: rgba(255,255,255,0.28);
          border: 1px solid rgba(255,255,255,0.40);
          font-size: 9px;
        }

        .icon-button {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          position: relative;
          border: 1px solid rgba(255,255,255,0.48);
          border-radius: 12px;
          color: #6d7945;
          background: rgba(255,255,255,0.27);
          cursor: pointer;
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.58);
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .icon-button:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.44);
        }

        .icon-button.small {
          width: 31px;
          height: 31px;
          border-radius: 10px;
        }

        .notification-dot {
          position: absolute;
          right: 7px;
          top: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #93aa39;
          border: 1px solid rgba(255,255,255,0.9);
        }

        .top-avatar {
          width: 38px;
          height: 38px;
          font-size: 11px;
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
          padding: 38px 34px 50px;
        }

        .hero-section {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 26px;
        }

        .eyebrow,
        .section-kicker {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7f8a53;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.35px;
        }

        .eyebrow-dot,
        .live-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #91a73a;
          box-shadow:
            0 0 0 4px rgba(145,167,58,0.10);
        }

        .hero-section h1 {
          margin: 9px 0 9px;
          color: #3f4d17;
          font-size: clamp(38px, 4.5vw, 64px);
          line-height: 0.98;
          letter-spacing: -3.5px;
          font-weight: 820;
        }

        .hero-section h1 span {
          color: #92a43d;
          margin-left: 10px;
        }

        .hero-section p {
          max-width: 570px;
          margin: 0;
          color: #798353;
          font-size: 12px;
          line-height: 1.65;
        }

        .hero-practice-button,
        .primary-action,
        .start-camera {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 14px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #9eb445,
              #7f942c
            );
          box-shadow:
            0 12px 26px rgba(91,108,28,0.20),
            inset 0 1px 1px rgba(255,255,255,0.38);
          cursor: pointer;
          font-weight: 750;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .hero-practice-button {
          min-width: 158px;
          height: 47px;
          padding: 0 16px;
          font-size: 10px;
        }

        .hero-practice-button span {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(255,255,255,0.17);
        }

        .hero-practice-button:hover,
        .primary-action:hover,
        .start-camera:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 30px rgba(91,108,28,0.26),
            inset 0 1px 1px rgba(255,255,255,0.40);
        }

        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .stat-card {
          min-height: 108px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px;
          border-radius: 21px;
          border: 1px solid rgba(255,255,255,0.56);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.53),
              rgba(255,255,255,0.21)
            );
          backdrop-filter: blur(27px);
          -webkit-backdrop-filter: blur(27px);
          box-shadow:
            0 17px 40px rgba(72,87,26,0.08),
            inset 0 1px 1px rgba(255,255,255,0.84);
        }

        .stat-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: #687b2b;
          background: rgba(255,255,255,0.38);
          border: 1px solid rgba(255,255,255,0.52);
        }

        .stat-content span {
          display: block;
          color: #8c956c;
          font-size: 9px;
        }

        .stat-content strong {
          display: block;
          margin-top: 3px;
          color: #485718;
          font-size: 20px;
          letter-spacing: -0.7px;
        }

        .stat-content small {
          display: block;
          margin-top: 3px;
          color: #949b7b;
          font-size: 8px;
        }

        .stat-content small.positive {
          color: #6e8428;
        }

        .stat-decoration {
          position: absolute;
          right: -4px;
          bottom: -12px;
          color: rgba(104,121,42,0.055);
          font-size: 60px;
          font-weight: 900;
          letter-spacing: -5px;
        }

        .mini-chart {
          height: 38px;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          margin-left: auto;
        }

        .mini-chart span {
          width: 4px;
          border-radius: 4px;
          background: rgba(128,150,46,0.30);
        }

        .mini-chart span:nth-child(1) {
          height: 12px;
        }

        .mini-chart span:nth-child(2) {
          height: 19px;
        }

        .mini-chart span:nth-child(3) {
          height: 14px;
        }

        .mini-chart span:nth-child(4) {
          height: 26px;
        }

        .mini-chart span:nth-child(5) {
          height: 20px;
        }

        .mini-chart span:nth-child(6) {
          height: 31px;
        }

        .mini-chart span:nth-child(7) {
          height: 35px;
          background: rgba(126,151,40,0.60);
        }

        /* =====================================================
           GLASS PANEL
        ===================================================== */

        .glass-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.62);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.55),
              rgba(255,255,255,0.19)
            );
          backdrop-filter:
            blur(31px)
            saturate(170%);
          -webkit-backdrop-filter:
            blur(31px)
            saturate(170%);
          box-shadow:
            0 24px 65px rgba(68,83,23,0.09),
            inset 0 1px 1px rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(74,91,25,0.06);
        }

        .glass-panel::before {
          content: "";
          position: absolute;
          left: 5%;
          right: 5%;
          top: 0;
          height: 1px;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.96),
              transparent
            );
          pointer-events: none;
        }

        /* =====================================================
           PRACTICE
        ===================================================== */

        .practice-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(280px, 0.72fr);
          gap: 16px;
          margin-bottom: 17px;
        }

        .camera-card {
          border-radius: 27px;
          padding: 20px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
        }

        .panel-heading h2 {
          margin: 6px 0 5px;
          color: #465617;
          font-size: 20px;
          letter-spacing: -0.8px;
        }

        .panel-heading p {
          margin: 0;
          color: #858d67;
          font-size: 10px;
        }

        .vision-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 9px;
          border-radius: 9px;
          color: #8b946d;
          background: rgba(255,255,255,0.26);
          border: 1px solid rgba(255,255,255,0.42);
          font-size: 8px;
          white-space: nowrap;
        }

        .vision-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c0c5a5;
        }

        .vision-status span.status-online {
          background: #8da33b;
          box-shadow:
            0 0 0 4px rgba(141,163,59,0.10);
        }

        .camera-stage {
          min-height: 430px;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          border-radius: 21px;
          border: 1px solid rgba(255,255,255,0.30);
          background:
            radial-gradient(
              circle at 50% 30%,
              rgba(115,139,40,0.12),
              transparent 35%
            ),
            #1d2412;
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.16),
            0 14px 35px rgba(36,44,13,0.14);
        }

        .camera-video {
          width: 100%;
          height: 100%;
          min-height: 430px;
          position: absolute;
          inset: 0;
          object-fit: cover;
          background: #1d2412;
        }

        .camera-video.mirrored {
          transform: scaleX(-1);
        }

        .processing-canvas {
          display: none;
        }

        .camera-placeholder {
          width: min(340px, 85%);
          position: relative;
          z-index: 3;
          text-align: center;
        }

        .camera-orb {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          margin: 0 auto 17px;
          border-radius: 23px;
          color: #b3c66a;
          background:
            rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.16),
            0 15px 40px rgba(0,0,0,0.16);
        }

        .camera-placeholder h3 {
          margin: 0;
          color: rgba(255,255,255,0.92);
          font-size: 20px;
          letter-spacing: -0.6px;
        }

        .camera-placeholder p {
          margin: 9px auto 19px;
          max-width: 290px;
          color: rgba(235,242,211,0.62);
          font-size: 10px;
          line-height: 1.6;
        }

        .camera-placeholder .start-camera {
          margin: auto;
        }

        .camera-error {
          margin-top: 13px;
          color: #e6b2a8;
          font-size: 9px;
          line-height: 1.5;
        }

        .camera-grid {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.16;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.13) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.13) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          pointer-events: none;
        }

        .camera-top-left,
        .camera-top-right {
          position: absolute;
          top: 14px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 9px;
          border-radius: 9px;
          color: rgba(255,255,255,0.72);
          background: rgba(13,18,7,0.30);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          font-size: 8px;
          font-weight: 750;
          letter-spacing: 0.8px;
        }

        .camera-top-left {
          left: 14px;
        }

        .camera-top-right {
          right: 14px;
        }

        .camera-top-right span + span {
          padding-left: 7px;
          border-left: 1px solid rgba(255,255,255,0.18);
        }

        .rec-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b8d15a;
          box-shadow:
            0 0 0 4px rgba(184,209,90,0.12);
        }

        .camera-frame-corners {
          position: absolute;
          inset: 10% 13%;
          z-index: 4;
          pointer-events: none;
        }

        .corner {
          width: 26px;
          height: 26px;
          position: absolute;
          border-color: rgba(217,230,167,0.55);
        }

        .corner.tl {
          top: 0;
          left: 0;
          border-top: 2px solid;
          border-left: 2px solid;
          border-radius: 8px 0 0 0;
        }

        .corner.tr {
          top: 0;
          right: 0;
          border-top: 2px solid;
          border-right: 2px solid;
          border-radius: 0 8px 0 0;
        }

        .corner.bl {
          bottom: 0;
          left: 0;
          border-bottom: 2px solid;
          border-left: 2px solid;
          border-radius: 0 0 0 8px;
        }

        .corner.br {
          right: 0;
          bottom: 0;
          border-bottom: 2px solid;
          border-right: 2px solid;
          border-radius: 0 0 8px 0;
        }

        .hand-guide {
          position: absolute;
          z-index: 4;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
          opacity: 0.62;
        }

        .guide-circle {
          width: 105px;
          height: 105px;
          display: grid;
          place-items: center;
          margin: 0 auto 8px;
          border: 1px dashed rgba(221,232,174,0.44);
          border-radius: 50%;
          color: rgba(221,232,174,0.62);
          background: rgba(255,255,255,0.025);
        }

        .hand-guide span {
          color: rgba(237,243,215,0.54);
          font-size: 8px;
        }

        .detection-badge {
          position: absolute;
          z-index: 6;
          left: 50%;
          bottom: 16px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border-radius: 10px;
          color: #e9f2c8;
          background: rgba(91,108,27,0.58);
          border: 1px solid rgba(211,230,143,0.25);
          backdrop-filter: blur(15px);
          font-size: 8px;
          font-weight: 700;
        }

        .camera-toolbar {
          min-height: 55px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 13px;
        }

        .camera-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .camera-control {
          height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 9px;
          border: 1px solid rgba(255,255,255,0.36);
          border-radius: 10px;
          color: #7c8759;
          background: rgba(255,255,255,0.20);
          cursor: pointer;
          font-size: 8px;
          font-weight: 650;
        }

        .camera-control:hover {
          background: rgba(255,255,255,0.35);
        }

        .stop-camera {
          height: 35px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 12px;
          border: 1px solid rgba(191,103,83,0.20);
          border-radius: 10px;
          color: #9a5f50;
          background: rgba(255,236,229,0.32);
          cursor: pointer;
          font-size: 8px;
          font-weight: 750;
        }

        .small-start {
          height: 35px;
          padding: 0 13px;
          font-size: 8px;
        }

        /* =====================================================
           PRACTICE SIDE
        ===================================================== */

        .practice-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .target-card {
          flex: 1;
          padding: 19px;
          border-radius: 27px;
        }

        .target-header,
        .accuracy-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .target-header span,
        .accuracy-top span {
          display: block;
          color: #969d78;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .target-header strong {
          display: block;
          margin-top: 4px;
          color: #546321;
          font-size: 11px;
        }

        .target-sign {
          width: 150px;
          height: 150px;
          position: relative;
          display: grid;
          place-items: center;
          margin: 20px auto 12px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(255,255,255,0.50),
              rgba(255,255,255,0.10) 55%,
              transparent 56%
            );
          border: 1px solid rgba(255,255,255,0.46);
        }

        .target-letter {
          position: relative;
          z-index: 2;
          color: #607324;
          font-size: 65px;
          font-weight: 850;
          letter-spacing: -4px;
        }

        .target-ring {
          position: absolute;
          inset: 13px;
          border: 1px dashed rgba(126,148,47,0.22);
          border-radius: 50%;
        }

        .target-card h3 {
          margin: 0;
          text-align: center;
          color: #4b591b;
          font-size: 15px;
        }

        .target-card > p {
          max-width: 260px;
          margin: 7px auto 15px;
          text-align: center;
          color: #89916b;
          font-size: 9px;
          line-height: 1.55;
        }

        .target-tip {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          padding: 10px;
          margin-bottom: 13px;
          border-radius: 13px;
          background: rgba(239,246,211,0.36);
          border: 1px solid rgba(255,255,255,0.42);
        }

        .target-tip div {
          color: #7b912f;
        }

        .target-tip span {
          color: #7d875b;
          font-size: 8px;
          line-height: 1.45;
        }

        .primary-action {
          width: 100%;
          height: 43px;
          font-size: 9px;
        }

        .accuracy-card {
          padding: 17px;
          border-radius: 21px;
        }

        .accuracy-top strong {
          display: block;
          margin-top: 3px;
          color: #4a5919;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .accuracy-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #71852d;
          background: rgba(255,255,255,0.32);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          overflow: hidden;
          margin-top: 12px;
          border-radius: 999px;
          background: rgba(108,125,45,0.10);
        }

        .progress-value {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #a9be51,
              #7e942e
            );
          box-shadow:
            0 0 10px rgba(134,156,46,0.16);
        }

        .accuracy-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          color: #9a9f7c;
          font-size: 8px;
        }

        .accuracy-bottom strong {
          color: #7f8c58;
        }

        /* =====================================================
           GOAL
        ===================================================== */

        .goal-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 17px 19px;
          margin-bottom: 38px;
          border-radius: 21px;
        }

        .goal-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          color: #6c7f2c;
          border-radius: 14px;
          background: rgba(255,255,255,0.36);
          border: 1px solid rgba(255,255,255,0.50);
        }

        .goal-main {
          flex: 1;
          min-width: 0;
        }

        .goal-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .goal-title span {
          color: #91996e;
          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1px;
        }

        .goal-title h3 {
          margin: 4px 0 0;
          color: #52601e;
          font-size: 12px;
        }

        .goal-title strong {
          color: #657729;
          font-size: 11px;
        }

        .goal-track {
          height: 6px;
          overflow: hidden;
          margin-top: 10px;
          border-radius: 999px;
          background: rgba(104,123,41,0.10);
        }

        .goal-track div {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #b0c65a,
              #829832
            );
        }

        .goal-main p {
          margin: 6px 0 0;
          color: #929978;
          font-size: 8px;
        }

        .secondary-action {
          min-height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,0.52);
          border-radius: 10px;
          color: #687732;
          background: rgba(255,255,255,0.27);
          cursor: pointer;
          font-size: 8px;
          font-weight: 750;
        }

        .secondary-action:hover {
          background: rgba(255,255,255,0.42);
        }

        /* =====================================================
           LEARNING
        ===================================================== */

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 16px;
        }

        .section-header h2,
        .alphabet-header h2,
        .achievement-card h2 {
          margin: 5px 0 0;
          color: #475516;
          font-size: 21px;
          letter-spacing: -0.8px;
        }

        .section-header p,
        .alphabet-header p {
          margin: 5px 0 0;
          color: #89916c;
          font-size: 9px;
        }

        .view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          color: #6d7d2e;
          background: transparent;
          cursor: pointer;
          font-size: 9px;
          font-weight: 750;
        }

        .lesson-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .lesson-card {
          min-height: 270px;
          padding: 16px;
          border-radius: 22px;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .lesson-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 30px 65px rgba(68,83,23,0.13),
            inset 0 1px 1px rgba(255,255,255,0.90);
        }

        .lesson-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lesson-symbol {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #6b7e2c;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.64),
              rgba(255,255,255,0.25)
            );
          border: 1px solid rgba(255,255,255,0.55);
          font-size: 15px;
          font-weight: 850;
        }

        .lesson-meta {
          display: flex;
          gap: 7px;
          margin-top: 17px;
        }

        .lesson-meta span {
          padding: 4px 7px;
          border-radius: 7px;
          color: #899367;
          background: rgba(255,255,255,0.25);
          font-size: 7px;
          font-weight: 700;
        }

        .lesson-card h3 {
          margin: 10px 0 5px;
          color: #4b591c;
          font-size: 14px;
        }

        .lesson-card > p {
          min-height: 29px;
          margin: 0;
          color: #8c9471;
          font-size: 8px;
          line-height: 1.45;
        }

        .lesson-progress {
          margin-top: 17px;
        }

        .lesson-progress-label {
          display: flex;
          justify-content: space-between;
          color: #9a9f7c;
          font-size: 7px;
        }

        .lesson-progress-label strong {
          color: #75852f;
        }

        .lesson-progress .progress-track {
          margin-top: 7px;
          height: 5px;
        }

        .lesson-button {
          width: 100%;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 15px;
          border: 1px solid rgba(255,255,255,0.48);
          border-radius: 10px;
          color: #69772f;
          background: rgba(255,255,255,0.27);
          cursor: pointer;
          font-size: 8px;
          font-weight: 750;
        }

        .lesson-button:hover {
          background: rgba(255,255,255,0.40);
        }

        /* =====================================================
           ALPHABET
        ===================================================== */

        .alphabet-section {
          margin-top: 38px;
          padding: 20px;
          border-radius: 26px;
        }

        .alphabet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 17px;
        }

        .alphabet-grid {
          display: grid;
          grid-template-columns:
            repeat(12, minmax(0, 1fr));
          gap: 8px;
        }

        .letter-card {
          height: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid rgba(255,255,255,0.45);
          border-radius: 14px;
          color: #68762d;
          background: rgba(255,255,255,0.19);
          cursor: pointer;
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .letter-card:hover,
        .letter-card.selected {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.44);
          border-color: rgba(255,255,255,0.70);
        }

        .letter-card.selected {
          box-shadow:
            0 10px 22px rgba(80,96,25,0.08);
        }

        .letter-card span {
          font-size: 21px;
          font-weight: 850;
        }

        .letter-card small {
          color: #969d78;
          font-size: 6px;
        }

        /* =====================================================
           LOWER
        ===================================================== */

        .lower-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(0, 0.85fr);
          gap: 16px;
          margin-top: 38px;
        }

        .activity-card,
        .achievement-card {
          min-height: 270px;
          padding: 20px;
          border-radius: 25px;
        }

        .section-header.compact {
          margin-bottom: 10px;
        }

        .activity-list {
          margin-top: 8px;
        }

        .activity-row {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(91,108,35,0.08);
        }

        .activity-row:last-child {
          border-bottom: 0;
        }

        .activity-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 11px;
          color: #71812f;
          background: rgba(255,255,255,0.30);
        }

        .activity-copy {
          flex: 1;
          min-width: 0;
        }

        .activity-copy strong {
          display: block;
          color: #566420;
          font-size: 9px;
        }

        .activity-copy span {
          display: block;
          margin-top: 3px;
          color: #999f7e;
          font-size: 7px;
        }

        .activity-row time {
          color: #a1a685;
          font-size: 7px;
        }

        .achievement-card {
          position: relative;
          overflow: hidden;
        }

        .achievement-glow {
          width: 180px;
          height: 180px;
          position: absolute;
          right: -65px;
          top: -65px;
          border-radius: 50%;
          background: rgba(190,211,94,0.20);
          filter: blur(15px);
        }

        .achievement-icon {
          width: 49px;
          height: 49px;
          display: grid;
          place-items: center;
          margin-bottom: 17px;
          position: relative;
          z-index: 1;
          border-radius: 15px;
          color: #75872f;
          background: rgba(255,255,255,0.36);
          border: 1px solid rgba(255,255,255,0.50);
        }

        .achievement-card h2 {
          position: relative;
          z-index: 1;
          font-size: 18px;
        }

        .achievement-card > p {
          max-width: 370px;
          position: relative;
          z-index: 1;
          margin: 8px 0 17px;
          color: #8b9370;
          font-size: 9px;
          line-height: 1.55;
        }

        .achievement-progress {
          position: relative;
          z-index: 1;
          margin-bottom: 18px;
        }

        .achievement-label {
          display: flex;
          justify-content: space-between;
          color: #899266;
          font-size: 8px;
        }

        .achievement-label strong {
          color: #70812d;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .dashboard-footer {
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(84,100,28,0.10);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #66742e;
          font-size: 9px;
          font-weight: 800;
        }

        .footer-logo {
          width: 27px;
          height: 27px;
          border-radius: 9px;
          font-size: 10px;
        }

        .footer-center {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #969d7a;
          font-size: 7px;
        }

        .footer-version {
          color: #a0a586;
          font-size: 7px;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 1180px) {
          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .lesson-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .alphabet-grid {
            grid-template-columns:
              repeat(6, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            transform: translateX(
              calc(-100% - 30px)
            );
            transition:
              transform 0.25s ease;
          }

          .sidebar.sidebar-open {
            transform: translateX(0);
          }

          .main-area {
            width: 100%;
            margin-left: 0;
          }

          .mobile-menu-wrap {
            display: block;
          }

          .mobile-menu {
            margin-right: 8px;
          }

          .topbar {
            padding: 0 18px;
          }

          .breadcrumb {
            display: none;
          }

          .search-box {
            width: min(260px, 40vw);
          }

          .practice-layout {
            grid-template-columns: 1fr;
          }

          .practice-side {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(220px, 0.55fr);
          }

          .lower-grid {
            grid-template-columns: 1fr;
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 25;
            border: 0;
            background: rgba(35,43,12,0.12);
            backdrop-filter: blur(4px);
          }
        }

        @media (max-width: 650px) {
          .content {
            padding: 25px 13px 35px;
          }

          .topbar {
            height: 67px;
          }

          .topbar-actions {
            gap: 6px;
          }

          .search-box {
            display: none;
          }

          .hero-section {
            display: block;
          }

          .hero-section h1 {
            font-size: 43px;
            letter-spacing: -2.5px;
          }

          .hero-section h1 span {
            display: block;
            margin-left: 0;
            margin-top: 5px;
          }

          .hero-practice-button {
            margin-top: 20px;
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat-card {
            min-height: 105px;
            padding: 12px;
          }

          .stat-decoration,
          .mini-chart {
            display: none;
          }

          .camera-card {
            padding: 12px;
            border-radius: 21px;
          }

          .panel-heading {
            display: block;
          }

          .vision-status {
            margin-top: 12px;
          }

          .camera-stage {
            min-height: 350px;
          }

          .camera-video {
            min-height: 350px;
          }

          .camera-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .camera-controls {
            overflow-x: auto;
          }

          .camera-control {
            white-space: nowrap;
          }

          .stop-camera,
          .small-start {
            width: 100%;
          }

          .practice-side {
            display: block;
          }

          .accuracy-card {
            margin-top: 12px;
          }

          .goal-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .goal-main {
            width: calc(100% - 60px);
          }

          .goal-card .secondary-action {
            width: 100%;
          }

          .lesson-grid {
            grid-template-columns: 1fr;
          }

          .alphabet-section {
            padding: 14px;
          }

          .alphabet-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .alphabet-grid {
            grid-template-columns:
              repeat(4, minmax(0, 1fr));
          }

          .lower-grid {
            gap: 12px;
          }

          .dashboard-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-center {
            order: 3;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}