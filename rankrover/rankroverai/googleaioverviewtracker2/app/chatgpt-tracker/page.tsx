"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, MessageSquare, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/components/header"

interface SearchResult {
  averagePosition: number | null
  searchCount: number
  foundCount: number
  searches: Array<{
    position: number | null
    prompt: string
    response: string
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
  if (foundCount > 5) {
    return { level: "STRONG", color: "#4CAF50" } // Green for strong presence
  } else if (foundCount >= 3) {
    return { level: "MODERATE", color: "#FFC107" } // Yellow for moderate presence
  } else {
    return { level: "WEAK", color: "#FF5252" } // Red for weak presence
  }
}

// Function to get color for found count
function getFoundCountColor(foundCount: number): string {
  if (foundCount < 2) {
    return "#FF5252" // Red
  } else if (foundCount < 4) {
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

export default function ChatGPTTracker() {
  const [keyword, setKeyword] = useState("")
  const [brand, setBrand] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyword.trim() || !brand.trim()) {
      setError("Please enter both a keyword and brand name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chatgpt-track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword, brand }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to track brand position in ChatGPT")
      }

      const trackingResults = await response.json()
      setResults(trackingResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while tracking the brand position")
    } finally {
      setLoading(false)
    }
  }

  // Calculate presence level if results exist
  const presence = results?.averagePosition ? getPresenceLevel(results.averagePosition, results.foundCount) : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-[#F9F9FA]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-heading">ChatGPT Brand Tracker</CardTitle>
            </div>
            <CardDescription>Track your brand's position in ChatGPT responses</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-heading">20 Unique Prompts</AlertTitle>
              <AlertDescription>
                This tool runs 20 different prompts to track your brand's position in ChatGPT responses. It shows how
                often your brand is mentioned and where it appears compared to competitors.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword/Industry</Label>
                <Input
                  id="keyword"
                  placeholder="Enter industry or product category"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand Name</Label>
                <Input
                  id="brand"
                  placeholder="Enter brand to track"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue hover:bg-blue/90" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running 20 ChatGPT Prompts...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Track Position
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {results && (
            <CardFooter className="flex flex-col">
              <div className="w-full p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-heading font-medium mb-4">Results</h3>

                {results.searchCount === 0 ? (
                  <p className="text-gray-600">No ChatGPT results found for this keyword.</p>
                ) : results.foundCount === 0 ? (
                  <p className="text-gray-600">
                    ChatGPT responses generated, but your brand was not mentioned in any results.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Average Position</p>
                        <p
                          className="text-4xl font-bold font-heading"
                          style={{ color: getPositionColor(results.averagePosition) }}
                        >
                          {results.averagePosition !== null ? results.averagePosition.toFixed(1) : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Found In Prompts</p>
                        <p
                          className="text-4xl font-bold font-heading"
                          style={{ color: getFoundCountColor(results.foundCount) }}
                        >
                          {results.foundCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase">Total Prompts</p>
                        <p className="text-4xl font-bold font-heading text-blue">{results.searchCount}</p>
                      </div>
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
                        Your brand was mentioned in {results.foundCount} out of {results.searchCount} ChatGPT responses.
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
                              {search.response && (
                                <div className="mt-1 text-xs text-gray-500 italic">"{search.response}"</div>
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
                  </>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  )
}
