"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

export default function Navigation({ name }: { name: string }) {
  const pathname = usePathname();
  const basePath = `/${name.toLowerCase()}`;

  const items: NavItem[] = [
    { label: "Home", icon: "🏠", href: basePath },
    { label: "Chores", icon: "✅", href: `${basePath}/chores` },
    { label: "Rewards", icon: "🎁", href: `${basePath}/rewards` },
    { label: "Pet", icon: "🐾", href: `${basePath}/pet` },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== basePath && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-quest-purple font-bold"
                  : "text-quest-muted hover:text-quest-purple"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
