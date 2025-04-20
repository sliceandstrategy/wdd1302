"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleAIResults } from "@/components/google-ai-results"
import { ChatGPTResults } from "@/components/chatgpt-results"
import { DeepSeekResults } from "@/components/deepseek-results"

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
    pageToken?: string
    query?: string
    prompt?: string
    response?: string
    sentiment?: "positive" | "neutral" | "negative"
    searchDetails?: {
      contentSnippet?: string
      referenceCount?: number
      debugInfo?: string
    }
  }>
}

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [brand, setBrand] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleResults, setGoogleResults] = useState<SearchResult | null>(null)
  const [chatgptResults, setChatgptResults] = useState<SearchResult | null>(null)
  const [deepseekResults, setDeepseekResults] = useState<SearchResult | null>(null)
  const [activeTab, setActiveTab] = useState("google")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!keyword.trim() || !brand.trim()) {
      setError("Please enter both a keyword and brand name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Run all searches in parallel
      const [googleResponse, chatgptResponse, deepseekResponse] = await Promise.all([
        fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, brand }),
        }),
        fetch("/api/chatgpt-track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, brand }),
        }),
        fetch("/api/deepseek-track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, brand }),
        }),
      ])

      if (!googleResponse.ok) {
        const errorData = await googleResponse.json()
        throw new Error(errorData.error || "Failed to track brand position in Google AI Overview")
      }

      if (!chatgptResponse.ok) {
        const errorData = await chatgptResponse.json()
        throw new Error(errorData.error || "Failed to track brand position in ChatGPT")
      }

      if (!deepseekResponse.ok) {
        const errorData = await deepseekResponse.json()
        throw new Error(errorData.error || "Failed to track brand position in DeepSeek")
      }

      const googleData = await googleResponse.json()
      const chatgptData = await chatgptResponse.json()
      const deepseekData = await deepseekResponse.json()

      setGoogleResults(googleData)
      setChatgptResults(chatgptData)
      setDeepseekResults(deepseekData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while tracking the brand position")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col p-4 bg-[#F9F9FA]">
        <div className="max-w-5xl mx-auto w-full">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h1 className="text-2xl font-heading mb-2">Track brand visibility across AI platforms</h1>
                <p className="text-gray-500">
                  Monitor your brand's position and sentiment in Google AI Overview, ChatGPT, and DeepSeek responses
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-sm font-medium mb-2 uppercase text-gray-500">Search Keywords</h2>
                    <Input
                      placeholder="Enter search keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      disabled={loading}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the search query you want to test across AI platforms
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium mb-2 uppercase text-gray-500">Brands to Track</h2>
                    <Input
                      placeholder="Enter brand to track"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      disabled={loading}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the brand name to check for in results</p>
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full mt-6 bg-blue hover:bg-blue/90" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Searches...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search AI Platforms
                    </>
                  )}
                </Button>
              </div>

              {(googleResults || chatgptResults || deepseekResults) && (
                <div className="bg-white rounded-lg border p-4">
                  <div className="mb-4 border-b pb-2">
                    <h2 className="text-xl font-heading">
                      Query: <span className="font-normal">{keyword}</span>
                    </h2>
                    <h2 className="text-xl font-heading">
                      Brands tracked: <span className="font-normal">{brand}</span>
                    </h2>
                  </div>

                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="google">GOOGLE AI OVERVIEW</TabsTrigger>
                      <TabsTrigger value="chatgpt">CHATGPT</TabsTrigger>
                      <TabsTrigger value="deepseek">DEEPSEEK</TabsTrigger>
                    </TabsList>

                    <TabsContent value="google">
                      {googleResults && <GoogleAIResults results={googleResults} />}
                    </TabsContent>

                    <TabsContent value="chatgpt">
                      {chatgptResults && <ChatGPTResults results={chatgptResults} />}
                    </TabsContent>

                    <TabsContent value="deepseek">
                      {deepseekResults && <DeepSeekResults results={deepseekResults} />}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
