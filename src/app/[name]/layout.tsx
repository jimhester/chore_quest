"use client";

import { useParams, notFound } from "next/navigation";
import { useStore } from "@/lib/hooks/useStore";
import Navigation from "@/components/shared/Navigation";
import PointsBadge from "@/components/shared/PointsBadge";
import Link from "next/link";

export default function KidLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ name: string }>();
  const { getProfileByName } = useStore();
  const profile = getProfileByName(params.name);

  if (!profile || profile.role !== "kid") {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-quest-muted hover:text-quest-purple transition-colors">
            ← Home
          </Link>
          <h1 className="text-lg font-bold text-quest-purple">{profile.name}</h1>
          <PointsBadge current={profile.current_points} />
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-lg mx-auto px-4 py-6">{children}</div>

      {/* Bottom nav */}
      <Navigation name={profile.name} />
    </div>
  );
}
