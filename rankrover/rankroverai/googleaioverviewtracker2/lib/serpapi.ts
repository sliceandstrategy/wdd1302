import { generateAndProcessPageTokens } from "./google-search"

interface AIOverviewResult {
  search_metadata: {
    id: string
    status: string
  }
  search_parameters?: {
    engine: string
    q?: string
  }
  ai_overview?: {
    text_blocks: Array<{
      type: string
      snippet?: string
      list?: Array<{
        title?: string
        snippet?: string
      }>
    }>
    references: Array<{
      title: string
      link: string
      source: string
    }>
  }
  error?: string
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

export async function trackBrandPosition(keyword: string, brand: string, apiKey: string) {
  console.log(`Starting brand position tracking for keyword: "${keyword}", brand: "${brand}"`)

  // Use the new function that processes tokens immediately
  const processedResults = await generateAndProcessPageTokens(keyword, 20, apiKey)

  console.log(`Found ${processedResults.length} real AI Overview results with data`)

  const results = {
    averagePosition: null as number | null,
    searchCount: processedResults.length,
    foundCount: 0,
    sentimentCounts: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
    searches: [] as Array<{
      position: number | null
      pageToken: string
      query: string
      sentiment?: "positive" | "neutral" | "negative"
      searchDetails: {
        contentSnippet?: string
        referenceCount?: number
        debugInfo?: string
      }
    }>,
  }

  // If no results were found, return early
  if (processedResults.length === 0) {
    console.log("No AI Overview results found, returning early")
    return results
  }

  // Process each result
  for (const result of processedResults) {
    const { pageToken, query, aiOverviewData } = result

    try {
      console.log(`Analyzing brand position for query "${query}" with page token: ${pageToken.substring(0, 20)}...`)

      // Skip if we don't have AI Overview data
      if (!aiOverviewData || !aiOverviewData.ai_overview) {
        console.log(`No AI Overview data available for query "${query}"`)
        results.searches.push({
          pageToken,
          position: null,
          query,
          searchDetails: {},
        })
        continue
      }

      // Get a snippet of content to show in results
      const firstSnippet =
        aiOverviewData.ai_overview.text_blocks
          .find((block) => block.type === "paragraph" && block.snippet)
          ?.snippet?.substring(0, 100) + "..."

      // Search for the brand in the AI Overview content with improved detection
      const { position, sentiment, debugInfo } = findBrandPositionInAIOverview(aiOverviewData.ai_overview, brand)

      results.searches.push({
        pageToken,
        position,
        query,
        sentiment,
        searchDetails: {
          contentSnippet: firstSnippet,
          referenceCount: aiOverviewData.ai_overview.references.length,
          debugInfo,
        },
      })

      if (position !== null) {
        console.log(`Brand found at position ${position} for query "${query}" with sentiment: ${sentiment}`)
        results.foundCount++
        if (sentiment) {
          results.sentimentCounts[sentiment]++
        }
      } else {
        console.log(`Brand not found in AI Overview for query "${query}"`)
      }
    } catch (error) {
      console.error(`Error analyzing brand position for query "${query}":`, error)
      results.searches.push({
        pageToken,
        position: null,
        query,
        searchDetails: {},
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

// The rest of the functions remain the same
function findBrandPositionInAIOverview(
  aiOverview: AIOverviewResult["ai_overview"],
  brand: string,
): {
  position: number | null
  sentiment: "positive" | "neutral" | "negative"
  debugInfo: string
} {
  if (!aiOverview) return { position: null, sentiment: "neutral", debugInfo: "No AI Overview data" }

  // Normalize the brand name for more reliable matching
  const normalizedBrand = brand.toLowerCase().trim()
  let debugInfo = ""
  let position = 1
  let allContent = ""
  let brandSentiment: "positive" | "neutral" | "negative" = "neutral"
  const brandContext = ""

  console.log(`Searching for brand "${brand}" in AI Overview content`)

  // Check in text blocks
  for (const block of aiOverview.text_blocks) {
    // Check paragraph snippets
    if (block.type === "paragraph" && block.snippet) {
      const normalizedSnippet = block.snippet.toLowerCase()
      allContent += normalizedSnippet + " "

      if (normalizedSnippet.includes(normalizedBrand)) {
        console.log(`Found brand in paragraph at position ${position}`)
        console.log(`Content snippet: "${block.snippet.substring(0, 100)}..."`)

        // Analyze sentiment
        brandSentiment = analyzeSentiment(block.snippet, normalizedBrand)

        return {
          position,
          sentiment: brandSentiment,
          debugInfo: `Found in paragraph with ${brandSentiment} sentiment: "${block.snippet.substring(0, 100)}..."`,
        }
      }
      position++
    }

    // Check list items
    if (block.type === "list" && block.list) {
      for (const item of block.list) {
        const itemText = (item.title || "") + " " + (item.snippet || "")
        const normalizedItemText = itemText.toLowerCase()
        allContent += normalizedItemText + " "

        if (normalizedItemText.includes(normalizedBrand)) {
          console.log(`Found brand in list item at position ${position}`)
          console.log(`Content snippet: "${itemText.substring(0, 100)}..."`)

          // Analyze sentiment
          brandSentiment = analyzeSentiment(itemText, normalizedBrand)

          return {
            position,
            sentiment: brandSentiment,
            debugInfo: `Found in list item with ${brandSentiment} sentiment: "${itemText.substring(0, 100)}..."`,
          }
        }
        position++
      }
    }
  }

  // Check in references
  for (const reference of aiOverview.references) {
    const refText = reference.title + " " + reference.source
    const normalizedRefText = refText.toLowerCase()
    allContent += normalizedRefText + " "

    if (normalizedRefText.includes(normalizedBrand)) {
      console.log(`Found brand in reference at position ${position}`)
      console.log(`Reference: "${reference.title}" from ${reference.source}`)

      // Analyze sentiment
      brandSentiment = analyzeSentiment(refText, normalizedBrand)

      return {
        position,
        sentiment: brandSentiment,
        debugInfo: `Found in reference with ${brandSentiment} sentiment: "${reference.title}" from ${reference.source}`,
      }
    }
    position++
  }

  // If we didn't find the brand with direct matching, check if it appears in the content at all
  if (allContent.includes(normalizedBrand)) {
    // Analyze sentiment in the entire content
    brandSentiment = analyzeSentiment(allContent, normalizedBrand)

    debugInfo = `Brand found in content with ${brandSentiment} sentiment but position detection failed. This might be due to content structure.`
    console.log(debugInfo)
    return { position: 1, sentiment: brandSentiment, debugInfo } // Default to position 1 if found but position detection failed
  }

  console.log("Brand not found in AI Overview content")
  debugInfo = `Brand "${brand}" not found in content. Content sample: "${allContent.substring(0, 200)}..."`
  return { position: null, sentiment: "neutral", debugInfo }
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

// Helper function to escape special characters in regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
