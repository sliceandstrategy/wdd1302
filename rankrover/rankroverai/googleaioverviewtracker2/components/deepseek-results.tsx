"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface SearchResult {
  averagePosition: number | null
  searchCount: number
  foundCount: number
  sentimentCounts: {
    positive: number
    neutral: number
    negative: number
  }
  searches: Array<{
    position: number | null
    prompt?: string
    response?: string
    sentiment?: "positive" | "neutral" | "negative"
    debugInfo?: string
  }>
}

// Function to determine presence level based on found count
function getPresenceLevel(
  avgPosition: number | null,
  foundCount: number,
): {
  level: "WEAK" | "MODERATE" | "STRONG"
  color: string
} {
  if (!avgPosition || foundCount === 0) {
    return { level: "WEAK", color: "#FF5252" } // Red for no presence
  }

  // Determine by found count
  if (foundCount > 2) {
    return { level: "STRONG", color: "#4CAF50" } // Green for strong presence
  } else if (foundCount >= 1) {
    return { level: "MODERATE", color: "#FFC107" } // Yellow for moderate presence
  } else {
    return { level: "WEAK", color: "#FF5252" } // Red for weak presence
  }
}

// Function to get color for found count
function getFoundCountColor(foundCount: number): string {
  if (foundCount < 1) {
    return "#FF5252" // Red
  } else if (foundCount < 2) {
    return "#FFC107" // Yellow
  } else {
    return "#4CAF50" // Green
  }
}

// Function to get color for average position
function getPositionColor(position: number | null): string {
  if (!position) return "#9E9E9E" // Gray for null

  if (position < 3) {
    return "#FF9800" // Orange for good position (lower is better)
  } else if (position < 5) {
    return "#4CAF50" // Green for moderate position
  } else {
    return "#2196F3" // Blue for other positions
  }
}

// Function to get color for sentiment
function getSentimentColor(sentiment: string): string {
  if (sentiment === "positive") return "#4CAF50" // Green
  if (sentiment === "negative") return "#FF5252" // Red
  return "#FFC107" // Yellow for neutral
}

// Function to get position label
function getPositionLabel(position: number | null): string {
  if (!position) return "N/A"
  if (position < 3) return "Early"
  if (position < 5) return "Middle"
  return "Late"
}

export function DeepSeekResults({ results }: { results: SearchResult }) {
  const [showDebug, setShowDebug] = useState(false)

  // Calculate presence level if results exist
  const presence = results?.averagePosition ? getPresenceLevel(results.averagePosition, results.foundCount) : null

  if (results.searchCount === 0) {
    return <p className="text-gray-600">No DeepSeek results found for this keyword.</p>
  }

  if (results.foundCount === 0) {
    return (
      <p className="text-gray-600">DeepSeek responses generated, but your brand was not mentioned in any results.</p>
    )
  }

  return (
    <div>
      {/* Sentiment Analysis Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-center">
        <Card className="p-4">
          <p className="text-6xl font-bold font-heading" style={{ color: "#4CAF50" }}>
            {results.sentimentCounts?.positive || 0}
          </p>
          <p className="text-sm text-gray-500 uppercase mt-2">POSITIVE</p>
        </Card>

        <Card className="p-4">
          <p className="text-6xl font-bold font-heading" style={{ color: "#FFC107" }}>
            {results.sentimentCounts?.neutral || 0}
          </p>
          <p className="text-sm text-gray-500 uppercase mt-2">NEUTRAL</p>
        </Card>

        <Card className="p-4">
          <p className="text-6xl font-bold font-heading" style={{ color: "#FF5252" }}>
            {results.sentimentCounts?.negative || 0}
          </p>
          <p className="text-sm text-gray-500 uppercase mt-2">NEGATIVE</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-orange-500 uppercase">{getPositionLabel(results.averagePosition)}</p>
          <p className="text-6xl font-bold font-heading" style={{ color: getPositionColor(results.averagePosition) }}>
            {results.averagePosition !== null ? results.averagePosition.toFixed(1) : "N/A"}
          </p>
          <p className="text-sm text-gray-500 uppercase mt-2">AVG. POSITION</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <Card className="p-4">
          <p className="text-sm text-gray-500 uppercase">Average Position</p>
          <p className="text-4xl font-bold font-heading" style={{ color: getPositionColor(results.averagePosition) }}>
            {results.averagePosition !== null ? results.averagePosition.toFixed(1) : "N/A"}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500 uppercase">Found In Prompts</p>
          <p className="text-4xl font-bold font-heading" style={{ color: getFoundCountColor(results.foundCount) }}>
            {results.foundCount}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500 uppercase">Total Prompts</p>
          <p className="text-4xl font-bold font-heading text-blue">{results.searchCount}</p>
        </Card>
      </div>

      {presence && (
        <div className="w-full flex justify-center mb-4">
          <div
            className="px-4 py-2 rounded-full text-black font-bold text-sm"
            style={{ backgroundColor: presence.color }}
          >
            {presence.level} PRESENCE
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 mb-3">
        <p>
          Your brand was mentioned in {results.foundCount} out of {results.searchCount} DeepSeek responses.
        </p>
      </div>

      <div className="text-sm border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">Prompt Details:</p>
          <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-500 underline">
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto pr-2">
          <ul className="space-y-4">
            {results.searches.map((search, index) => (
              <li key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between font-medium">
                  <span className="truncate max-w-[70%]">
                    Prompt #{index + 1}: "{search.prompt}"
                  </span>
                  <span>{search.position ? `Position ${search.position}` : "Not found"}</span>
                </div>
                {search.response && <div className="mt-1 text-xs text-gray-500 italic">"{search.response}"</div>}
                {search.sentiment && (
                  <div className="mt-1">
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: getSentimentColor(search.sentiment) }}
                    >
                      {search.sentiment.toUpperCase()}
                    </span>
                  </div>
                )}
                {showDebug && search.debugInfo && (
                  <div className="mt-1 text-xs bg-gray-200 p-2 rounded">
                    <strong>Debug:</strong> {search.debugInfo}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
