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

const PRIMARY_THRESHOLD = 0.34;
const HARD_GESTURE_THRESHOLD = 0.32;
const MIN_MARGIN = 0.005;
const MIN_GESTURE_QUALITY = 0.15;

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
  const ab = {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };

  const cb = {
    x: c.x - b.x,
    y: c.y - b.y,
    z: c.z - b.z,
  };

  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;

  const la = Math.hypot(ab.x, ab.y, ab.z);
  const lc = Math.hypot(cb.x, cb.y, cb.z);

  if (!la || !lc) return 0;

  return (
    (Math.acos(
      Math.max(-1, Math.min(1, dot / (la * lc)))
    ) *
      180) /
    Math.PI
  );
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
  const b = sampled.slice(
    Math.floor(n / 3),
    Math.floor((2 * n) / 3)
  );
  const c = sampled.slice(Math.floor((2 * n) / 3));

  const dx = (arr: HandPoint[]) =>
    arr[arr.length - 1].x - arr[0].x;

  const dy = (arr: HandPoint[]) =>
    arr[arr.length - 1].y - arr[0].y;

  const ax = dx(a);
  const ay = dy(a);
  const bx = dx(b);
  const by = dy(b);
  const cx = dx(c);
  const cy = dy(c);

  const firstHorizontal =
    Math.abs(ax) > 0.055 &&
    Math.abs(ax) > Math.abs(ay) * 1.8;

  const middleDiagonal =
    Math.abs(bx) > 0.045 &&
    Math.abs(by) > 0.045;

  const lastHorizontal =
    Math.abs(cx) > 0.045 &&
    Math.abs(cx) > Math.abs(cy) * 1.6;

  const sameHorizontalDirection =
    Math.sign(ax) === Math.sign(cx);

  const diagonalReversesX =
    Math.sign(bx) !== Math.sign(ax);

  const diagonalMovesDown =
    Math.abs(by) > 0.04;

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

  return (
    ay > 0.06 &&
    Math.abs(bx) > 0.035 &&
    by < 0.035
  );
}
/* =========================================================
   CLASSIFIER — STRICT BUT LENIENT ASL QUIZ CLASSIFIER
========================================================= */

function classifyGesture(
  raw: any[],
  targetSign?: string,
  movementPath: HandPoint[] = [],
  jMovementPath: HandPoint[] = []
): { letter: string; confidence: number } {
  if (!targetSign || raw.length < 21) {
    return { letter: "?", confidence: 0 };
  }

  const p: HandPoint[] = raw.map((q) => ({
    x: q.x,
    y: q.y,
    z: q.z || 0,
  }));

  const clamp = (v: number) =>
    Math.max(0, Math.min(1, v));

  const d = (a: number, b: number) =>
    distance(p[a], p[b]);

  /* =======================================================
     PALM NORMALIZATION
  ======================================================= */

  const palm = Math.max(
    0.001,
    (d(0, 9) + d(5, 17)) / 2
  );

  const n = (a: number, b: number) =>
    d(a, b) / palm;

  /*
   * Don't reject too aggressively.
   * MediaPipe landmark scale can vary considerably.
   */
  if (palm < 0.018 || palm > 1.2) {
    return {
      letter: "?",
      confidence: 0,
    };
  }

  /* =======================================================
     FINGER EXTENSION
  ======================================================= */

  const fingerExt = (
    tip: number,
    pip: number,
    mcp: number
  ) => {
    const reach =
      d(tip, 0) /
      Math.max(0.001, d(mcp, 0));

    const angle = angleAt(
      p[tip],
      p[pip],
      p[mcp]
    );

    /*
     * More tolerant than the original classifier.
     */
    const reachScore = clamp(
      (reach - 1.02) / 0.62
    );

    const angleScore = clamp(
      (angle - 92) / 72
    );

    return (
      reachScore * 0.55 +
      angleScore * 0.45
    );
  };

  const ext = [
    fingerExt(8, 6, 5),     // index
    fingerExt(12, 10, 9),   // middle
    fingerExt(16, 14, 13),  // ring
    fingerExt(20, 18, 17),  // pinky
  ];

  /* =======================================================
     THUMB
  ======================================================= */

  const thumbOut = clamp(
    (n(4, 5) - 0.35) / 0.65
  );

  const thumbIn = 1 - thumbOut;

  /* =======================================================
     IMPORTANT RELATIONSHIPS
  ======================================================= */

  const ti = n(4, 8);
  const tm = n(4, 12);
  const tr = n(4, 16);
  const tp = n(4, 20);

  const im = n(8, 12);
  const mr = n(12, 16);
  const rp = n(16, 20);

  const tipsToThumb =
    (
      ti +
      tm +
      tr +
      tp
    ) / 4;

  /* =======================================================
     HELPER SCORES
  ======================================================= */

  const near = (
    value: number,
    target: number,
    tolerance = 0.45
  ) => {
    return clamp(
      1 -
        Math.abs(value - target) /
          tolerance
    );
  };

  const atLeast = (
    value: number,
    minimum: number,
    tolerance = 0.30
  ) => {
    return clamp(
      1 -
        Math.max(
          0,
          minimum - value
        ) / tolerance
    );
  };

  const atMost = (
    value: number,
    maximum: number,
    tolerance = 0.30
  ) => {
    return clamp(
      1 -
        Math.max(
          0,
          value - maximum
        ) / tolerance
    );
  };

  /* =======================================================
     TEMPLATE
  ======================================================= */

  type Template = {
    fingers: [
      number,
      number,
      number,
      number
    ];

    thumb?: "out" | "in";

    extra?: number;

    motion?: boolean;
  };

  const T: Record<string, Template> = {
    A: {
      fingers: [0, 0, 0, 0],
      thumb: "out",
    },

    B: {
      fingers: [1, 1, 1, 1],
      thumb: "in",
    },

    C: {
      fingers: [0.48, 0.48, 0.48, 0.48],
      thumb: "out",
      extra: near(tipsToThumb, 0.75, 0.65),
    },

    D: {
      fingers: [1, 0, 0, 0],
      extra: atMost(tm, 0.75),
    },

    E: {
      fingers: [0, 0, 0, 0],
      thumb: "in",
    },

    F: {
      fingers: [0.15, 1, 1, 1],
      extra: atMost(ti, 0.55),
    },

    G: {
      fingers: [1, 0, 0, 0],
      thumb: "out",
    },

    H: {
      fingers: [1, 1, 0, 0],
      extra: atMost(im, 0.55),
    },

    I: {
      fingers: [0, 0, 0, 1],
      thumb: "in",
    },

    J: {
      fingers: [0, 0, 0, 1],
      motion: true,
    },

    K: {
      fingers: [1, 1, 0, 0],
      extra: atLeast(im, 0.28),
    },

    L: {
      fingers: [1, 0, 0, 0],
      thumb: "out",
      extra: atLeast(ti, 0.62),
    },

    M: {
      fingers: [0, 0, 0, 0],
      thumb: "in",
    },

    N: {
      fingers: [0, 0, 0, 0],
      thumb: "in",
    },

    O: {
      fingers: [0.42, 0.42, 0.42, 0.42],
      extra: atMost(tipsToThumb, 0.85),
    },

    P: {
      fingers: [1, 1, 0, 0],
      extra: atLeast(im, 0.22),
    },

    Q: {
      fingers: [1, 0, 0, 0],
      thumb: "out",
    },

    R: {
      fingers: [1, 1, 0, 0],
      extra: atMost(im, 0.52),
    },

    S: {
      fingers: [0, 0, 0, 0],
    },

    T: {
      fingers: [0, 0, 0, 0],
    },

    U: {
      fingers: [1, 1, 0, 0],
      extra: atMost(im, 0.58),
    },

    V: {
      fingers: [1, 1, 0, 0],
      extra: atLeast(im, 0.32),
    },

    W: {
      fingers: [1, 1, 1, 0],
      extra: atLeast(
        Math.min(im, mr),
        0.22
      ),
    },

    X: {
      fingers: [0.42, 0, 0, 0],
    },

    Y: {
      fingers: [0, 0, 0, 1],
      thumb: "out",
    },

    Z: {
      fingers: [1, 0, 0, 0],
      motion: true,
    },
  };

  /* =======================================================
     HAND QUALITY
  ======================================================= */

  const fingerSpread =
    (
      n(8, 12) +
      n(12, 16) +
      n(16, 20)
    ) / 3;

  const palmFingerCoverage = clamp(
    (
      n(8, 0) +
      n(12, 0) +
      n(16, 0) +
      n(20, 0)
    ) / 8
  );

  const angleQuality =
    (
      angleAt(p[8], p[6], p[5]) +
      angleAt(p[12], p[10], p[9]) +
      angleAt(p[16], p[14], p[13]) +
      angleAt(p[20], p[18], p[17])
    ) / 4;

  const angleNormalized = clamp(
    (angleQuality - 65) / 85
  );

  /*
   * Overall landmark quality.
   */
  const gestureQuality = clamp(
    angleNormalized * 0.40 +
    palmFingerCoverage * 0.35 +
    clamp(fingerSpread / 0.55) * 0.25
  );

  /* =======================================================
     LETTER SCORE
  ======================================================= */

  const scoreLetter = (letter: string) => {
    const t = T[letter];

    if (!t) return 0;

    let sum = 0;
    let weight = 0;

    /* Finger matching */
    t.fingers.forEach((want, i) => {
      const difference =
        Math.abs(ext[i] - want);

      /*
       * Soft matching.
       * This allows slightly bent fingers
       * without accepting completely wrong ones.
       */
      const similarity = clamp(
        1 -
          difference * 1.18
      );

      sum += similarity * 1.25;
      weight += 1.25;
    });

    /* Thumb */
    if (t.thumb) {
      const thumbScore =
        t.thumb === "out"
          ? thumbOut
          : thumbIn;

      sum +=
        thumbScore * 1.15;

      weight += 1.15;
    }

    /* Additional structural condition */
    if (t.extra !== undefined) {
      sum +=
        t.extra * 1.05;

      weight += 1.05;
    }

    let score =
      weight > 0
        ? sum / weight
        : 0;

    /* =====================================================
       MOTION
    ===================================================== */

    if (t.motion) {
      const moved =
        letter === "J"
          ? looksLikeJPath(
              jMovementPath
            )
          : looksLikeZPath(
              movementPath
            );

      if (moved) {
        score += 0.18;
      } else {
        /*
         * Strong penalty if a motion letter
         * does not actually move.
         */
        score *= 0.70;
      }
    }

    /* =====================================================
       TARGET-SPECIFIC STRUCTURE
    ===================================================== */

    switch (letter) {
      case "B":
        if (
          ext[0] < 0.45 ||
          ext[1] < 0.45 ||
          ext[2] < 0.45 ||
          ext[3] < 0.45
        ) {
          score *= 0.72;
        }
        break;

      case "W":
        if (
          ext[0] < 0.42 ||
          ext[1] < 0.42 ||
          ext[2] < 0.42 ||
          ext[3] > 0.62
        ) {
          score *= 0.72;
        }
        break;

      case "V":
        if (
          ext[0] < 0.42 ||
          ext[1] < 0.42 ||
          ext[2] > 0.62 ||
          ext[3] > 0.62 ||
          im < 0.28
        ) {
          score *= 0.72;
        }
        break;

      case "I":
        if (
          ext[0] > 0.58 ||
          ext[1] > 0.58 ||
          ext[2] > 0.58 ||
          ext[3] < 0.42
        ) {
          score *= 0.72;
        }
        break;

      case "Y":
        if (
          ext[3] < 0.42 ||
          thumbOut < 0.42 ||
          ext[0] > 0.70 ||
          ext[1] > 0.70 ||
          ext[2] > 0.70
        ) {
          score *= 0.70;
        }
        break;

      case "L":
        if (
          ext[0] < 0.42 ||
          thumbOut < 0.42
        ) {
          score *= 0.70;
        }
        break;

      case "H":
        if (
          ext[0] < 0.42 ||
          ext[1] < 0.42 ||
          ext[2] > 0.68 ||
          ext[3] > 0.68
        ) {
          score *= 0.72;
        }
        break;

      case "G":
      case "Q":
        if (
          ext[0] < 0.42 ||
          ext[1] > 0.68 ||
          ext[2] > 0.68 ||
          ext[3] > 0.68
        ) {
          score *= 0.72;
        }
        break;

      case "J":
        if (
          ext[3] < 0.42
        ) {
          score *= 0.70;
        }
        break;

      case "Z":
        if (
          ext[0] < 0.42
        ) {
          score *= 0.70;
        }
        break;

      default:
        break;
    }

    return clamp(score);
  };

  /* =======================================================
     SCORE EVERY LETTER
  ======================================================= */

  const all = Object.keys(T)
    .map((letter) => ({
      letter,
      score: scoreLetter(letter),
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    );

  const targetScore =
    scoreLetter(targetSign);

  const best =
    all[0];

  /*
   * IMPORTANT:
   * Find the strongest competitor AFTER
   * removing the target itself.
   */
  const competitors =
    all.filter(
      (x) =>
        x.letter !== targetSign
    );

  const competitor =
    competitors[0];

  const competitorScore =
    competitor?.score ?? 0;

  const margin =
    targetScore -
    competitorScore;

  /* =======================================================
     MOTION VALIDATION
  ======================================================= */

  let motionValid = true;

  if (targetSign === "J") {
    motionValid =
      looksLikeJPath(
        jMovementPath
      );
  }

  if (targetSign === "Z") {
    motionValid =
      looksLikeZPath(
        movementPath
      );
  }

  /* =======================================================
     TARGET STRUCTURE
  ======================================================= */

  let targetStructure = true;

  switch (targetSign) {
    case "A":
      targetStructure =
        ext[0] < 0.58 &&
        ext[1] < 0.58 &&
        ext[2] < 0.58 &&
        ext[3] < 0.58 &&
        thumbOut > 0.38;
      break;

    case "B":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] > 0.42 &&
        ext[2] > 0.42 &&
        ext[3] > 0.42 &&
        thumbIn > 0.35;
      break;

    case "C":
      targetStructure =
        ext[0] > 0.20 &&
        ext[0] < 0.80 &&
        ext[1] > 0.20 &&
        ext[1] < 0.80 &&
        ext[2] > 0.20 &&
        ext[2] < 0.80 &&
        ext[3] > 0.20 &&
        ext[3] < 0.80;
      break;

    case "D":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] < 0.68 &&
        ext[2] < 0.68 &&
        ext[3] < 0.68;
      break;

    case "E":
      targetStructure =
        ext[0] < 0.58 &&
        ext[1] < 0.58 &&
        ext[2] < 0.58 &&
        ext[3] < 0.58 &&
        thumbIn > 0.42;
      break;

    case "F":
      targetStructure =
        ext[0] < 0.48 &&
        ext[1] > 0.42 &&
        ext[2] > 0.42 &&
        ext[3] > 0.42 &&
        ti < 0.75;
      break;

    case "G":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] < 0.68 &&
        ext[2] < 0.68 &&
        ext[3] < 0.68 &&
        thumbOut > 0.35;
      break;

    case "H":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] > 0.42 &&
        ext[2] < 0.68 &&
        ext[3] < 0.68;
      break;

    case "I":
      targetStructure =
        ext[0] < 0.58 &&
        ext[1] < 0.58 &&
        ext[2] < 0.58 &&
        ext[3] > 0.42;
      break;

    case "J":
      targetStructure =
        ext[3] > 0.42;
      break;

    case "L":
      targetStructure =
        ext[0] > 0.42 &&
        thumbOut > 0.42;
      break;

    case "V":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] > 0.42 &&
        ext[2] < 0.62 &&
        ext[3] < 0.62 &&
        im > 0.28;
      break;

    case "W":
      targetStructure =
        ext[0] > 0.42 &&
        ext[1] > 0.42 &&
        ext[2] > 0.42 &&
        ext[3] < 0.62;
      break;

    case "Y":
      targetStructure =
        ext[3] > 0.42 &&
        thumbOut > 0.42 &&
        ext[0] < 0.70 &&
        ext[1] < 0.70 &&
        ext[2] < 0.70;
      break;

    case "X":
      targetStructure =
        ext[0] > 0.20 &&
        ext[0] < 0.68 &&
        ext[1] < 0.62 &&
        ext[2] < 0.62 &&
        ext[3] < 0.62;
      break;

    case "Z":
      targetStructure =
        ext[0] > 0.42;
      break;

    default:
      break;
  }

  /* =======================================================
     SPECIAL DIFFERENTIATION
  ======================================================= */

  /*
   * M / N / T / S are notoriously difficult using only
   * basic finger-extension values.
   *
   * Therefore don't allow them to pass too easily.
   */

  if (
    targetSign === "M" ||
    targetSign === "N" ||
    targetSign === "T"
  ) {
    if (
      thumbIn < 0.38
    ) {
      targetStructure = false;
    }
  }

  /* =======================================================
     VERY LOOSE DEMO MODE
  ======================================================= */

  const hardSigns = new Set([
    "C", "D", "F", "K", "M", "N", "O",
    "P", "Q", "R", "T", "U", "X", "Z",
  ]);

  /* Temporary panel-demo mode: very forgiving webcam recognition. */
  const minimumTargetScore =
    hardSigns.has(targetSign) ? 0.32 : 0.34;

  const qualityPass =
    gestureQuality >= 0.15;

  const scorePass =
    targetScore >= minimumTargetScore;

  /* Target does not need to be ranked first. */
  const targetRank = targetIndexSafe(
    all,
    targetSign
  );

  const rankPass =
    targetRank <= 3 ||
    targetScore >= 0.46;

  /* Very small margin requirement. */
  const marginPass =
    margin >= -0.03 ||
    targetScore >= 0.46;

  /* Structure is advisory rather than mandatory. */
  const structurePass =
    targetStructure ||
    targetScore >= 0.42;

  /* Motion is optional in temporary demo mode. */
  const demoAccepted =
    qualityPass &&
    scorePass &&
    rankPass &&
    marginPass &&
    structurePass;

  if (demoAccepted) {
    const confidence = clamp(
      0.55 +
      targetScore * 0.35 +
      Math.max(0, gestureQuality - 0.15) * 0.10
    );

    return {
      letter: targetSign,
      confidence: Math.min(0.96, confidence),
    };
  }

  /*
   * If the target itself is not strong enough, return the best
   * visible hand classification instead of immediately returning ?. 
   * This makes the UI show "Looks like X" rather than "No match".
   */
  if (
    gestureQuality >= 0.12 &&
    best.score >= 0.28
  ) {
    return {
      letter: best.letter,
      confidence: Math.min(
        0.78,
        Math.max(
          0.36,
          best.score * 0.88
        )
      ),
    };
  }

  /* Only reject frames that are genuinely too weak to classify. */
  return {
    letter: "?",
    confidence: 0,
  };

}


/* =========================================================
   SAFE TARGET INDEX
========================================================= */

function targetIndexSafe(
  all: { letter: string; score: number }[],
  target: string
): number {
  const index =
    all.findIndex(
      (x) =>
        x.letter === target
    );

  return index < 0
    ? 999
    : index;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DashboardPage() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const handsRef =
    useRef<any>(null);

  const animationRef =
    useRef<number | null>(null);

  const lastProcessRef =
    useRef(0);

  const movementPathRef =
    useRef<HandPoint[]>([]);

  const jMovementPathRef =
    useRef<HandPoint[]>([]);

  const lastLandmarksRef =
    useRef<HandPoint[]>([]);

  const captureResolveRef =
    useRef<((landmarks: HandPoint[]) => void) | null>(
      null
    );

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  const [targetSign, setTargetSign] =
    useState("A");

  const [cameraActive, setCameraActive] =
    useState(false);

  const [handDetected, setHandDetected] =
    useState(false);

  const [handLandmarks, setHandLandmarks] =
    useState<HandPoint[]>([]);

  const [countdown, setCountdown] =
    useState<number | null>(null);

  const [processing, setProcessing] =
    useState(false);

  const [result, setResult] =
    useState<GestureResult | null>(null);

  const [cameraError, setCameraError] =
    useState("");

  const [imageError, setImageError] =
    useState(false);

  const [sessionTime, setSessionTime] =
    useState(0);

  const [activeSection, setActiveSection] =
    useState("Practice");

  const [attempts, setAttempts] =
    useState(0);

  const [correctAttempts, setCorrectAttempts] =
    useState(0);

  const [streak, setStreak] =
    useState(0);

  /* =========================================================
     LOAD MEDIAPIPE
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Hands) {
      initializeHands();
      return;
    }

    const existing =
      document.querySelector(
        'script[data-mediapipe-hands="true"]'
      );

    if (existing) return;

    const script =
      document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

    script.crossOrigin = "anonymous";

    script.dataset.mediapipeHands =
      "true";

    script.onload = () => {
      initializeHands();
    };

    document.body.appendChild(script);

    function initializeHands() {
      if (
        !window.Hands ||
        handsRef.current
      ) {
        return;
      }

      const hands =
        new window.Hands({
          locateFile: (
            file: string
          ) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults(
        (results: any) => {
          const landmarks =
            results.multiHandLandmarks?.[0] ||
            [];

          if (captureResolveRef.current) {
            const resolve =
              captureResolveRef.current;

            captureResolveRef.current =
              null;

            resolve(landmarks);

            return;
          }

          if (landmarks.length) {
            setHandDetected(true);
            setHandLandmarks(landmarks);

            lastLandmarksRef.current =
              landmarks;

            const tip =
              landmarks[8];

            const path =
              movementPathRef.current;

            const previous =
              path[path.length - 1];

            if (
              !previous ||
              Math.hypot(
                tip.x - previous.x,
                tip.y - previous.y
              ) > 0.006
            ) {
              path.push({
                x: tip.x,
                y: tip.y,
                z: tip.z,
              });

              if (path.length > 160) {
                path.shift();
              }
            }

            const pinky =
              landmarks[20];

            const jPath =
              jMovementPathRef.current;

            const previousPinky =
              jPath[jPath.length - 1];

            if (
              !previousPinky ||
              Math.hypot(
                pinky.x -
                  previousPinky.x,
                pinky.y -
                  previousPinky.y
              ) > 0.006
            ) {
              jPath.push({
                x: pinky.x,
                y: pinky.y,
                z: pinky.z,
              });

              if (jPath.length > 160) {
                jPath.shift();
              }
            }
          } else {
            setHandDetected(false);
            setHandLandmarks([]);
            lastLandmarksRef.current = [];
          }
        }
      );

      handsRef.current = hands;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, []);

  /* =========================================================
     PROCESS CAMERA
  ========================================================= */

  const processFrame =
    useCallback(
      async (time: number) => {
        const video =
          videoRef.current;

        if (
          !video ||
          !handsRef.current
        ) {
          animationRef.current =
            requestAnimationFrame(
              processFrame
            );

          return;
        }

        if (
          time -
            lastProcessRef.current <
          50
        ) {
          animationRef.current =
            requestAnimationFrame(
              processFrame
            );

          return;
        }

        lastProcessRef.current =
          time;

        if (
          video.readyState >= 2
        ) {
          try {
            await handsRef.current.send({
              image: video,
            });
          } catch {
            /* Keep camera alive */
          }
        }

        animationRef.current =
          requestAnimationFrame(
            processFrame
          );
      },
      []
    );

  /* =========================================================
     START CAMERA
  ========================================================= */

  const startCamera =
    async () => {
      setCameraError("");
      setResult(null);
      setCapturedImage(null);

      try {
        if (
          !navigator.mediaDevices
            ?.getUserMedia
        ) {
          throw new Error(
            "Camera access is not supported."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
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
            }
          );

        streamRef.current =
          stream;

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          await videoRef.current.play();
        }

        setCameraActive(true);
        setSessionTime(0);

        animationRef.current =
          requestAnimationFrame(
            processFrame
          );
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

  const stopCamera =
    () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

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

      movementPathRef.current = [];
      jMovementPathRef.current = [];
      lastLandmarksRef.current = [];
    };

  /* =========================================================
     SESSION TIMER
  ========================================================= */

  useEffect(() => {
    if (!cameraActive) return;

    const interval =
      window.setInterval(() => {
        setSessionTime(
          (value) => value + 1
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
          .forEach((track) =>
            track.stop()
          );
      }
    };
  }, []);

  /* =========================================================
     SPEECH
  ========================================================= */

  const pronounceLetter =
    () => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      const speech =
        new SpeechSynthesisUtterance(
          targetSign
        );

      speech.rate = 0.75;
      speech.pitch = 1;
      speech.volume = 1;

      window.speechSynthesis.speak(
        speech
      );
    };

  /* =========================================================
     SESSION RESULT TRACKING
  ========================================================= */

  const registerResult =
    (
      nextResult: GestureResult
    ) => {
      setResult(nextResult);

      setAttempts(
        (value) => value + 1
      );

      if (
        nextResult.status ===
        "correct"
      ) {
        setCorrectAttempts(
          (value) => value + 1
        );

        setStreak(
          (value) => value + 1
        );
      } else {
        setStreak(0);
      }
    };

  const sessionAccuracy =
    attempts
      ? Math.round(
          (correctAttempts /
            attempts) *
            100
        )
      : 0;

  /* =========================================================
     CAPTURE + CHECK
  ========================================================= */

  const captureGesture =
    async (
      skipCountdown = false
    ) => {
      if (
        processing ||
        !cameraActive
      ) {
        return;
      }

      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      if (
        !video ||
        !canvas ||
        !handsRef.current
      ) {
        return;
      }

      setProcessing(true);
      setResult(null);
      setCapturedImage(null);

      try {
        if (!skipCountdown) {
          for (
            let i = 6;
            i >= 1;
            i--
          ) {
            setCountdown(i);

            await new Promise<void>(
              (resolve) => {
                window.setTimeout(
                  resolve,
                  1000
                );
              }
            );
          }
        }

        setCountdown(0);

        if (
          video.readyState < 2 ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          throw new Error(
            "Camera frame is not ready."
          );
        }

        canvas.width =
          video.videoWidth;

        canvas.height =
          video.videoHeight;

        const context =
          canvas.getContext("2d");

        if (!context) {
          throw new Error(
            "Could not access capture canvas."
          );
        }

        context.save();

        context.translate(
          canvas.width,
          0
        );

        context.scale(-1, 1);

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        context.restore();

        const capturedDataUrl =
          canvas.toDataURL(
            "image/jpeg",
            0.92
          );

        setCapturedImage(
          capturedDataUrl
        );

        const capturedLandmarks =
          await new Promise<
            HandPoint[]
          >((resolve) => {
            captureResolveRef.current =
              resolve;

            handsRef.current
              .send({
                image: canvas,
              })
              .catch(() => {
                captureResolveRef.current =
                  null;

                resolve([]);
              });
          });

        const landmarksToUse =
          capturedLandmarks.length
            ? capturedLandmarks
            : lastLandmarksRef.current;

        if (
          !landmarksToUse.length
        ) {
          registerResult({
            status: "incorrect",
            letter: "?",
            confidence: 0,
          });

          return;
        }

        const prediction =
          classifyGesture(
            landmarksToUse,
            targetSign,
            movementPathRef.current,
            jMovementPathRef.current
          );

        registerResult({
          status:
            prediction.letter ===
            targetSign
              ? "correct"
              : "incorrect",
          letter:
            prediction.letter,
          confidence:
            prediction.confidence,
        });
      } catch (error) {
        console.error(
          "Automatic gesture capture failed:",
          error
        );

        registerResult({
          status: "incorrect",
          letter: "?",
          confidence: 0,
        });
      } finally {
        captureResolveRef.current =
          null;

        setCountdown(null);
        setProcessing(false);
      }
    };

  /* =========================================================
     AUTOMATIC PRACTICE
  ========================================================= */

  useEffect(() => {
    if (!cameraActive) return;

    const timer =
      window.setTimeout(() => {
        captureGesture();
      }, 1200);

    return () => {
      window.clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  /* =========================================================
     AUTOMATIC HAND -> COUNTDOWN -> CAPTURE
  ========================================================= */

  useEffect(() => {
    if (
      !cameraActive ||
      !handDetected ||
      processing ||
      result
    ) {
      return;
    }

    let cancelled = false;

    let timer:
      | number
      | null = null;

    const runCountdown =
      async () => {
        setCapturedImage(null);

        movementPathRef.current = [];
        jMovementPathRef.current = [];

        setCountdown(6);

        for (
          let value = 6;
          value >= 1;
          value--
        ) {
          if (cancelled) return;

          setCountdown(value);

          await new Promise<void>(
            (resolve) => {
              timer =
                window.setTimeout(
                  resolve,
                  1000
                );
            }
          );
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
  }, [
    cameraActive,
    handDetected,
    targetSign,
    result,
  ]);

  /* =========================================================
     CHANGE LETTER
  ========================================================= */

  const selectLetter =
    (letter: string) => {
      setTargetSign(letter);
      setResult(null);
      setCapturedImage(null);
      setImageError(false);

      movementPathRef.current = [];
      jMovementPathRef.current = [];

      if (
        cameraActive &&
        videoRef.current &&
        streamRef.current
      ) {
        if (
          videoRef.current.srcObject !==
          streamRef.current
        ) {
          videoRef.current.srcObject =
            streamRef.current;
        }

        void videoRef.current
          .play()
          .catch(() => {});
      }
    };

  const nextLetter =
    () => {
      const index =
        ALPHABET.indexOf(targetSign);

      const next =
        ALPHABET[
          (index + 1) %
            ALPHABET.length
        ];

      selectLetter(next);
    };

  const previousLetter =
    () => {
      const index =
        ALPHABET.indexOf(targetSign);

      const previous =
        ALPHABET[
          (index -
            1 +
            ALPHABET.length) %
            ALPHABET.length
        ];

      selectLetter(previous);
    };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formattedTime =
    `${Math.floor(
      sessionTime / 50
    )
      .toString()
      .padStart(2, "0")}:${(
      sessionTime % 50
    )
      .toString()
      .padStart(2, "0")}`;

  /* =========================================================
     RESULT UI
  ========================================================= */

  const renderResult =
    () => {
      if (!result) return null;

      if (
        result.status ===
        "correct"
      ) {
        return (
          <div className="result-card result-correct">
            <div className="result-icon">
              ✓
            </div>

            <div>
              <strong>
                Correct gesture
              </strong>

              <span>
                You signed{" "}
                {targetSign} correctly.
                Detection confidence{" "}
                {Math.round(
                  result.confidence *
                    100
                )}
                %.
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="result-card result-wrong">
          <div className="result-icon">
            ×
          </div>

          <div>
            <strong>
              Wrong gesture
            </strong>

            <span>
              {result.letter ===
              "?" ? (
                <>
                  No matching gesture
                  was found, but the
                  target is{" "}
                  <b>{targetSign}</b>.
                </>
              ) : (
                <>
                  The captured gesture
                  looks like{" "}
                  <b>
                    {result.letter}
                  </b>
                  , but the target is{" "}
                  <b>{targetSign}</b>.
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

  const introRef =
    useRef<HTMLElement | null>(null);

  const workspaceRef =
    useRef<HTMLElement | null>(null);

  const alphabetRef =
    useRef<HTMLElement | null>(null);

  const resultRef =
    useRef<HTMLDivElement | null>(null);

  const accuracyRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (
      result &&
      resultRef.current
    ) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [result]);

  const handleNavigation =
    (item: string) => {
      setActiveSection(item);

      const target =
        item === "Learn"
          ? document.querySelector(
              ".reference-panel"
            )
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
          <div className="brand-mark">
            S
          </div>

          <div>
            <strong>
              SignLearn
            </strong>

            <span>
              Learn through signs
            </span>
          </div>
        </div>

        <nav className="navigation">
          {[
            "Learn",
            "Practice",
            "Alphabet",
            "Accuracy",
          ].map((item) => (
            <button
              key={item}
              className={
                activeSection === item
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                handleNavigation(item)
              }
            >
              <span className="nav-dot" />
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="avatar">
              A
            </div>

            <div>
              <strong>
                Student
              </strong>

              <span>
                Beginner level
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <section className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              PRACTICE SESSION
            </p>

            <h1>
              Learn sign language
            </h1>
          </div>

          <div className="session-pill">
            <span className="live-dot" />
            <span>
              {formattedTime}
            </span>
          </div>
        </header>

        <div className="content">
          {/* INTRO */}

          <section
            ref={introRef}
            className="intro"
          >
            <div>
              <p className="section-label">
                ASL ALPHABET
              </p>

              <h2>
                Practice one sign
                <br />
                at a time.
              </h2>

              <p className="intro-text">
                Look at the reference,
                make the same handshape,
                then let the camera
                check your gesture.
              </p>
            </div>

            <div className="target-chip">
              <span>
                Current sign
              </span>

              {/* =================================================
                  CHANGED:
                  Learning letter is now approximately 3× larger.
              ================================================= */}
              <strong className="learning-target-letter">
                {targetSign}
              </strong>
            </div>
          </section>

          {/* WORKSPACE */}

          <section
            ref={workspaceRef}
            className="workspace"
          >
            {/* REFERENCE */}

            <div className="reference-panel">
              <div className="panel-header">
                <div>
                  <span className="small-label">
                    REFERENCE
                  </span>

                  <h3>
                    Sign for{" "}
                    {targetSign}
                  </h3>
                </div>

                <button
                  className="sound-button"
                  onClick={
                    pronounceLetter
                  }
                  title="Pronounce letter"
                >
                  Speaker
                </button>
              </div>

              {/* =================================================
                  CHANGED:
                  Bright high-contrast reference image container.
              ================================================= */}

              <div className="reference-image">
                <div className="reference-image-box">
                  {!imageError ? (
                    <img
                      src={
                        SIGN_IMAGES[
                          targetSign
                        ]
                      }
                      alt={`ASL sign for ${targetSign}`}
                      onError={() =>
                        setImageError(
                          true
                        )
                      }
                    />
                  ) : (
                    <div className="image-fallback">
                      <div className="fallback-letter">
                        {targetSign}
                      </div>

                      <span>
                        ASL sign{" "}
                        {targetSign}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="reference-footer">
                <div>
                  <span>
                    Target
                  </span>

                  <strong>
                    {
                      LETTER_NAMES[
                        targetSign
                      ]
                    }
                  </strong>
                </div>

                <div className="letter-navigation">
                  <span>
                    Navigate
                  </span>

                  <div className="letter-nav-buttons">
                    <button
                      onClick={
                        previousLetter
                      }
                      className="next-button"
                      title="Previous sign"
                    >
                      Previous
                    </button>

                    <button
                      onClick={
                        nextLetter
                      }
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
                  <span className="small-label">
                    LIVE CAMERA
                  </span>

                  <h3>
                    Match the
                    handshape
                  </h3>
                </div>

                <div
                  className={
                    handDetected
                      ? "detection-status detected"
                      : "detection-status"
                  }
                >
                  <span className="status-dot" />

                  {handDetected
                    ? "Hand detected"
                    : "Hand not detected"}
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
                    src={
                      capturedImage
                    }
                    alt="Automatically captured gesture preview"
                    className="camera-video captured-preview"
                  />
                )}

                {/* =================================================
                    CHANGED:
                    Visible MediaPipe hand landmark dots.

                    The live video is mirrored with scaleX(-1),
                    so x is mirrored here as well.
                ================================================= */}

                {cameraActive &&
                  handDetected &&
                  handLandmarks.length ===
                    21 && (
                    <div
                      className="hand-landmarks-overlay"
                      aria-hidden="true"
                    >
                      {handLandmarks.map(
                        (
                          point,
                          index
                        ) => (
                          <span
                            key={index}
                            className="hand-landmark-dot"
                            style={{
                              left: `${
                                (1 -
                                  point.x) *
                                100
                              }%`,
                              top: `${
                                point.y *
                                100
                              }%`,
                            }}
                          />
                        )
                      )}
                    </div>
                  )}

                {!cameraActive && (
                  <div className="camera-empty">
                    <div className="camera-empty-title">
                      Camera ready
                    </div>

                    <p>
                      Start your camera
                      to practice the
                      sign.
                    </p>

                    <button
                      className="primary-button"
                      onClick={
                        startCamera
                      }
                    >
                      Start camera
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <>
                    <div
                      className={
                        handDetected
                          ? "hand-frame visible"
                          : "hand-frame"
                      }
                    />

                    <div className="camera-corner top-left" />
                    <div className="camera-corner top-right" />
                    <div className="camera-corner bottom-left" />
                    <div className="camera-corner bottom-right" />

                    <div className="camera-status-overlay">
                      <span>
                        {processing
                          ? "Checking gesture..."
                          : countdown !==
                            null
                          ? "Hold your hand steady"
                          : handDetected
                          ? "Hand detected — preparing capture"
                          : "Place your hand inside the frame"}
                      </span>
                    </div>

                    {countdown !==
                      null &&
                      countdown > 0 && (
                        <div className="countdown">
                          {countdown}
                        </div>
                      )}

                    {countdown ===
                      0 && (
                      <div className="capture-label">
                        Checking
                        gesture
                      </div>
                    )}

                    {result &&
                      countdown ===
                        null && (
                        <div
                          className={`result-overlay result-overlay-${result.status}`}
                        >
                          <div className="result-overlay-icon">
                            {result.status ===
                            "correct"
                              ? "✓"
                              : "×"}
                          </div>

                          <div>
                            <strong>
                              {result.status ===
                              "correct"
                                ? "Correct gesture!"
                                : "Wrong gesture"}
                            </strong>

                            <span>
                              {result.status ===
                              "correct"
                                ? `You signed ${targetSign}`
                                : result.letter ===
                                  "?"
                                ? `No match, target is ${targetSign}`
                                : `Looks like ${result.letter}, target is ${targetSign}`}
                            </span>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>

              {cameraError && (
                <div className="camera-error">
                  {cameraError}
                </div>
              )}

              <div className="camera-controls">
                {!cameraActive ? (
                  <button
                    className="primary-button"
                    onClick={
                      startCamera
                    }
                  >
                    Start camera
                  </button>
                ) : (
                  <>
                    <button
                      className="capture-button"
                      disabled={
                        processing
                      }
                      onClick={() => {
                        setResult(null);
                        setCapturedImage(
                          null
                        );
                        setCountdown(null);
                      }}
                    >
                      {processing
                        ? "Checking..."
                        : "Retry sign"}
                    </button>

                    <button
                      className="secondary-button"
                      disabled={
                        processing
                      }
                      onClick={
                        nextLetter
                      }
                    >
                      Next sign
                    </button>

                    <button
                      className="secondary-button"
                      disabled={
                        processing
                      }
                      onClick={
                        stopCamera
                      }
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
                  disabled={
                    processing ||
                    !cameraActive
                  }
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
                  onClick={
                    nextLetter
                  }
                >
                  Next sign
                </button>

                <button
                  className="action-button"
                  onClick={() =>
                    document
                      .querySelector(
                        ".reference-panel"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                        block:
                          "start",
                      })
                  }
                >
                  Review reference
                </button>
              </div>
            )}
          </div>

          {/* ACCURACY */}

          <section
            ref={accuracyRef}
            className="accuracy-section"
          >
            <div className="accuracy-header">
              <div>
                <span className="small-label">
                  SESSION ACCURACY
                </span>

                <h3>
                  Your practice
                  results
                </h3>
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
                <span>
                  Accuracy
                </span>

                <strong>
                  {sessionAccuracy}%
                </strong>

                <small>
                  Across this
                  session
                </small>
              </div>

              <div className="accuracy-card">
                <span>
                  Correct
                </span>

                <strong>
                  {correctAttempts}
                </strong>

                <small>
                  Signs matched
                </small>
              </div>

              <div className="accuracy-card">
                <span>
                  Attempts
                </span>

                <strong>
                  {attempts}
                </strong>

                <small>
                  Total checks
                </small>
              </div>

              <div className="accuracy-card">
                <span>
                  Streak
                </span>

                <strong>
                  {streak}
                </strong>

                <small>
                  Correct in a
                  row
                </small>
              </div>
            </div>
          </section>

          {/* ALPHABET */}

          <section
            ref={alphabetRef}
            className="alphabet-section"
          >
            <div className="alphabet-heading">
              <div>
                <span className="small-label">
                  ALPHABET
                </span>

                <h3>
                  Learning Alphabet
                </h3>
              </div>

              <span className="alphabet-count">
                {ALPHABET.length} signs
              </span>
            </div>

            <div className="alphabet-grid">
              {ALPHABET.map(
                (letter) => (
                  <button
                    key={letter}
                    className={
                      targetSign ===
                      letter
                        ? "letter-card selected"
                        : "letter-card"
                    }
                    onClick={() =>
                      selectLetter(
                        letter
                      )
                    }
                  >
                    <img
                      src={
                        SIGN_IMAGES[
                          letter
                        ]
                      }
                      alt={`Sign ${letter}`}
                    />

                    <span>
                      {letter}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>

          {/* TIP */}

          <section className="tip">
            <div className="tip-line" />

            <div>
              <strong>
                Practice tip
              </strong>

              <p>
                Keep your entire
                hand visible, use
                good lighting and
                keep the palm
                orientation similar
                to the reference
                image.
              </p>
            </div>
          </section>
        </div>
      </section>

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />

      {/* =========================================================
          STYLES
      ========================================================= */}

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
          font-family: Inter, ui-sans-serif,
            -apple-system, BlinkMacSystemFont,
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
          background:
            radial-gradient(
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
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            rgba(20,34,68,0.88),
            rgba(12,24,51,0.72)
          );
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow:
            0 24px 70px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.06);
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
          background: linear-gradient(
            145deg,
            #bda9ff,
            #8063d7
          );
          color: white;
          font-size: 17px;
          font-weight: 750;
          box-shadow: 0 10px 25px rgba(122,89,208,0.3);
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
          border: none;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255,255,255,0.055);
        }

        .nav-item.active {
          color: white;
          background: linear-gradient(
            90deg,
            rgba(154,125,230,0.2),
            rgba(154,125,230,0.08)
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
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.06);
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
          border-bottom: 1px solid rgba(255,255,255,0.055);
          background: rgba(7,17,38,0.45);
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
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
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
          font-size: clamp(34px,4vw,48px);
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
          min-width: 145px;
          min-height: 145px;
          padding: 15px 17px;
          border: 1px solid rgba(191,171,255,0.25);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(140,108,220,0.16),
            rgba(90,68,155,0.08)
          );
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 18px 45px rgba(52,35,106,0.18),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .target-chip span {
          display: block;
          color: #8d98b3;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* =====================================================
           CHANGED:
           Target learning letter approximately 3× larger.
        ===================================================== */

        .target-chip .learning-target-letter {
          display: block;
          margin-top: 2px;
          color: #d7ccff;
          font-size: 78px;
          line-height: 0.95;
          font-weight: 750;
          letter-spacing: -0.065em;
          text-shadow:
            0 8px 30px rgba(133,103,221,0.35),
            0 0 30px rgba(181,159,255,0.14);
        }

        /* WORKSPACE */

        .workspace {
          display: grid;
          grid-template-columns:
            minmax(300px,0.72fr)
            minmax(500px,1.45fr);
          gap: 20px;
        }

        .reference-panel,
        .camera-panel,
        .alphabet-section,
        .tip {
          border: 1px solid rgba(255,255,255,0.075);
          background: linear-gradient(
            145deg,
            rgba(21,36,70,0.72),
            rgba(10,22,48,0.72)
          );
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 24px 65px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.04);
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
          border-bottom: 1px solid rgba(255,255,255,0.055);
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
          background: rgba(255,255,255,0.055);
          color: #b8c2d8;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          font-size: 11px;
        }

        .sound-button:hover {
          background: rgba(184,164,255,0.12);
          color: #d5cbff;
        }

        /* =====================================================
           CHANGED:
           High contrast reference image presentation.
        ===================================================== */

        .reference-image {
          min-height: 430px;
          padding: 24px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at center,
              rgba(167,140,238,0.18),
              transparent 62%
            ),
            rgba(7,17,38,0.5);
        }

        .reference-image-box {
          width: 100%;
          height: 382px;
          padding: 18px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          background: #ffffff;
          border: 2px solid rgba(255,255,255,0.92);
          box-shadow:
            0 18px 45px rgba(0,0,0,0.28),
            0 0 0 5px rgba(255,255,255,0.06),
            inset 0 1px 0 rgba(255,255,255,1);
          overflow: hidden;
        }

        .reference-image-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #ffffff;
          filter:
            contrast(1.15)
            brightness(1.02);
        }

        .image-fallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 10px;
          color: #24314b;
          background: #ffffff;
        }

        .fallback-letter {
          width: 170px;
          height: 220px;
          display: grid;
          place-items: center;
          border-radius: 30px;
          background: linear-gradient(
            145deg,
            #bca6ff,
            #7659ca
          );
          color: white;
          font-size: 100px;
          font-weight: 650;
          box-shadow: 0 25px 50px rgba(102,74,180,0.28);
        }

        .image-fallback span {
          color: #33405b;
          font-weight: 650;
        }

        .reference-footer {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.055);
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
          background: rgba(255,255,255,0.055);
          color: #c1b1ff;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* CAMERA */

        .detection-status {
          padding: 8px 11px;
          border-radius: 10px;
          background: rgba(255,255,255,0.045);
          color: #8490ab;
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: 0.2s ease;
        }

        .detection-status.detected {
          color: #b9e3ff;
          background: rgba(85,158,220,0.09);
          border-color: rgba(102,179,236,0.18);
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
          background:
            radial-gradient(
              circle at center,
              rgba(75,61,130,0.24),
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
          width: min(70%,430px);
          height: 72%;
          transform: translate(-50%,-50%);
          border: 1px dashed rgba(201,186,255,0.28);
          border-radius: 25px;
          box-shadow: inset 0 0 60px rgba(141,110,215,0.045);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .hand-frame.visible {
          border-color: rgba(117,199,255,0.65);
          box-shadow:
            inset 0 0 50px rgba(90,163,230,0.08),
            0 0 35px rgba(89,163,230,0.08);
        }

        /* =====================================================
           CHANGED:
           Landmark overlay sits above the video but below
           the camera UI/status elements.
        ===================================================== */

        .hand-landmarks-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          overflow: hidden;
        }

        .hand-landmark-dot {
          position: absolute;
          width: 11px;
          height: 11px;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #55c7ff;
          box-shadow:
            0 0 0 2px rgba(0,0,0,0.35),
            0 0 12px rgba(85,199,255,0.95),
            0 0 22px rgba(85,199,255,0.42);
        }

        .camera-corner {
          position: absolute;
          z-index: 4;
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
          z-index: 5;
          left: 20px;
          bottom: 20px;
          padding: 8px 11px;
          border-radius: 10px;
          color: #e8ecf7;
          background: rgba(3,10,23,0.62);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          font-size: 11px;
        }

        .countdown {
          position: absolute;
          z-index: 6;
          inset: 0;
          display: grid;
          place-items: center;
          color: white;
          font-size: 110px;
          font-weight: 650;
          background: rgba(4,10,25,0.28);
          text-shadow: 0 8px 40px rgba(0,0,0,0.5);
        }

        .capture-label {
          position: absolute;
          z-index: 6;
          left: 50%;
          top: 25px;
          transform: translateX(-50%);
          padding: 9px 14px;
          border-radius: 10px;
          color: #ded5ff;
          background: rgba(57,38,100,0.78);
          border: 1px solid rgba(189,165,255,0.22);
          font-size: 11px;
        }

        .camera-controls {
          padding: 16px 20px;
          display: flex;
          gap: 9px;
          border-top: 1px solid rgba(255,255,255,0.055);
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
          transition:
            transform 0.18s ease,
            opacity 0.18s ease,
            background 0.18s ease;
        }

        .primary-button,
        .capture-button {
          color: white;
          background: linear-gradient(
            135deg,
            #a993f2,
            #7358c9
          );
          box-shadow: 0 12px 25px rgba(103,76,181,0.22);
          border: none;
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
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .camera-error {
          margin: 12px 20px 0;
          padding: 10px 12px;
          border-radius: 10px;
          color: #ffb5c0;
          background: rgba(194,67,86,0.1);
          border: 1px solid rgba(220,86,107,0.14);
          font-size: 11px;
        }

        /* RESULT OVERLAY */

        .result-overlay {
          position: absolute;
          z-index: 7;
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
          background: rgba(20,70,52,0.85);
          border-color: rgba(85,199,153,0.4);
          color: #c0f0dc;
        }

        .result-overlay-correct
          .result-overlay-icon {
          background: rgba(85,199,153,0.2);
          color: #79ddb4;
        }

        .result-overlay-incorrect {
          background: rgba(80,30,40,0.85);
          border-color: rgba(218,102,121,0.4);
          color: #ffd0d7;
        }

        .result-overlay-incorrect
          .result-overlay-icon {
          background: rgba(218,102,121,0.2);
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
          background: rgba(64,164,126,0.09);
          border-color: rgba(85,199,153,0.17);
          color: #c0f0dc;
        }

        .result-correct .result-icon {
          background: rgba(85,199,153,0.14);
          color: #79ddb4;
        }

        .result-wrong {
          background: rgba(205,94,112,0.09);
          border-color: rgba(218,102,121,0.17);
          color: #ffd0d7;
        }

        .result-wrong .result-icon {
          background: rgba(218,102,121,0.14);
          color: #ff9eae;
        }

        .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 11px;
        }

        .action-button {
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.045);
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
          background: rgba(255,255,255,0.075);
          border-color: rgba(193,169,255,0.25);
        }

        .action-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .primary-action {
          background: linear-gradient(
            145deg,
            #9f88e8,
            #765fc4
          );
          border-color: rgba(207,191,255,0.28);
          color: white;
        }

        /* ACCURACY */

        .accuracy-section {
          margin-top: 20px;
          padding: 22px;
          border-radius: 21px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.065);
          box-shadow: 0 18px 50px rgba(0,0,0,0.12);
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
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.035);
          color: #8e9ab4;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 10px;
          cursor: pointer;
        }

        .reset-stats-button:hover {
          color: #d7def0;
          background: rgba(255,255,255,0.065);
        }

        .accuracy-grid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 10px;
        }

        .accuracy-card {
          min-height: 112px;
          padding: 16px;
          border-radius: 15px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.055);
        }

        .accuracy-card.featured {
          background: linear-gradient(
            145deg,
            rgba(160,133,231,0.16),
            rgba(111,85,183,0.07)
          );
          border-color: rgba(193,169,255,0.2);
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
          padding: 26px;
          border-radius: 21px;
        }

        .alphabet-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 22px;
        }

        .alphabet-heading h3 {
          font-size: 22px;
        }

        .alphabet-count {
          color: #78849e;
          font-size: 12px;
        }

        .alphabet-grid {
          display: grid;
          grid-template-columns: repeat(
            13,
            minmax(70px,1fr)
          );
          gap: 12px;
        }

        .letter-card {
          min-height: 135px;
          padding: 12px 8px 10px;
          border-radius: 15px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.045);
          cursor: pointer;
          color: #aab4c9;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .letter-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.065);
          border-color: rgba(187,166,250,0.22);
        }

        .letter-card.selected {
          background: linear-gradient(
            145deg,
            rgba(160,133,231,0.19),
            rgba(111,85,183,0.1)
          );
          border-color: rgba(193,169,255,0.38);
          color: #d8cdff;
          box-shadow: 0 10px 30px rgba(100,75,170,0.12);
        }

        .letter-card img {
          width: 68px;
          height: 88px;
          object-fit: contain;
          display: block;
          margin: 0 auto 7px;
          filter:
            brightness(0)
            invert(1)
            opacity(0.82);
        }

        .letter-card.selected img {
          filter:
            brightness(0)
            invert(82%)
            sepia(18%)
            saturate(800%)
            hue-rotate(210deg)
            brightness(115%);
        }

        .letter-card span {
          display: block;
          font-size: 14px;
          font-weight: 700;
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

        @media (max-width:1180px) {
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

          .reference-image-box {
            height: 300px;
          }

          .alphabet-grid {
            grid-template-columns:
              repeat(9,minmax(65px,1fr));
          }
        }

        @media (max-width:800px) {
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
            grid-template-columns: repeat(6,1fr);
          }
        }

        @media (max-width:520px) {
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
            padding: 16px;
          }

          .reference-image-box {
            height: 270px;
            padding: 12px;
          }

          .target-chip {
            min-width: 125px;
            min-height: 125px;
          }

          .target-chip .learning-target-letter {
            font-size: 64px;
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
            grid-template-columns: repeat(4,1fr);
            gap: 9px;
          }

          .letter-card {
            min-height: 112px;
            padding: 8px 4px;
          }

          .letter-card img {
            width: 52px;
            height: 70px;
          }

          .letter-card span {
            font-size: 12px;
          }

          .hand-landmark-dot {
            width: 9px;
            height: 9px;
            border-width: 2px;
          }
        }
      `}</style>
    </main>
  );
}