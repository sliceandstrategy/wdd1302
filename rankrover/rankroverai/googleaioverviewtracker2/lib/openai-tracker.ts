import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Generate variations of a prompt to test brand mentions
const promptVariations = [
  "What are the best {keyword} options?",
  "List top companies for {keyword}",
  "Compare {keyword} providers",
  "Who offers the best {keyword} services?",
  "Recommend {keyword} solutions",
  "What are some good {keyword} alternatives?",
  "Which {keyword} companies should I consider?",
  "What are the most popular {keyword} brands?",
  "Tell me about {keyword} companies",
  "What are reliable {keyword} services?",
  "Top rated {keyword} providers",
  "Best {keyword} companies in the market",
  "Leading {keyword} solutions",
  "Most trusted {keyword} options",
  "Affordable {keyword} services",
  "Premium {keyword} providers",
  "Industry-leading {keyword} companies",
  "Innovative {keyword} solutions",
  "Established {keyword} brands",
  "Emerging {keyword} startups",
]

interface ChatGPTResult {
  position: number | null
  prompt: string
  response: string
  sentiment: "positive" | "neutral" | "negative"
  debugInfo?: string
}

// Lists of sentiment words for basic sentiment analysis
const positiveWords = [
  "good",
  "great",
  "excellent",
  "amazing",
  "outstanding",
  "best",
  "top",
  "superior",
  "exceptional",
  "fantastic",
  "wonderful",
  "impressive",
  "remarkable",
  "quality",
  "reliable",
  "trusted",
  "leading",
  "innovative",
  "advanced",
  "recommended",
  "popular",
  "favorite",
  "preferred",
  "premium",
  "professional",
  "expert",
  "efficient",
  "effective",
  "successful",
  "satisfied",
  "happy",
  "pleased",
  "delighted",
  "perfect",
  "ideal",
  "excellent",
  "superb",
  "brilliant",
  "stellar",
  "outstanding",
  "terrific",
]

const negativeWords = [
  "bad",
  "poor",
  "terrible",
  "awful",
  "worst",
  "inferior",
  "disappointing",
  "subpar",
  "mediocre",
  "unreliable",
  "problematic",
  "issues",
  "concerns",
  "complaints",
  "flawed",
  "defective",
  "overpriced",
  "expensive",
  "costly",
  "cheap",
  "low-quality",
  "frustrating",
  "difficult",
  "complicated",
  "confusing",
  "slow",
  "inefficient",
  "ineffective",
  "unsuccessful",
  "unsatisfied",
  "unhappy",
  "displeased",
  "disappointed",
  "avoid",
  "not recommended",
  "negative",
  "terrible",
  "horrible",
  "useless",
]

export async function trackBrandInChatGPT(keyword: string, brand: string, count = 20) {
  console.log(`Starting brand tracking in ChatGPT for keyword: "${keyword}", brand: "${brand}"`)

  // Select random variations up to the requested count
  const shuffledVariations = [...promptVariations].sort(() => 0.5 - Math.random())
  const selectedVariations = shuffledVariations.slice(0, count)

  const results = {
    averagePosition: null as number | null,
    searchCount: selectedVariations.length,
    foundCount: 0,
    sentimentCounts: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
    searches: [] as ChatGPTResult[],
  }

  // Process each prompt variation
  for (let i = 0; i < selectedVariations.length; i++) {
    const promptTemplate = selectedVariations[i]
    const prompt = promptTemplate.replace("{keyword}", keyword)

    try {
      console.log(`Checking brand position for prompt: "${prompt}"`)

      // Generate response from ChatGPT
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
        system:
          "You are a helpful assistant providing information about products and services. Be informative and list multiple options when appropriate.",
      })

      // Find brand position and sentiment in the response
      const { position, sentiment, debugInfo } = findBrandPositionAndSentiment(text, brand)

      // Get a snippet of the response
      const responseSnippet = text.substring(0, 200) + "..."

      results.searches.push({
        position,
        prompt,
        response: responseSnippet,
        sentiment,
        debugInfo,
      })

      if (position !== null) {
        console.log(`Brand found at position ${position} for prompt "${prompt}" with sentiment: ${sentiment}`)
        results.foundCount++
        results.sentimentCounts[sentiment]++
      } else {
        console.log(`Brand not found in response for prompt "${prompt}"`)
      }
    } catch (error) {
      console.error(`Error checking brand position for prompt "${prompt}":`, error)
      results.searches.push({
        position: null,
        prompt,
        response: "Error generating response",
        sentiment: "neutral",
        debugInfo: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Calculate average position if brand was found in any searches
  if (results.foundCount > 0) {
    const sum = results.searches
      .filter((search) => search.position !== null)
      .reduce((acc, search) => acc + (search.position as number), 0)

    results.averagePosition = sum / results.foundCount
    console.log(`Calculated average position: ${results.averagePosition}`)
  }

  console.log("Final results:", JSON.stringify(results, null, 2))
  return results
}

function findBrandPositionAndSentiment(
  text: string,
  brand: string,
): {
  position: number | null
  sentiment: "positive" | "neutral" | "negative"
  debugInfo: string
} {
  // Normalize the brand name for more reliable matching
  const normalizedBrand = brand.toLowerCase().trim()
  const normalizedText = text.toLowerCase()

  if (!normalizedText.includes(normalizedBrand)) {
    return {
      position: null,
      sentiment: "neutral",
      debugInfo: `Brand "${brand}" not found in response.`,
    }
  }

  // Split the text into paragraphs or sections
  const paragraphs = text.split(/\n\n+/)
  let brandSentiment: "positive" | "neutral" | "negative" = "neutral"
  let brandContext = ""

  // Find which paragraph contains the brand
  for (let i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].toLowerCase().includes(normalizedBrand)) {
      // If found in a list, try to determine the position within the list
      const listItems = paragraphs[i].split(/\n\d+\.|\n-|\n\*/)
      brandContext = paragraphs[i]

      if (listItems.length > 1) {
        // This might be a list, check each item
        for (let j = 0; j < listItems.length; j++) {
          if (listItems[j].toLowerCase().includes(normalizedBrand)) {
            // Analyze sentiment in this list item
            brandSentiment = analyzeSentiment(listItems[j], normalizedBrand)
            brandContext = listItems[j]

            return {
              position: j,
              sentiment: brandSentiment,
              debugInfo: `Found in list item ${j} of paragraph ${i + 1} with ${brandSentiment} sentiment: "${listItems[j].substring(0, 100)}..."`,
            }
          }
        }
      }

      // If not found in a list or not a list, analyze sentiment in this paragraph
      brandSentiment = analyzeSentiment(paragraphs[i], normalizedBrand)

      // Return paragraph position
      return {
        position: i + 1,
        sentiment: brandSentiment,
        debugInfo: `Found in paragraph ${i + 1} with ${brandSentiment} sentiment: "${paragraphs[i].substring(0, 100)}..."`,
      }
    }
  }

  // If we get here, the brand was found in the text but we couldn't determine a specific position
  // This is a fallback
  brandSentiment = analyzeSentiment(text, normalizedBrand)
  return {
    position: 1,
    sentiment: brandSentiment,
    debugInfo: `Brand found in text with ${brandSentiment} sentiment but position detection failed. This might be due to content structure.`,
  }
}

function analyzeSentiment(text: string, brand: string): "positive" | "neutral" | "negative" {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()

  // Find the brand mention and get surrounding context (50 chars before and after)
  const brandIndex = lowerText.indexOf(brand.toLowerCase())
  if (brandIndex === -1) return "neutral"

  const startIndex = Math.max(0, brandIndex - 50)
  const endIndex = Math.min(lowerText.length, brandIndex + brand.length + 50)
  const context = lowerText.substring(startIndex, endIndex)

  // Count positive and negative words in the context
  let positiveCount = 0
  let negativeCount = 0

  for (const word of positiveWords) {
    if (context.includes(word)) positiveCount++
  }

  for (const word of negativeWords) {
    if (context.includes(word)) negativeCount++
  }

  // Determine sentiment based on counts
  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}
