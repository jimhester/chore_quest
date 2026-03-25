"use client";

export default function PointsBadge({
  current,
  lifetime,
  showLifetime = false,
}: {
  current: number;
  lifetime?: number;
  showLifetime?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-quest-yellow/20 text-quest-orange font-bold px-3 py-1 rounded-full">
        <span>🪙</span>
        <span>{current} coins</span>
      </div>
      {showLifetime && lifetime !== undefined && (
        <div className="flex items-center gap-1 text-quest-muted text-sm">
          <span>🏆</span>
          <span>{lifetime} total</span>
        </div>
      )}
    </div>
  );
}
