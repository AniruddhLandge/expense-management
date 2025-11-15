// client/src/components/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ spent = 0, limit = 0 }) {
  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const color =
    limit === 0 ? "bg-gray-600"
    : percent < 80 ? "bg-green-500"
    : percent <= 100 ? "bg-yellow-500"
    : "bg-red-600";

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>₹{spent.toLocaleString()} spent</span>
        <span>Limit: ₹{limit.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 h-3 rounded">
        <div
          className={`h-3 rounded ${color} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-400 mt-1">{percent}%</div>
    </div>
  );
}
