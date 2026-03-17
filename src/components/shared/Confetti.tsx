"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#3B82F6"];
const EMOJIS = ["🎉", "⭐", "✨", "💫", "🌟"];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  emoji: string;
  rotation: number;
  dx: number;
  dy: number;
}

let showConfetti = false;
let confettiListeners: Array<() => void> = [];

function emitConfetti() {
  confettiListeners.forEach((l) => l());
}

export function triggerConfetti() {
  showConfetti = true;
  emitConfetti();
  setTimeout(() => {
    showConfetti = false;
    emitConfetti();
  }, 2000);
}

export function ConfettiOverlay() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const listener = () => {
      setActive(showConfetti);
      if (showConfetti) {
        setParticles(
          Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: -20,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            rotation: Math.random() * 360,
            dx: (Math.random() - 0.5) * 200,
            dy: Math.random() * 400 + 200,
          }))
        );
      }
    };
    confettiListeners.push(listener);
    return () => {
      confettiListeners = confettiListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {active &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: p.x, y: p.y, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: p.x + p.dx,
                y: p.dy,
                opacity: 0,
                rotate: p.rotation,
                scale: 0.5,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute text-2xl"
            >
              {p.emoji}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
