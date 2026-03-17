"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/parent", icon: "📊" },
  { label: "Chores", href: "/parent/chores", icon: "✅" },
  { label: "Rewards", href: "/parent/rewards", icon: "🎁" },
  { label: "History", href: "/parent/history", icon: "📜" },
];

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
          <div className="w-16" />
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
