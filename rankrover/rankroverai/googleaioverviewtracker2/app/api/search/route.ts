import { type NextRequest, NextResponse } from "next/server"
import { trackBrandPosition } from "@/lib/serpapi"

// The API key would be stored as an environment variable on the server
const SERPAPI_KEY = process.env.SERPAPI_KEY || "7d2e73dc5376935f95ab7440e4e253db632304b888a4f06bcc76c5cfd41f1f52"

export async function POST(request: NextRequest) {
  try {
    const { keyword, brand } = await request.json()

    if (!keyword || !brand) {
      return NextResponse.json({ error: "Keyword and brand are required" }, { status: 400 })
    }

    // Use the server-side API key instead of requiring it from the client
    const results = await trackBrandPosition(keyword, brand, SERPAPI_KEY)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Failed to track brand position" }, { status: 500 })
  }
}
