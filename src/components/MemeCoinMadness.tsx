"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MemeKind = "coin" | "rug";

type MemeConfig = {
  id: string;
  label: string;
  ticker: string;
  emoji: string;
  kind: MemeKind;
};

type Sprite = {
  id: number;
  x: number; // 0–1
  y: number; // 0–1
  vx: number; // horizontal velocity per tick
  vy: number; // base vertical speed per tick
  meme: MemeConfig;
};

type Explosion = {
  id: number;
  x: number;
  y: number;
};

type LeaderboardEntry = {
  name: string;
  bestScore: number;
};

type Props = {
  username?: string;
};

const GAME_DURATION_MS = 60_000; // 60 seconds
const SPAWN_INTERVAL_MS = 650;
const MOVE_INTERVAL_MS = 40;
const BASE_FALL_SPEED = 0.012;

const LEADERBOARD_STORAGE_KEY = "mcm_leaderboard_v1";
const BADGE_THRESHOLD = 300; // score needed to show “mint badge”

// Meme list – one rug only
const MEMES: MemeConfig[] = [
  { id: "degen", label: "Degen", ticker: "DEGEN", emoji: "🧢", kind: "coin" },
  { id: "brian", label: "Brian", ticker: "BRIAN", emoji: "🐶", kind: "coin" },
  {
    id: "toshis",
    label: "Toshis",
    ticker: "TOSHIS",
    emoji: "🧙‍♂️",
    kind: "coin",
  },
  { id: "brett", label: "Brett", ticker: "BRETT", emoji: "🐸", kind: "coin" },
  {
    id: "doginme",
    label: "Dog in Me",
    ticker: "DOG",
    emoji: "🐕",
    kind: "coin",
  },
  { id: "rug", label: "Rug", ticker: "RUG", emoji: "🧶", kind: "rug" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatSeconds(ms: number) {
  return Math.ceil(ms / 1000);
}

function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e) =>
          e &&
          typeof e.name === "string" &&
          typeof e.bestScore === "number"
      )
      .slice(0, 10);
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LEADERBOARD_STORAGE_KEY,
      JSON.stringify(entries.slice(0, 10))
    );
  } catch {
    // ignore
  }
}

export function MemeCoinMadness({ username }: Props) {
  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [combo, setCombo] = useState(1);
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [endReason, setEndReason] = useState<"time" | "rug" | null>(null);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badgeMinted, setBadgeMinted] = useState(false);

  const nextSpriteIdRef = useRef(1);
  const nextExplosionIdRef = useRef(1);
  const startTimeRef = useRef<number | null>(null);

  const running = status === "running";
  const displayName =
    (username && username.trim().length > 0 ? username : undefined) ||
    "Anon degen";

  // Load leaderboard on mount
  useEffect(() => {
    const initial = loadLeaderboard();
    setLeaderboard(initial);
  }, []);

  // Sync best score for this user when leaderboard changes
  useEffect(() => {
    const entry = leaderboard.find((e) => e.name === displayName);
    if (entry) {
      setBestScore(entry.bestScore);
    }
  }, [leaderboard, displayName]);

  const updateLeaderboard = useCallback(
    (finalBestScore: number) => {
      setLeaderboard((prev) => {
        const existingIndex = prev.findIndex(
          (e) => e.name === displayName
        );
        let next: LeaderboardEntry[];

        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          if (finalBestScore <= existing.bestScore) {
            return prev;
          }
          next = [...prev];
          next[existingIndex] = {
            ...existing,
            bestScore: finalBestScore,
          };
        } else {
          next = [...prev, { name: displayName, bestScore: finalBestScore }];
        }

        next.sort((a, b) => b.bestScore - a.bestScore);
        saveLeaderboard(next);
        return next;
      });
    },
    [displayName]
  );

  const mainMessage = useMemo(() => {
    if (status === "idle") return "Tap the meme coins, dodge the rugs.";
    if (status === "running") return "Squash the coins! Avoid the rugs!";
    if (endReason === "rug") return "You Got Rugged!!";
    return "Time’s up!";
  }, [status, endReason]);

  const startGame = useCallback(() => {
    setStatus("running");
    setScore(0);
    setCombo(1);
    setSprites([]);
    setExplosions([]);
    setTimeLeftMs(GAME_DURATION_MS);
    setEndReason(null);
    startTimeRef.current = performance.now();
  }, []);

  const endGame = useCallback(
    (reason: "time" | "rug") => {
      setStatus("over");
      setEndReason(reason);
      setSprites([]);
      setCombo(1);

      setBestScore((prev) => {
        const newBest = score > prev ? score : prev;
        if (newBest > prev) {
          updateLeaderboard(newBest);
        } else {
          updateLeaderboard(prev);
        }
        return newBest;
      });
    },
    [score, updateLeaderboard]
  );

  // Main game loop: timer, movement, spawns
  useEffect(() => {
    if (!running) return;

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    // Timer
    const timer = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(GAME_DURATION_MS - elapsed, 0);
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        endGame("time");
      }
    }, 200);

    // Movement
    const mover = window.setInterval(() => {
      const now = performance.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
      // Difficulty ramps from 1x to ~2.5x over game
      const difficulty = 1 + Math.min(elapsed / GAME_DURATION_MS, 1) * 1.5;

      setSprites((prev) =>
        prev
          .map((sprite) => {
            let x = sprite.x + sprite.vx;
            const y = sprite.y + sprite.vy * difficulty;
            let vx = sprite.vx;

            // Bounce off walls
            if (x < 0.05) {
              x = 0.05;
              vx = Math.abs(vx);
            } else if (x > 0.95) {
              x = 0.95;
              vx = -Math.abs(vx);
            }

            return { ...sprite, x, y, vx };
          })
          .filter((sprite) => sprite.y < 1.2)
      );
    }, MOVE_INTERVAL_MS);

    // Spawns
    const spawner = window.setInterval(() => {
      setSprites((prev) => {
        const meme = randomFrom(MEMES);
        const id = nextSpriteIdRef.current++;
        const x = 0.1 + Math.random() * 0.8;
        const y = -0.1;
        const speedFactor = 0.6 + Math.random() * 0.8;
        const vy = BASE_FALL_SPEED * speedFactor;
        const vx = (Math.random() - 0.5) * 0.02;

        const sprite: Sprite = { id, x, y, vx, vy, meme };
        const capped = prev.length > 24 ? prev.slice(1) : prev;
        return [...capped, sprite];
      });
    }, SPAWN_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(mover);
      window.clearInterval(spawner);
    };
  }, [running, endGame]);

  const handleTapSprite = useCallback(
    (spriteId: number) => {
      if (!running) return;

      setSprites((prev) => {
        const sprite = prev.find((s) => s.id === spriteId);
        if (!sprite) return prev;

        const remaining = prev.filter((s) => s.id !== spriteId);

        if (sprite.meme.kind === "rug") {
          endGame("rug");
          return remaining;
        }

        // Coin hit → score + combo + explosion
        const explosionId = nextExplosionIdRef.current++;
        const explosion: Explosion = {
          id: explosionId,
          x: sprite.x,
          y: sprite.y,
        };

        setExplosions((prevExplosions) => [...prevExplosions, explosion]);

        window.setTimeout(() => {
          setExplosions((prevExplosions) =>
            prevExplosions.filter((e) => e.id !== explosionId)
          );
        }, 200);

        setScore((prevScore) => prevScore + 10 * Math.max(combo, 1));
        setCombo((prevCombo) => Math.min(prevCombo + 1, 10));

        return remaining;
      });
    },
    [running, endGame, combo]
  );

  const handleMiss = useCallback(() => {
    if (!running) return;
    setCombo(1);
  }, [running]);

  const handleBackgroundTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.sprite !== "true") {
      handleMiss();
    }
  };

  const canMintBadge = bestScore >= BADGE_THRESHOLD && !badgeMinted;

  const handleMintBadge = () => {
    setBadgeMinted(true);
    alert(
      `Stub: would mint a Meme Coin Madness high-score badge for ${displayName} (score ${bestScore}) on Base.`
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-3 bg-white px-3 py-4 text-black">
      {/* Title + dynamic coin row */}
      <div className="w-full max-w-sm mt-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🎮</span>
          <h1 className="text-xl font-extrabold tracking-wide text-black drop-shadow-sm">
            MEME COIN MADNESS
          </h1>
          <span className="text-2xl">🚀</span>
        </div>
        <div className="flex justify-center flex-wrap gap-3 text-xs font-semibold mb-1">
          {MEMES.filter((m) => m.kind === "coin").map((meme) => (
            <span key={meme.id} className="text-gray-800">
              {meme.ticker}
            </span>
          ))}
        </div>
        <div className="border-b border-black mb-2" />
      </div>

      {/* Stat cards */}
      <div className="w-full max-w-sm flex justify-between gap-2 text-xs mb-1">
        <div className="flex-1 rounded-xl border-2 border-black bg-yellow-400 px-2 py-2 flex flex-col items-center">
          <span className="text-lg">💰</span>
          <span className="font-mono mt-1">{score}</span>
        </div>
        <div className="flex-1 rounded-xl border-2 border-black bg-yellow-400 px-2 py-2 flex flex-col items-center">
          <span className="text-lg">⏰</span>
          <span className="font-mono mt-1">
            {formatSeconds(timeLeftMs)}
          </span>
        </div>
        <div className="flex-1 rounded-xl border-2 border-black bg-yellow-400 px-2 py-2 flex flex-col items-center">
          <span className="text-lg">🏆</span>
          <span className="font-mono mt-1">{bestScore}</span>
        </div>
      </div>

      {/* Combo bar */}
      <div className="w-full max-w-sm rounded-xl bg-black text-white py-1 text-center text-xs font-semibold mb-1">
        COMBO x{combo}
      </div>

      {/* Hint text */}
      <p className="w-full max-w-sm text-[11px] text-gray-700 text-center">
        {mainMessage}
      </p>

      {/* Game area */}
      <div
        className="relative mt-1 h-[420px] w-full max-w-sm select-none overflow-hidden rounded-2xl border border-black bg-gradient-to-b from-slate-900 via-slate-950 to-black"
        onClick={handleBackgroundTap}
      >
        {/* Explosions */}
        {explosions.map((explosion) => (
          <div
            key={explosion.id}
            className="pointer-events-none absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-400/80 text-xl font-bold text-black shadow-lg shadow-yellow-400/60"
            style={{
              left: `${explosion.x * 100}%`,
              top: `${explosion.y * 100}%`,
            }}
          >
            💥
          </div>
        ))}

        {/* Sprites */}
        {sprites.map((sprite) => (
          <button
            key={sprite.id}
            type="button"
            data-sprite="true"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleTapSprite(sprite.id);
            }}
            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/60 bg-white/15 text-xs shadow-lg shadow-black/60 backdrop-blur-sm active:scale-95"
            style={{
              left: `${sprite.x * 100}%`,
              top: `${sprite.y * 100}%`,
            }}
          >
            <span className="text-lg">{sprite.meme.emoji}</span>
            <span className="mt-[2px] text-[9px] leading-none text-black">
              {sprite.meme.kind === "rug" ? "RUG" : sprite.meme.ticker}
            </span>
          </button>
        ))}

        {/* Idle / Over overlays */}
        {status !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 px-4 text-center text-white">
            {status === "idle" ? (
              <>
                <div className="mb-2 text-sm font-semibold">
                  Meme Coin Madness
                </div>
                <p className="mb-4 text-[11px] text-gray-200">
                  Tap moving meme coins for points.{" "}
                  <span className="font-semibold">Avoid all rugs.</span> Combos
                  build your score, but one bad rug and{" "}
                  <span className="font-semibold">You Get Rugged!!</span>
                </p>
              </>
            ) : (
              <>
                <div className="mb-2 text-sm font-semibold">
                  Final score: <span className="font-mono">{score}</span>
                </div>
                <p className="mb-2 text-[11px] text-gray-200">
                  {endReason === "rug"
                    ? "You Got Rugged!!"
                    : "Time’s up. Not bad, degen."}
                </p>
                <p className="mb-3 text-[11px] text-gray-300">
                  Best: <span className="font-mono">{bestScore}</span>
                </p>
              </>
            )}

            <button
              onClick={startGame}
              className="mt-1 rounded-full border border-yellow-300 bg-yellow-400 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-black shadow-lg shadow-yellow-500/40"
            >
              {status === "idle" ? "Start Game" : "Play Again"}
            </button>

            {canMintBadge && (
              <button
                onClick={handleMintBadge}
                className="mt-3 rounded-full border border-orange-400/70 bg-orange-300/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black shadow-lg shadow-orange-400/40"
              >
                Mint High Score Badge (stub)
              </button>
            )}

            {badgeMinted && (
              <p className="mt-2 text-[10px] text-emerald-300">
                Badge “minted” locally – later we’ll hook this up to a real Base
                contract.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="mt-2 w-full max-w-sm rounded-xl border border-black/20 bg-yellow-50 px-3 py-2 text-[10px] text-gray-800">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-semibold uppercase tracking-wide text-[9px] text-gray-700">
            Leaderboard (local)
          </span>
          <span className="text-[9px] text-gray-500">
            Top {Math.min(leaderboard.length || 5, 5)} · this device
          </span>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-[10px] text-gray-600">
            Play a game to set the first score.
          </p>
        ) : (
          <ol className="space-y-1">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <li
                key={entry.name}
                className="flex items-center justify-between rounded-lg bg-black/80 px-2 py-1 text-white"
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-gray-300">
                    {idx + 1}.
                  </span>
                  <span className="text-[10px]">
                    {entry.name === displayName ? "👉 " : ""}
                    {entry.name}
                  </span>
                </span>
                <span className="font-mono text-[10px]">
                  {entry.bestScore}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 w-full max-w-sm rounded-xl border border-black/20 bg-yellow-50 px-3 py-2 text-[10px] text-gray-800">
        <div className="mb-1 font-semibold uppercase tracking-wide text-[9px] text-gray-700">
          Legend
        </div>
        <div className="flex flex-wrap gap-2">
          {MEMES.map((meme) => (
            <div
              key={meme.id}
              className="flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-white"
            >
              <span>{meme.emoji}</span>
              <span className="font-mono text-[9px]">
                {meme.kind === "rug" ? "RUG" : meme.ticker}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}