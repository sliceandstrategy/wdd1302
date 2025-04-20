import { type NextRequest, NextResponse } from "next/server"
import { trackBrandInDeepSeek } from "@/lib/deepseek-tracker"

// The API key would be stored as an environment variable on the server
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { keyword, brand } = await request.json()

    if (!keyword || !brand) {
      return NextResponse.json({ error: "Keyword and brand are required" }, { status: 400 })
    }

    // Check if we have a DeepSeek API key
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        {
          error: "DeepSeek API key is not configured. Please add your DEEPSEEK_API_KEY to the environment variables.",
        },
        { status: 500 },
      )
    }

    const results = await trackBrandInDeepSeek(keyword, brand)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in DeepSeek tracking API:", error)
    return NextResponse.json({ error: "Failed to track brand position in DeepSeek" }, { status: 500 })
  }
}
