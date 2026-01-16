// Color mapping for all Dominion editions
// Each edition gets a distinct color for visual identification

export const editionColors = {
  "Base (1st Edition)": {
    background: "#3b82f6", // Blue
    text: "#ffffff",
    border: "#2563eb"
  },
  "Base (2nd Edition)": {
    background: "#60a5fa", // Lighter blue
    text: "#ffffff",
    border: "#3b82f6"
  },
  "Intrigue (1st Edition)": {
    background: "#8b5cf6", // Purple
    text: "#ffffff",
    border: "#7c3aed"
  },
  "Intrigue (2nd Edition)": {
    background: "#a78bfa", // Lighter purple
    text: "#ffffff",
    border: "#8b5cf6"
  },
  "Seaside (1st Edition)": {
    background: "#06b6d4", // Cyan
    text: "#ffffff",
    border: "#0891b2"
  },
  "Seaside (2nd Edition)": {
    background: "#22d3ee", // Lighter cyan
    text: "#ffffff",
    border: "#06b6d4"
  },
  "Alchemy": {
    background: "#f59e0b", // Amber
    text: "#ffffff",
    border: "#d97706"
  },
  "Prosperity (1st Edition)": {
    background: "#eab308", // Yellow
    text: "#000000",
    border: "#ca8a04"
  },
  "Prosperity (2nd Edition)": {
    background: "#fde047", // Lighter yellow
    text: "#000000",
    border: "#eab308"
  },
  "Hinterlands (1st Edition)": {
    background: "#22c55e", // Green
    text: "#ffffff",
    border: "#16a34a"
  },
  "Hinterlands (2nd Edition)": {
    background: "#4ade80", // Lighter green
    text: "#ffffff",
    border: "#22c55e"
  },
  "Dark Ages": {
    background: "#1f2937", // Dark gray
    text: "#ffffff",
    border: "#111827"
  },
  "Adventures": {
    background: "#ef4444", // Red
    text: "#ffffff",
    border: "#dc2626"
  },
  "Empires": {
    background: "#f97316", // Orange
    text: "#ffffff",
    border: "#ea580c"
  },
  "Nocturne": {
    background: "#6366f1", // Indigo
    text: "#ffffff",
    border: "#4f46e5"
  },
  "Renaissance": {
    background: "#ec4899", // Pink
    text: "#ffffff",
    border: "#db2777"
  },
  "Menagerie": {
    background: "#14b8a6", // Teal
    text: "#ffffff",
    border: "#0d9488"
  },
  "Allies": {
    background: "#84cc16", // Lime
    text: "#ffffff",
    border: "#65a30d"
  },
  "Plunder": {
    background: "#f43f5e", // Rose
    text: "#ffffff",
    border: "#e11d48"
  },
  "Promos": {
    background: "#a855f7", // Violet
    text: "#ffffff",
    border: "#9333ea"
  },
  "Cornucopia (1st Edition)": {
    background: "#10b981", // Emerald
    text: "#ffffff",
    border: "#059669"
  },
  "Guilds (1st Edition)": {
    background: "#d97706", // Darker amber/orange
    text: "#ffffff",
    border: "#b45309"
  },
  "Cornucopia & Guilds (2nd Edition)": {
    background: "#34d399", // Light emerald
    text: "#ffffff",
    border: "#10b981"
  }
}

// Helper function to get color for an edition name
export function getEditionColor(editionName) {
  return editionColors[editionName] || {
    background: "#6b7280", // Default gray
    text: "#ffffff",
    border: "#4b5563"
  }
}
