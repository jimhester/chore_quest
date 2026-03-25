"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PointsFloat {
  id: string;
  points: number;
  x: number;
  y: number;
}

let floats: PointsFloat[] = [];
let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach((l) => l());
}

export function triggerPointsFloat(points: number, x: number, y: number) {
  const id = crypto.randomUUID();
  floats = [...floats, { id, points, x, y }];
  emit();
  setTimeout(() => {
    floats = floats.filter((f) => f.id !== id);
    emit();
  }, 1200);
}

export function PointsOverlay() {
  const [items, setItems] = useState<PointsFloat[]>([]);

  useEffect(() => {
    const listener = () => setItems([...floats]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {items.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, x: f.x - 30, y: f.y, scale: 0.5 }}
            animate={{ opacity: 0, y: f.y - 80, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute text-quest-orange font-extrabold text-xl"
          >
            +{f.points} 🪙
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
