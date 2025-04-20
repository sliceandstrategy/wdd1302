import { type NextRequest, NextResponse } from "next/server"
import { trackBrandInChatGPT } from "@/lib/openai-tracker"

// The API key would be stored as an environment variable on the server
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { keyword, brand } = await request.json()

    if (!keyword || !brand) {
      return NextResponse.json({ error: "Keyword and brand are required" }, { status: 400 })
    }

    // Check if we have an OpenAI API key
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured. Please add your OPENAI_API_KEY to the environment variables.",
        },
        { status: 500 },
      )
    }

    const results = await trackBrandInChatGPT(keyword, brand)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in ChatGPT tracking API:", error)
    return NextResponse.json({ error: "Failed to track brand position in ChatGPT" }, { status: 500 })
  }
}
