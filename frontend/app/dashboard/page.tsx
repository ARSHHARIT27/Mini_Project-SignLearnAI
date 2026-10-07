"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* =========================================================
   ASL DATA
========================================================= */

const ALPHABET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

const SIGN_IMAGES: Record<string, string> = Object.fromEntries(
  ALPHABET.map((letter) => [
    letter,
    `https://commons.wikimedia.org/wiki/Special:FilePath/Sign%20language%20${letter}.svg`,
  ])
);

const LETTER_NAMES: Record<string, string> = Object.fromEntries(
  ALPHABET.map((letter) => [letter, letter])
);

/* =========================================================
   TYPES
========================================================= */

type HandPoint = {
  x: number;
  y: number;
  z: number;
};

type GestureResult =
  | {
      status: "correct";
      letter: string;
      confidence: number;
    }
  | {
      status: "incorrect";
      letter: string;
      confidence: number;
    };

declare global {
  interface Window {
    Hands?: any;
  }
}

/* =========================================================
   HELPERS
========================================================= */

function distance(a: HandPoint, b: HandPoint) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
      Math.pow(a.y - b.y, 2) +
      Math.pow(a.z - b.z, 2)
  );
}

function angleAt(a: HandPoint, b: HandPoint, c: HandPoint) {
  const ab = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const cb = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };
  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;
  const la = Math.hypot(ab.x, ab.y, ab.z);
  const lc = Math.hypot(cb.x, cb.y, cb.z);
  if (!la || !lc) return 0;
  return (Math.acos(Math.max(-1, Math.min(1, dot / (la * lc)))) * 180) / Math.PI;
}

function looksLikeZPath(points: HandPoint[]): boolean {
  if (points.length < 12) return false;

  const sampled = points.filter((_, i) => i % 2 === 0);
  if (sampled.length < 9) return false;

  const minX = Math.min(...sampled.map((p) => p.x));
  const maxX = Math.max(...sampled.map((p) => p.x));
  const minY = Math.min(...sampled.map((p) => p.y));
  const maxY = Math.max(...sampled.map((p) => p.y));
  const width = maxX - minX;
  const height = maxY - minY;

  if (width < 0.16 || height < 0.1) return false;

  const n = sampled.length;
  const a = sampled.slice(0, Math.floor(n / 3));
  const b = sampled.slice(Math.floor(n / 3), Math.floor((2 * n) / 3));
  const c = sampled.slice(Math.floor((2 * n) / 3));

  const dx = (arr: HandPoint[]) => arr[arr.length - 1].x - arr[0].x;
  const dy = (arr: HandPoint[]) => arr[arr.length - 1].y - arr[0].y;

  const ax = dx(a);
  const ay = dy(a);
  const bx = dx(b);
  const by = dy(b);
  const cx = dx(c);
  const cy = dy(c);

  const firstHorizontal = Math.abs(ax) > 0.055 && Math.abs(ax) > Math.abs(ay) * 1.8;
  const middleDiagonal = Math.abs(bx) > 0.045 && Math.abs(by) > 0.045;
  const lastHorizontal = Math.abs(cx) > 0.045 && Math.abs(cx) > Math.abs(cy) * 1.6;

  const sameHorizontalDirection = Math.sign(ax) === Math.sign(cx);
  const diagonalReversesX = Math.sign(bx) !== Math.sign(ax);
  const diagonalMovesDown = Math.abs(by) > 0.04;

  return (
    firstHorizontal &&
    middleDiagonal &&
    lastHorizontal &&
    sameHorizontalDirection &&
    diagonalReversesX &&
    diagonalMovesDown
  );
}

function looksLikeJPath(points: HandPoint[]): boolean {
  if (points.length < 14) return false;
  const sampled = points.filter((_, i) => i % 2 === 0);
  if (sampled.length < 7) return false;

  const minX = Math.min(...sampled.map((p) => p.x));
  const maxX = Math.max(...sampled.map((p) => p.x));
  const minY = Math.min(...sampled.map((p) => p.y));
  const maxY = Math.max(...sampled.map((p) => p.y));
  const width = maxX - minX;
  const height = maxY - minY;
  if (height < 0.14 || width < 0.07) return false;

  const n = sampled.length;
  const a = sampled.slice(0, Math.floor(n / 2));
  const b = sampled.slice(Math.floor(n / 2));
  const ay = a[a.length - 1].y - a[0].y;
  const bx = b[b.length - 1].x - b[0].x;
  const by = b[b.length - 1].y - b[0].y;
  return ay > 0.06 && Math.abs(bx) > 0.035 && by < 0.035;
}

/* =========================================================
   LOOSE GESTURE CLASSIFIER
   - rotation / distance tolerant
   - scores the hand against every letter
   - look-alike letters are accepted as a family
   - J and Z pass on handshape alone; motion only adds confidence
========================================================= */

function classifyGesture(
  raw: any[],
  targetSign?: string,
  movementPath: HandPoint[] = [],
  jMovementPath: HandPoint[] = []
): { letter: string; confidence: number } {
  if (!targetSign || raw.length < 21) return { letter: "?", confidence: 0 };

  const p: HandPoint[] = raw.map((q) => ({ x: q.x, y: q.y, z: q.z || 0 }));
  const d = (a: number, b: number) => distance(p[a], p[b]);
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // Palm size makes every measurement independent of camera distance.
  const palm = Math.max(0.001, (d(0, 9) + d(5, 17)) / 2);
  const n = (a: number, b: number) => d(a, b) / palm;

  // Finger extension 0..1 (rotation-invariant)
  const fingerExt = (tip: number, pip: number, mcp: number) => {
    const reach = d(tip, 0) / Math.max(0.001, d(mcp, 0));
    const angle = angleAt(p[tip], p[pip], p[mcp]);
    const e1 = clamp((reach - 1.15) / 0.55);
    const e2 = clamp((angle - 110) / 55);
    return e1 * 0.5 + e2 * 0.5;
  };

  const ext = [
    fingerExt(8, 6, 5),
    fingerExt(12, 10, 9),
    fingerExt(16, 14, 13),
    fingerExt(20, 18, 17),
  ];

  const thumbOut = clamp((n(4, 5) - 0.45) / 0.55);
  const thumbIn = 1 - thumbOut;

  const ti = n(4, 8);
  const tm = n(4, 12);
  const im = n(8, 12);
  const mr = n(12, 16);
  const tipsToThumb = (n(8, 4) + n(12, 4) + n(16, 4) + n(20, 4)) / 4;

  const lo = (v: number, max: number) => clamp(1 - (v - max) / 0.5);
  const hi = (v: number, min: number) => clamp(1 - (min - v) / 0.5);

  type Template = {
    fingers: [number, number, number, number];
    thumb?: "out" | "in";
    extra?: number;
    motion?: boolean;
  };

  const T: Record<string, Template> = {
    A: { fingers: [0, 0, 0, 0], thumb: "out" },
    B: { fingers: [1, 1, 1, 1], thumb: "in" },
    C: {
      fingers: [0.5, 0.5, 0.5, 0.5],
      thumb: "out",
      extra: clamp(1 - Math.abs(ti - 0.8) / 0.8),
    },
    D: { fingers: [1, 0, 0, 0], extra: lo(tm, 0.6) },
    E: { fingers: [0, 0, 0, 0], thumb: "in" },
    F: { fingers: [0.1, 1, 1, 1], extra: lo(ti, 0.45) },
    G: { fingers: [1, 0, 0, 0], thumb: "out" },
    H: { fingers: [1, 1, 0, 0], extra: lo(im, 0.35) },
    I: { fingers: [0, 0, 0, 1], thumb: "in" },
    J: { fingers: [0, 0, 0, 1], motion: true },
    K: { fingers: [1, 1, 0, 0], extra: hi(im, 0.3) },
    L: { fingers: [1, 0, 0, 0], thumb: "out", extra: hi(ti, 0.7) },
    M: { fingers: [0, 0, 0, 0], thumb: "in" },
    N: { fingers: [0, 0, 0, 0], thumb: "in" },
    O: { fingers: [0.4, 0.4, 0.4, 0.4], extra: lo(tipsToThumb, 0.6) },
    P: { fingers: [1, 1, 0, 0], extra: hi(im, 0.25) },
    Q: { fingers: [1, 0, 0, 0], thumb: "out" },
    R: { fingers: [1, 1, 0, 0], extra: lo(im, 0.3) },
    S: { fingers: [0, 0, 0, 0] },
    T: { fingers: [0, 0, 0, 0] },
    U: { fingers: [1, 1, 0, 0], extra: lo(im, 0.35) },
    V: { fingers: [1, 1, 0, 0], extra: hi(im, 0.35) },
    W: { fingers: [1, 1, 1, 0], extra: hi(Math.min(im, mr), 0.25) },
    X: { fingers: [0.45, 0, 0, 0] },
    Y: { fingers: [0, 0, 0, 1], thumb: "out" },
    Z: { fingers: [1, 0, 0, 0], motion: true },
  };

  const scoreLetter = (letter: string) => {
    const t = T[letter];
    let sum = 0;
    let weight = 0;

    t.fingers.forEach((want, i) => {
      sum += clamp(1 - Math.abs(ext[i] - want) * 1.2);
      weight += 1;
    });

    if (t.thumb) {
      sum += (t.thumb === "out" ? thumbOut : thumbIn) * 0.5 + 0.5;
      weight += 0.7;
    }
    if (t.extra !== undefined) {
      sum += 0.3 + t.extra * 0.7;
      weight += 0.7;
    }

    let s = sum / weight;

    if (t.motion) {
      const moved =
        letter === "J"
          ? looksLikeJPath(jMovementPath)
          : looksLikeZPath(movementPath);
      s = moved ? Math.min(1, s + 0.15) : s * 0.97;
    }
    return s;
  };

  const all = Object.keys(T)
    .map((letter) => ({ letter, score: scoreLetter(letter) }))
    .sort((a, b) => b.score - a.score);

  const targetScore = scoreLetter(targetSign);
  const best = all[0];
  const rank = all.findIndex((x) => x.letter === targetSign);

  const groups = [
    ["A", "E", "M", "N", "S", "T"],
    ["G", "Q"],
    ["K", "P"],
    ["H", "U", "R", "V"],
    ["D", "X", "Z", "L"],
    ["I", "J"],
    ["O", "C"],
    ["B", "F"],
  ];
  const sameGroup = groups.some(
    (g) => g.includes(targetSign) && g.includes(best.letter)
  );

  const accepted =
    targetScore >= 0.62 ||
    (rank <= 2 && targetScore >= 0.5) ||
    (sameGroup && targetScore >= 0.45) ||
    (T[targetSign].motion && targetScore >= 0.55);

  if (accepted) {
    return {
      letter: targetSign,
      confidence: Math.min(0.95, 0.6 + targetScore * 0.35),
    };
  }

  return { letter: best.letter, confidence: Math.min(0.68, best.score * 0.7) };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DashboardPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const lastProcessRef = useRef(0);
  const movementPathRef = useRef<HandPoint[]>([]);
  const jMovementPathRef = useRef<HandPoint[]>([]);

  const lastLandmarksRef = useRef<HandPoint[]>([]);

  const captureResolveRef = useRef<
    ((landmarks: HandPoint[]) => void) | null
  >(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [targetSign, setTargetSign] = useState("A");
  const [cameraActive, setCameraActive] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [handLandmarks, setHandLandmarks] = useState<HandPoint[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<GestureResult | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [activeSection, setActiveSection] = useState("Practice");

  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  /* =========================================================
     LOAD MEDIAPIPE
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Hands) {
      initializeHands();
      return;
    }

    const existing = document.querySelector(
      'script[data-mediapipe-hands="true"]'
    );

    if (existing) return;

    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    script.crossOrigin = "anonymous";
    script.dataset.mediapipeHands = "true";

    script.onload = () => {
      initializeHands();
    };

    document.body.appendChild(script);

    function initializeHands() {
      if (!window.Hands || handsRef.current) {
        return;
      }

      const hands = new window.Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults((results: any) => {
        const landmarks = results.multiHandLandmarks?.[0] || [];

        if (captureResolveRef.current) {
          const resolve = captureResolveRef.current;
          captureResolveRef.current = null;
          resolve(landmarks);
          return;
        }

        if (landmarks.length) {
          setHandDetected(true);
          setHandLandmarks(landmarks);
          lastLandmarksRef.current = landmarks;

          const tip = landmarks[8];
          const path = movementPathRef.current;
          const previous = path[path.length - 1];
          if (
            !previous ||
            Math.hypot(tip.x - previous.x, tip.y - previous.y) > 0.006
          ) {
            path.push({ x: tip.x, y: tip.y, z: tip.z });
            if (path.length > 160) path.shift();
          }

          const pinky = landmarks[20];
          const jPath = jMovementPathRef.current;
          const previousPinky = jPath[jPath.length - 1];
          if (
            !previousPinky ||
            Math.hypot(pinky.x - previousPinky.x, pinky.y - previousPinky.y) >
              0.006
          ) {
            jPath.push({ x: pinky.x, y: pinky.y, z: pinky.z });
            if (jPath.length > 160) jPath.shift();
          }
        } else {
          setHandDetected(false);
          setHandLandmarks([]);
          lastLandmarksRef.current = [];
        }
      });

      handsRef.current = hands;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  /* =========================================================
     PROCESS CAMERA
  ========================================================= */

  const processFrame = useCallback(async (time: number) => {
    const video = videoRef.current;

    if (!video || !handsRef.current) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    if (time - lastProcessRef.current < 50) {
      animationRef.current = requestAnimationFrame(processFrame);
      return;
    }

    lastProcessRef.current = time;

    if (video.readyState >= 2) {
      try {
        await handsRef.current.send({ image: video });
      } catch {
        /* Keep camera alive if a frame fails. */
      }
    }

    animationRef.current = requestAnimationFrame(processFrame);
  }, []);

  /* =========================================================
     START CAMERA
  ========================================================= */

  const startCamera = async () => {
    setCameraError("");
    setResult(null);
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
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
      setSessionTime(0);

      animationRef.current = requestAnimationFrame(processFrame);
    } catch (error) {
      console.error(error);

      setCameraError(
        "Camera access was blocked. Please allow camera permission and try again."
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
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setHandDetected(false);
    setHandLandmarks([]);
    setCountdown(null);
    setProcessing(false);
    setCapturedImage(null);
  };

  /* =========================================================
     SESSION TIMER
  ========================================================= */

  useEffect(() => {
    if (!cameraActive) return;

    const interval = window.setInterval(() => {
      setSessionTime((value) => value + 1);
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
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /* =========================================================
     SPEECH
  ========================================================= */

  const pronounceLetter = () => {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(targetSign);

    speech.rate = 0.75;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  /* =========================================================
     SESSION RESULT TRACKING
  ========================================================= */

  const registerResult = (nextResult: GestureResult) => {
    setResult(nextResult);
    setAttempts((value) => value + 1);

    if (nextResult.status === "correct") {
      setCorrectAttempts((value) => value + 1);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }
  };

  const sessionAccuracy = attempts
    ? Math.round((correctAttempts / attempts) * 100)
    : 0;

  /* =========================================================
     CAPTURE + CHECK
  ========================================================= */

  const captureGesture = async (skipCountdown = false) => {
    if (processing || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !handsRef.current) {
      return;
    }

    setProcessing(true);
    setResult(null);
    setCapturedImage(null);

    try {
      if (!skipCountdown) {
        for (let i = 6; i >= 1; i--) {
          setCountdown(i);

          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 1000);
          });
        }
      }

      setCountdown(0);

      if (
        video.readyState < 2 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      ) {
        throw new Error("Camera frame is not ready.");
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not access capture canvas.");
      }

      context.save();
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      context.restore();

      const capturedDataUrl = canvas.toDataURL("image/jpeg", 0.92);

      setCapturedImage(capturedDataUrl);

      const capturedLandmarks = await new Promise<HandPoint[]>((resolve) => {
        captureResolveRef.current = resolve;

        handsRef.current.send({ image: canvas }).catch(() => {
          captureResolveRef.current = null;
          resolve([]);
        });
      });

      const landmarksToUse = capturedLandmarks.length
        ? capturedLandmarks
        : lastLandmarksRef.current;

      if (!landmarksToUse.length) {
        registerResult({
          status: "incorrect",
          letter: "?",
          confidence: 0,
        });
        return;
      }

      const prediction = classifyGesture(
        landmarksToUse,
        targetSign,
        movementPathRef.current,
        jMovementPathRef.current
      );

      registerResult({
        status: prediction.letter === targetSign ? "correct" : "incorrect",
        letter: prediction.letter,
        confidence: prediction.confidence,
      });
    } catch (error) {
      console.error("Automatic gesture capture failed:", error);

      registerResult({
        status: "incorrect",
        letter: "?",
        confidence: 0,
      });
    } finally {
      captureResolveRef.current = null;
      setCountdown(null);
      setProcessing(false);
    }
  };

  /* =========================================================
     AUTOMATIC PRACTICE
  ========================================================= */

  useEffect(() => {
    if (!cameraActive) return;

    const timer = window.setTimeout(() => {
      captureGesture();
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  /* =========================================================
     AUTOMATIC HAND -> 6 SECOND COUNTDOWN -> CAPTURE
  ========================================================= */

  useEffect(() => {
    if (!cameraActive || !handDetected || processing || result) {
      return;
    }

    let cancelled = false;
    let timer: number | null = null;

    const runCountdown = async () => {
      setCapturedImage(null);
      movementPathRef.current = [];
      jMovementPathRef.current = [];
      setCountdown(6);

      for (let value = 6; value >= 1; value--) {
        if (cancelled) return;

        setCountdown(value);

        await new Promise<void>((resolve) => {
          timer = window.setTimeout(resolve, 1000);
        });
      }

      if (cancelled) return;

      if (!handDetected) {
        setCountdown(null);
        return;
      }

      await captureGesture(true);
    };

    void runCountdown();

    return () => {
      cancelled = true;
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive, handDetected, targetSign, result]);

  /* =========================================================
     CHANGE LETTER
  ========================================================= */

  const selectLetter = (letter: string) => {
    setTargetSign(letter);
    setResult(null);
    setCapturedImage(null);
    setImageError(false);
    movementPathRef.current = [];
    jMovementPathRef.current = [];

    if (cameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }

      void videoRef.current.play().catch(() => {});
    }
  };

  const nextLetter = () => {
    const index = ALPHABET.indexOf(targetSign);
    const next = ALPHABET[(index + 1) % ALPHABET.length];
    selectLetter(next);
  };

  const previousLetter = () => {
    const index = ALPHABET.indexOf(targetSign);
    const previous = ALPHABET[(index - 1 + ALPHABET.length) % ALPHABET.length];
    selectLetter(previous);
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formattedTime = `${Math.floor(sessionTime / 60)
    .toString()
    .padStart(2, "0")}:${(sessionTime % 60).toString().padStart(2, "0")}`;

  /* =========================================================
     RESULT UI
  ========================================================= */

  const renderResult = () => {
    if (!result) return null;

    if (result.status === "correct") {
      return (
        <div className="result-card result-correct">
          <div className="result-icon">✓</div>

          <div>
            <strong>Correct gesture</strong>

            <span>
              You signed {targetSign} correctly. Detection confidence{" "}
              {Math.round(result.confidence * 100)}%.
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="result-card result-wrong">
        <div className="result-icon">×</div>

        <div>
          <strong>Wrong gesture</strong>

          <span>
            {result.letter === "?" ? (
              <>
                No matching gesture was found, but the target is{" "}
                <b>{targetSign}</b>.
              </>
            ) : (
              <>
                The captured gesture looks like <b>{result.letter}</b>, but the
                target is <b>{targetSign}</b>.
              </>
            )}
          </span>
        </div>
      </div>
    );
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const introRef = useRef<HTMLElement | null>(null);
  const workspaceRef = useRef<HTMLElement | null>(null);
  const alphabetRef = useRef<HTMLElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const accuracyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [result]);

  const handleNavigation = (item: string) => {
    setActiveSection(item);

    const target =
      item === "Learn"
        ? document.querySelector(".reference-panel")
        : item === "Practice"
        ? workspaceRef.current
        : item === "Alphabet"
        ? alphabetRef.current
        : item === "Accuracy"
        ? accuracyRef.current
        : workspaceRef.current;

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />
      <div className="background-glow glow-three" />

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>

          <div>
            <strong>SignLearn</strong>
            <span>Learn through signs</span>
          </div>
        </div>

        <nav className="navigation">
          {["Learn", "Practice", "Alphabet", "Accuracy"].map((item) => (
            <button
              key={item}
              className={activeSection === item ? "nav-item active" : "nav-item"}
              onClick={() => handleNavigation(item)}
            >
              <span className="nav-dot" />
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">A</div>

            <div>
              <strong>Student</strong>
              <span>Beginner level</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <section className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">PRACTICE SESSION</p>
            <h1>Learn sign language</h1>
          </div>

          <div className="session-pill">
            <span className="live-dot" />
            <span>{formattedTime}</span>
          </div>
        </header>

        <div className="content">
          {/* INTRO */}

          <section ref={introRef} className="intro">
            <div>
              <p className="section-label">ASL ALPHABET</p>

              <h2>
                Practice one sign
                <br />
                at a time.
              </h2>

              <p className="intro-text">
                Look at the reference, make the same handshape, then let the
                camera check your gesture.
              </p>
            </div>

            <div className="target-chip">
              <span>Current sign</span>
              <strong>{targetSign}</strong>
            </div>
          </section>

          {/* WORKSPACE */}

          <section ref={workspaceRef} className="workspace">
            {/* REFERENCE */}

            <div className="reference-panel">
              <div className="panel-header">
                <div>
                  <span className="small-label">REFERENCE</span>
                  <h3>Sign for {targetSign}</h3>
                </div>

                <button
                  className="sound-button"
                  onClick={pronounceLetter}
                  title="Pronounce letter"
                >
                  Speaker
                </button>
              </div>

              <div className="reference-image">
                {!imageError ? (
                  <img
                    src={SIGN_IMAGES[targetSign]}
                    alt={`ASL sign for ${targetSign}`}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="image-fallback">
                    <div className="fallback-letter">{targetSign}</div>
                    <span>ASL sign {targetSign}</span>
                  </div>
                )}
              </div>

              <div className="reference-footer">
                <div>
                  <span>Target</span>
                  <strong>{LETTER_NAMES[targetSign]}</strong>
                </div>

                <div className="letter-navigation">
                  <span>Navigate</span>

                  <div className="letter-nav-buttons">
                    <button
                      onClick={previousLetter}
                      className="next-button"
                      title="Previous sign"
                    >
                      Previous
                    </button>

                    <button
                      onClick={nextLetter}
                      className="next-button"
                      title="Next sign"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CAMERA */}

            <div className="camera-panel">
              <div className="camera-header">
                <div>
                  <span className="small-label">LIVE CAMERA</span>
                  <h3>Match the handshape</h3>
                </div>

                <div
                  className={
                    handDetected ? "detection-status detected" : "detection-status"
                  }
                >
                  <span className="status-dot" />
                  {handDetected ? "Hand detected" : "Hand not detected"}
                </div>
              </div>

              <div className="camera-stage">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  className="camera-video"
                />

                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Automatically captured gesture preview"
                    className="camera-video captured-preview"
                  />
                )}

                {!cameraActive && (
                  <div className="camera-empty">
                    <div className="camera-empty-title">Camera ready</div>

                    <p>Start your camera to practice the sign.</p>

                    <button className="primary-button" onClick={startCamera}>
                      Start camera
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <>
                    <div
                      className={handDetected ? "hand-frame visible" : "hand-frame"}
                    />

                    <div className="camera-corner top-left" />
                    <div className="camera-corner top-right" />
                    <div className="camera-corner bottom-left" />
                    <div className="camera-corner bottom-right" />

                    <div className="camera-status-overlay">
                      <span>
                        {processing
                          ? "Checking gesture..."
                          : countdown !== null
                          ? "Hold your hand steady"
                          : handDetected
                          ? "Hand detected — preparing capture"
                          : "Place your hand inside the frame"}
                      </span>
                    </div>

                    {countdown !== null && countdown > 0 && (
                      <div className="countdown">{countdown}</div>
                    )}

                    {countdown === 0 && (
                      <div className="capture-label">Checking gesture</div>
                    )}

                    {result && countdown === null && (
                      <div
                        className={`result-overlay result-overlay-${result.status}`}
                      >
                        <div className="result-overlay-icon">
                          {result.status === "correct" ? "✓" : "×"}
                        </div>

                        <div>
                          <strong>
                            {result.status === "correct"
                              ? "Correct gesture!"
                              : "Wrong gesture"}
                          </strong>

                          <span>
                            {result.status === "correct"
                              ? `You signed ${targetSign}`
                              : result.letter === "?"
                              ? `No match, target is ${targetSign}`
                              : `Looks like ${result.letter}, target is ${targetSign}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {cameraError && <div className="camera-error">{cameraError}</div>}

              <div className="camera-controls">
                {!cameraActive ? (
                  <button className="primary-button" onClick={startCamera}>
                    Start camera
                  </button>
                ) : (
                  <>
                    <button
                      className="capture-button"
                      disabled={processing}
                      onClick={() => {
                        setResult(null);
                        setCapturedImage(null);
                        setCountdown(null);
                      }}
                    >
                      {processing ? "Checking..." : "Retry sign"}
                    </button>

                    <button
                      className="secondary-button"
                      disabled={processing}
                      onClick={nextLetter}
                    >
                      Next sign
                    </button>

                    <button
                      className="secondary-button"
                      disabled={processing}
                      onClick={stopCamera}
                    >
                      Stop
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* RESULT */}

          <div ref={resultRef}>
            {renderResult()}

            {result && (
              <div className="result-actions">
                <button
                  className="action-button primary-action"
                  disabled={processing || !cameraActive}
                  onClick={() => {
                    setResult(null);
                    setCapturedImage(null);
                    setCountdown(null);
                  }}
                >
                  Retry sign
                </button>

                <button
                  className="action-button"
                  disabled={processing}
                  onClick={nextLetter}
                >
                  Next sign
                </button>

                <button
                  className="action-button"
                  onClick={() =>
                    document.querySelector(".reference-panel")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                >
                  Review reference
                </button>
              </div>
            )}
          </div>

          {/* ACCURACY */}

          <section ref={accuracyRef} className="accuracy-section">
            <div className="accuracy-header">
              <div>
                <span className="small-label">SESSION ACCURACY</span>
                <h3>Your practice results</h3>
              </div>

              <button
                className="reset-stats-button"
                onClick={() => {
                  setAttempts(0);
                  setCorrectAttempts(0);
                  setStreak(0);
                }}
              >
                Reset stats
              </button>
            </div>

            <div className="accuracy-grid">
              <div className="accuracy-card featured">
                <span>Accuracy</span>
                <strong>{sessionAccuracy}%</strong>
                <small>Across this session</small>
              </div>

              <div className="accuracy-card">
                <span>Correct</span>
                <strong>{correctAttempts}</strong>
                <small>Signs matched</small>
              </div>

              <div className="accuracy-card">
                <span>Attempts</span>
                <strong>{attempts}</strong>
                <small>Total checks</small>
              </div>

              <div className="accuracy-card">
                <span>Streak</span>
                <strong>{streak}</strong>
                <small>Correct in a row</small>
              </div>
            </div>
          </section>

          {/* ALPHABET */}

          <section ref={alphabetRef} className="alphabet-section">
            <div className="alphabet-heading">
              <div>
                <span className="small-label">ALPHABET</span>
                <h3>Choose a letter</h3>
              </div>

              <span className="alphabet-count">{ALPHABET.length} signs</span>
            </div>

            <div className="alphabet-grid">
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  className={
                    targetSign === letter ? "letter-card selected" : "letter-card"
                  }
                  onClick={() => selectLetter(letter)}
                >
                  <img src={SIGN_IMAGES[letter]} alt={`Sign ${letter}`} />
                  <span>{letter}</span>
                </button>
              ))}
            </div>
          </section>

          {/* TIP */}

          <section className="tip">
            <div className="tip-line" />

            <div>
              <strong>Practice tip</strong>

              <p>
                Keep your entire hand visible, use good lighting and keep the
                palm orientation similar to the reference image.
              </p>
            </div>
          </section>
        </div>
      </section>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* STYLES */}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #071126;
          color: #f6f7ff;
          font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        button {
          font: inherit;
        }

        button:focus-visible {
          outline: 2px solid #bca7ff;
          outline-offset: 3px;
        }

        .app {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow-x: hidden;
          background: radial-gradient(
              circle at 76% 10%,
              rgba(116, 83, 203, 0.18),
              transparent 27%
            ),
            radial-gradient(
              circle at 35% 72%,
              rgba(75, 104, 203, 0.12),
              transparent 28%
            ),
            #071126;
        }

        .background-glow {
          position: fixed;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.4;
        }

        .glow-one {
          width: 300px;
          height: 300px;
          background: #6e50c9;
          top: -140px;
          right: 18%;
        }

        .glow-two {
          width: 260px;
          height: 260px;
          background: #315eb6;
          bottom: 5%;
          left: 20%;
        }

        .glow-three {
          width: 180px;
          height: 180px;
          background: #9b79e8;
          top: 45%;
          right: -80px;
        }

        /* SIDEBAR */

        .sidebar {
          position: fixed;
          z-index: 20;
          top: 20px;
          left: 20px;
          bottom: 20px;
          width: 230px;
          padding: 22px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            rgba(20, 34, 68, 0.88),
            rgba(12, 24, 51, 0.72)
          );
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 4px 8px 30px;
        }

        .brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #bda9ff, #8063d7);
          color: white;
          font-size: 17px;
          font-weight: 750;
          box-shadow: 0 10px 25px rgba(122, 89, 208, 0.3);
        }

        .brand strong {
          display: block;
          font-size: 15px;
          letter-spacing: -0.02em;
        }

        .brand span {
          display: block;
          margin-top: 3px;
          color: #8994b0;
          font-size: 11px;
        }

        .navigation {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav-item {
          width: 100%;
          height: 44px;
          padding: 0 13px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #929db9;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
          font-weight: 550;
          transition: background 0.2s ease, color 0.2s ease,
            transform 0.2s ease;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.055);
        }

        .nav-item.active {
          color: white;
          background: linear-gradient(
            90deg,
            rgba(154, 125, 230, 0.2),
            rgba(154, 125, 230, 0.08)
          );
        }

        .nav-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #687590;
        }

        .nav-item.active .nav-dot {
          background: #bca7ff;
          box-shadow: 0 0 12px #bca7ff;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .mini-profile {
          padding: 10px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #1b2a4d;
          color: #c7baff;
          font-weight: 700;
          font-size: 12px;
        }

        .mini-profile strong {
          display: block;
          font-size: 12px;
        }

        .mini-profile span {
          display: block;
          margin-top: 2px;
          color: #75819d;
          font-size: 10px;
        }

        /* MAIN */

        .main {
          width: calc(100% - 270px);
          margin-left: 270px;
          position: relative;
          z-index: 1;
        }

        .topbar {
          min-height: 104px;
          padding: 27px 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
          background: rgba(7, 17, 38, 0.45);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .eyebrow,
        .section-label,
        .small-label {
          margin: 0;
          color: #9d8bd7;
          font-size: 10px;
          letter-spacing: 0.14em;
          font-weight: 700;
        }

        .topbar h1 {
          margin: 5px 0 0;
          font-size: 24px;
          line-height: 1.15;
          letter-spacing: -0.035em;
          font-weight: 650;
        }

        .session-pill {
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.045);
          color: #aeb9d0;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #91c9ff;
          box-shadow: 0 0 10px #91c9ff;
        }

        .content {
          width: min(1380px, calc(100% - 84px));
          margin: 0 auto;
          padding: 48px 0 70px;
        }

        /* INTRO */

        .intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 32px;
        }

        .intro h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 4vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.055em;
          font-weight: 620;
          color: #f8f8ff;
        }

        .intro-text {
          max-width: 490px;
          margin: 16px 0 0;
          color: #8995b1;
          font-size: 14px;
          line-height: 1.7;
        }

        .target-chip {
          min-width: 118px;
          padding: 15px 17px;
          border: 1px solid rgba(191, 171, 255, 0.18);
          border-radius: 16px;
          background: rgba(140, 108, 220, 0.09);
          text-align: center;
        }

        .target-chip span {
          display: block;
          color: #8d98b3;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .target-chip strong {
          display: block;
          margin-top: 3px;
          color: #c8baff;
          font-size: 26px;
          font-weight: 650;
        }

        /* WORKSPACE */

        .workspace {
          display: grid;
          grid-template-columns: minmax(300px, 0.72fr) minmax(500px, 1.45fr);
          gap: 20px;
        }

        .reference-panel,
        .camera-panel,
        .alphabet-section,
        .tip {
          border: 1px solid rgba(255, 255, 255, 0.075);
          background: linear-gradient(
            145deg,
            rgba(21, 36, 70, 0.72),
            rgba(10, 22, 48, 0.72)
          );
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 24px 65px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .reference-panel,
        .camera-panel {
          border-radius: 23px;
          overflow: hidden;
        }

        .panel-header,
        .camera-header {
          min-height: 83px;
          padding: 19px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
        }

        .panel-header h3,
        .camera-header h3,
        .alphabet-heading h3 {
          margin: 5px 0 0;
          color: #f5f6ff;
          font-size: 18px;
          font-weight: 620;
          letter-spacing: -0.025em;
        }

        .sound-button {
          padding: 8px 11px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.055);
          color: #b8c2d8;
          border: 1px solid rgba(255, 255, 255, 0.07);
          cursor: pointer;
          font-size: 11px;
        }

        .sound-button:hover {
          background: rgba(184, 164, 255, 0.12);
          color: #d5cbff;
        }

        .reference-image {
          min-height: 430px;
          display: grid;
          place-items: center;
          padding: 25px;
          background: radial-gradient(
            circle,
            rgba(158, 131, 231, 0.12),
            transparent 58%
          );
        }

        .reference-image img {
          width: 100%;
          height: 380px;
          object-fit: contain;
          filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.25));
        }

        .image-fallback {
          display: grid;
          place-items: center;
          gap: 10px;
          color: #8c98b5;
        }

        .fallback-letter {
          width: 170px;
          height: 220px;
          display: grid;
          place-items: center;
          border-radius: 30px;
          background: linear-gradient(145deg, #bca6ff, #7659ca);
          color: white;
          font-size: 100px;
          font-weight: 650;
          box-shadow: 0 25px 50px rgba(102, 74, 180, 0.28);
        }

        .reference-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
        }

        .reference-footer span {
          display: block;
          color: #74819e;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .reference-footer strong {
          display: block;
          margin-top: 3px;
          color: #d5d9e7;
          font-size: 14px;
        }

        .next-button {
          width: 30px;
          height: 30px;
          margin-top: 3px;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.055);
          color: #c1b1ff;
          cursor: pointer;
        }

        /* CAMERA */

        .detection-status {
          padding: 8px 11px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.045);
          color: #8490ab;
          border: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: 0.2s ease;
        }

        .detection-status.detected {
          color: #b9e3ff;
          background: rgba(85, 158, 220, 0.09);
          border-color: rgba(102, 179, 236, 0.18);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #687590;
        }

        .detected .status-dot {
          background: #7ac4ff;
          box-shadow: 0 0 12px #7ac4ff;
        }

        .camera-stage {
          position: relative;
          min-height: 520px;
          overflow: hidden;
          background: #020817;
        }

        .camera-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
          background: #020817;
        }

        .camera-video.captured-preview {
          transform: none;
          z-index: 3;
        }

        .camera-empty {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-content: center;
          text-align: center;
          padding: 30px;
          background: radial-gradient(
              circle at center,
              rgba(75, 61, 130, 0.24),
              transparent 45%
            ),
            #050d1e;
        }

        .camera-empty-title {
          color: #eef0fa;
          font-size: 20px;
          font-weight: 620;
        }

        .camera-empty p {
          max-width: 320px;
          margin: 9px auto 20px;
          color: #7e8ba7;
          font-size: 13px;
          line-height: 1.6;
        }

        .hand-frame {
          position: absolute;
          z-index: 2;
          left: 50%;
          top: 50%;
          width: min(70%, 430px);
          height: 72%;
          transform: translate(-50%, -50%);
          border: 1px dashed rgba(201, 186, 255, 0.28);
          border-radius: 25px;
          box-shadow: inset 0 0 60px rgba(141, 110, 215, 0.045);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .hand-frame.visible {
          border-color: rgba(117, 199, 255, 0.65);
          box-shadow: inset 0 0 50px rgba(90, 163, 230, 0.08),
            0 0 35px rgba(89, 163, 230, 0.08);
        }

        .camera-corner {
          position: absolute;
          z-index: 3;
          width: 24px;
          height: 24px;
          border-color: #bca8ff;
        }

        .top-left {
          top: 25px;
          left: 25px;
          border-left: 2px solid;
          border-top: 2px solid;
        }

        .top-right {
          top: 25px;
          right: 25px;
          border-right: 2px solid;
          border-top: 2px solid;
        }

        .bottom-left {
          bottom: 25px;
          left: 25px;
          border-left: 2px solid;
          border-bottom: 2px solid;
        }

        .bottom-right {
          bottom: 25px;
          right: 25px;
          border-right: 2px solid;
          border-bottom: 2px solid;
        }

        .camera-status-overlay {
          position: absolute;
          z-index: 4;
          left: 20px;
          bottom: 20px;
          padding: 8px 11px;
          border-radius: 10px;
          color: #e8ecf7;
          background: rgba(3, 10, 23, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          font-size: 11px;
        }

        .countdown {
          position: absolute;
          z-index: 5;
          inset: 0;
          display: grid;
          place-items: center;
          color: white;
          font-size: 110px;
          font-weight: 650;
          background: rgba(4, 10, 25, 0.28);
          text-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        }

        .capture-label {
          position: absolute;
          z-index: 5;
          left: 50%;
          top: 25px;
          transform: translateX(-50%);
          padding: 9px 14px;
          border-radius: 10px;
          color: #ded5ff;
          background: rgba(57, 38, 100, 0.78);
          border: 1px solid rgba(189, 165, 255, 0.22);
          font-size: 11px;
        }

        .camera-controls {
          padding: 16px 20px;
          display: flex;
          gap: 9px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
        }

        .primary-button,
        .capture-button,
        .secondary-button {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 11px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: transform 0.18s ease, opacity 0.18s ease,
            background 0.18s ease;
        }

        .primary-button,
        .capture-button {
          color: white;
          background: linear-gradient(135deg, #a993f2, #7358c9);
          box-shadow: 0 12px 25px rgba(103, 76, 181, 0.22);
        }

        .primary-button:hover,
        .capture-button:hover {
          transform: translateY(-1px);
        }

        .capture-button {
          flex: 1;
        }

        .capture-button:disabled {
          cursor: not-allowed;
          opacity: 0.42;
          transform: none;
        }

        .secondary-button {
          color: #aeb8ce;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .camera-error {
          margin: 12px 20px 0;
          padding: 10px 12px;
          border-radius: 10px;
          color: #ffb5c0;
          background: rgba(194, 67, 86, 0.1);
          border: 1px solid rgba(220, 86, 107, 0.14);
          font-size: 11px;
        }

        /* RESULT OVERLAY */

        .result-overlay {
          position: absolute;
          z-index: 6;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          min-width: 260px;
          padding: 12px 16px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid;
        }

        .result-overlay strong {
          display: block;
          font-size: 14px;
        }

        .result-overlay span {
          display: block;
          margin-top: 2px;
          font-size: 11px;
          opacity: 0.85;
        }

        .result-overlay-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 700;
        }

        .result-overlay-correct {
          background: rgba(20, 70, 52, 0.85);
          border-color: rgba(85, 199, 153, 0.4);
          color: #c0f0dc;
        }

        .result-overlay-correct .result-overlay-icon {
          background: rgba(85, 199, 153, 0.2);
          color: #79ddb4;
        }

        .result-overlay-incorrect {
          background: rgba(80, 30, 40, 0.85);
          border-color: rgba(218, 102, 121, 0.4);
          color: #ffd0d7;
        }

        .result-overlay-incorrect .result-overlay-icon {
          background: rgba(218, 102, 121, 0.2);
          color: #ff9eae;
        }

        /* RESULT */

        .result-card {
          margin-top: 20px;
          padding: 17px 19px;
          border-radius: 17px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1px solid;
        }

        .result-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
        }

        .result-card strong {
          display: block;
          font-size: 14px;
          font-weight: 650;
        }

        .result-card span {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          line-height: 1.5;
        }

        .result-correct {
          background: rgba(64, 164, 126, 0.09);
          border-color: rgba(85, 199, 153, 0.17);
          color: #c0f0dc;
        }

        .result-correct .result-icon {
          background: rgba(85, 199, 153, 0.14);
          color: #79ddb4;
        }

        .result-wrong {
          background: rgba(205, 94, 112, 0.09);
          border-color: rgba(218, 102, 121, 0.17);
          color: #ffd0d7;
        }

        .result-wrong .result-icon {
          background: rgba(218, 102, 121, 0.14);
          color: #ff9eae;
        }

        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 11px;
        }

        .action-button {
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.045);
          color: #d8dff0;
          border-radius: 11px;
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.075);
          border-color: rgba(193, 169, 255, 0.25);
        }

        .action-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .primary-action {
          background: linear-gradient(145deg, #9f88e8, #765fc4);
          border-color: rgba(207, 191, 255, 0.28);
          color: white;
        }

        /* ACCURACY */

        .accuracy-section {
          margin-top: 20px;
          padding: 22px;
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.065);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
        }

        .accuracy-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 17px;
        }

        .accuracy-header h3 {
          margin: 5px 0 0;
          font-size: 20px;
          color: #eef0f8;
        }

        .reset-stats-button {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: #8e9ab4;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 10px;
          cursor: pointer;
        }

        .reset-stats-button:hover {
          color: #d7def0;
          background: rgba(255, 255, 255, 0.065);
        }

        .accuracy-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .accuracy-card {
          min-height: 112px;
          padding: 16px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.055);
        }

        .accuracy-card.featured {
          background: linear-gradient(
            145deg,
            rgba(160, 133, 231, 0.16),
            rgba(111, 85, 183, 0.07)
          );
          border-color: rgba(193, 169, 255, 0.2);
        }

        .accuracy-card span,
        .accuracy-card small {
          display: block;
          color: #8490a9;
          font-size: 10px;
        }

        .accuracy-card strong {
          display: block;
          margin: 8px 0 3px;
          color: #f4f5fb;
          font-size: 28px;
          line-height: 1;
        }

        .accuracy-card.featured strong {
          color: #cfc0ff;
        }

        .letter-navigation {
          min-width: 170px;
        }

        .letter-nav-buttons {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }

        .letter-nav-buttons .next-button {
          min-width: 56px;
          padding: 7px 9px;
          font-size: 10px;
        }

        /* ALPHABET */

        .alphabet-section {
          margin-top: 20px;
          padding: 22px;
          border-radius: 21px;
        }

        .alphabet-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 18px;
        }

        .alphabet-count {
          color: #78849e;
          font-size: 11px;
        }

        .alphabet-grid {
          display: grid;
          grid-template-columns: repeat(13, minmax(45px, 1fr));
          gap: 8px;
        }

        .letter-card {
          min-height: 90px;
          padding: 7px 5px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.045);
          cursor: pointer;
          color: #aab4c9;
          transition: transform 0.18s ease, border-color 0.18s ease,
            background 0.18s ease;
        }

        .letter-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.065);
          border-color: rgba(187, 166, 250, 0.22);
        }

        .letter-card.selected {
          background: linear-gradient(
            145deg,
            rgba(160, 133, 231, 0.19),
            rgba(111, 85, 183, 0.1)
          );
          border-color: rgba(193, 169, 255, 0.38);
          color: #d8cdff;
        }

        .letter-card img {
          width: 46px;
          height: 60px;
          object-fit: contain;
          display: block;
          margin: 0 auto 3px;
          filter: brightness(0) invert(1) opacity(0.78);
        }

        .letter-card.selected img {
          filter: brightness(0) invert(82%) sepia(18%) saturate(800%)
            hue-rotate(210deg) brightness(115%);
        }

        .letter-card span {
          display: block;
          font-size: 11px;
          font-weight: 650;
        }

        /* TIP */

        .tip {
          margin-top: 20px;
          padding: 18px 20px;
          border-radius: 16px;
          display: flex;
          gap: 14px;
        }

        .tip-line {
          width: 3px;
          border-radius: 10px;
          background: #a991ed;
        }

        .tip strong {
          display: block;
          font-size: 12px;
          color: #d3c8f3;
        }

        .tip p {
          margin: 5px 0 0;
          color: #7d89a5;
          font-size: 11px;
          line-height: 1.6;
        }

        /* RESPONSIVE */

        @media (max-width: 1180px) {
          .sidebar {
            width: 200px;
          }

          .main {
            width: calc(100% - 225px);
            margin-left: 225px;
          }

          .content {
            width: calc(100% - 45px);
          }

          .workspace {
            grid-template-columns: 1fr;
          }

          .reference-image {
            min-height: 350px;
          }

          .reference-image img {
            height: 300px;
          }

          .alphabet-grid {
            grid-template-columns: repeat(13, minmax(38px, 1fr));
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            position: static;
            width: 100%;
            height: auto;
            margin: 12px;
            display: none;
          }

          .main {
            width: 100%;
            margin-left: 0;
          }

          .topbar {
            padding: 22px;
          }

          .content {
            width: calc(100% - 28px);
            padding-top: 30px;
          }

          .intro {
            align-items: flex-start;
            flex-direction: column;
          }

          .intro h2 {
            font-size: 38px;
          }

          .target-chip {
            align-self: flex-start;
          }

          .camera-stage {
            min-height: 430px;
          }

          .alphabet-grid {
            grid-template-columns: repeat(6, 1fr);
          }

          .accuracy-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .topbar h1 {
            font-size: 20px;
          }

          .session-pill {
            display: none;
          }

          .intro h2 {
            font-size: 34px;
          }

          .panel-header,
          .camera-header {
            padding: 16px;
          }

          .camera-header {
            align-items: flex-start;
            gap: 10px;
            flex-direction: column;
          }

          .camera-stage {
            min-height: 390px;
          }

          .reference-image {
            min-height: 300px;
          }

          .reference-image img {
            height: 270px;
          }

          .alphabet-section {
            padding: 16px;
          }

          .accuracy-section {
            padding: 16px;
          }

          .accuracy-header {
            align-items: flex-start;
          }

          .accuracy-grid {
            grid-template-columns: 1fr 1fr;
          }

          .alphabet-grid {
            grid-template-columns: repeat(5, 1fr);
          }

          .letter-card {
            min-height: 84px;
          }

          .letter-card img {
            width: 40px;
            height: 53px;
          }
        }
      `}</style>
    </main>
  );
}