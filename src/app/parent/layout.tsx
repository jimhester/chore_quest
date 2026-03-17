"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/parent", icon: "📊" },
  { label: "Chores", href: "/parent/chores", icon: "✅" },
  { label: "Rewards", href: "/parent/rewards", icon: "🎁" },
  { label: "History", href: "/parent/history", icon: "📜" },
];

const DEFAULT_PIN = "1234";
const PIN_STORAGE_KEY = "chorequest-parent-pin";
const SESSION_KEY = "chorequest-parent-session";

function getPin(): string {
  if (typeof window === "undefined") return DEFAULT_PIN;
  return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
}

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated this session
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === getPin()) {
      setAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY, "true");
      setError(false);
    } else {
      setError(true);
      setPinInput("");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    setPinInput("");
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔒</div>
            <h1 className="text-2xl font-bold text-quest-purple">Parent Mode</h1>
            <p className="text-quest-muted text-sm mt-1">Enter PIN to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, ""));
                setError(false);
              }}
              placeholder="Enter PIN..."
              autoFocus
              className={`w-full text-center text-2xl tracking-widest font-bold px-4 py-4 rounded-xl border-2 focus:outline-none ${
                error
                  ? "border-quest-red bg-red-50"
                  : "border-gray-200 focus:border-quest-purple"
              }`}
            />
            {error && (
              <p className="text-quest-red text-sm text-center">
                Wrong PIN. Try again!
              </p>
            )}
            <button
              type="submit"
              disabled={pinInput.length < 4}
              className="w-full bg-quest-purple text-white font-bold py-3 rounded-xl disabled:opacity-50"
            >
              Unlock
            </button>
          </form>
          <Link
            href="/"
            className="block text-center mt-6 text-quest-muted hover:text-quest-purple text-sm"
          >
            ← Back to Home
          </Link>
          <p className="text-center text-xs text-quest-muted mt-4">
            Default PIN: 1234
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-quest-muted hover:text-quest-purple transition-colors"
          >
            ← Home
          </Link>
          <h1 className="text-lg font-bold text-quest-purple">
            🔒 Parent Mode
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs text-quest-muted hover:text-quest-red"
          >
            Lock
          </button>
        </div>
        <nav className="max-w-2xl mx-auto px-4 flex gap-1 pb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isActive
                    ? "bg-quest-purple text-white font-bold"
                    : "text-quest-muted hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
