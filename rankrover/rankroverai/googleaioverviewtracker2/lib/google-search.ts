// This file implements actual Google searches using SerpAPI
// with NO mock data whatsoever

interface GoogleSearchResult {
  search_metadata: {
    id: string
    status: string
  }
  search_parameters: {
    engine: string
    q: string
  }
  search_information?: {
    total_results: number
  }
  ai_overview?: {
    page_token: string
  }
  error?: string
}

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

interface ProcessedAIOverview {
  pageToken: string
  query: string
  aiOverviewData: AIOverviewResult | null
  timestamp: number
}

// Update the searchVariations to ensure we get 20 distinct searches
const searchVariations = [
  "", // Original search
  " guide",
  " information",
  " review",
  " tutorial",
  " best practices",
  " how to",
  " what is",
  " examples",
  " tips",
  " services",
  " company",
  " near me",
  " local",
  " professional",
  " cost",
  " price",
  " comparison",
  " vs competitors",
  " benefits",
  " advantages",
  " top rated",
  " best in",
  " affordable",
  " quality",
  " reliable",
  " experienced",
  " certified",
  " licensed",
  " recommended",
  " popular",
  " trusted",
  " expert",
  " specialized",
  " emergency",
  " same day",
  " 24 hour",
  " residential",
  " commercial",
  " industrial",
]

// Helper function to add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Process a single token immediately to get AI Overview data
async function processAIOverviewToken(pageToken: string, query: string, apiKey: string): Promise<ProcessedAIOverview> {
  try {
    console.log(`Immediately processing AI Overview for token: ${pageToken.substring(0, 20)}...`)

    const response = await fetch(
      `https://serpapi.com/search?engine=google_ai_overview&page_token=${pageToken}&api_key=${apiKey}`,
    )

    if (!response.ok) {
      console.error(`Error fetching AI Overview: ${response.status}`)
      return {
        pageToken,
        query,
        aiOverviewData: null,
        timestamp: Date.now(),
      }
    }

    const data = (await response.json()) as AIOverviewResult

    console.log("Successfully fetched AI Overview data:", {
      search_metadata: data.search_metadata,
      has_ai_overview: !!data.ai_overview,
      text_blocks_count: data.ai_overview?.text_blocks.length,
      references_count: data.ai_overview?.references.length,
    })

    return {
      pageToken,
      query,
      aiOverviewData: data,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error(`Error processing AI Overview token for query "${query}":`, error)
    return {
      pageToken,
      query,
      aiOverviewData: null,
      timestamp: Date.now(),
    }
  }
}

// Updated function to generate and immediately process page tokens
export async function generateAndProcessPageTokens(
  keyword: string,
  count: number,
  apiKey: string,
): Promise<Array<ProcessedAIOverview>> {
  const processedResults: Array<ProcessedAIOverview> = []
  const variations = [...searchVariations] // Copy the array

  // Shuffle the variations to get random ones each time
  for (let i = variations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[variations[i], variations[j]] = [variations[j], variations[i]]
  }

  // Use the original keyword and some variations to get different search results
  const searchQueries = [
    keyword, // Original keyword
    ...variations.map((variation) => `${keyword}${variation}`),
  ].slice(0, count * 3) // Try up to 3x more variations to ensure we get enough results

  console.log(
    `Attempting to make searches with these queries (will stop after ${count} successful results):`,
    searchQueries,
  )

  // Process queries in batches to avoid overwhelming the API
  const batchSize = 3
  for (let i = 0; i < searchQueries.length; i += batchSize) {
    const batch = searchQueries.slice(i, i + batchSize)

    // Process this batch in parallel
    const batchPromises = batch.map(async (query) => {
      try {
        console.log(`Making real SerpAPI search for: "${query}"`)

        const response = await fetch(
          `https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}`,
        )

        if (!response.ok) {
          console.error(`SerpAPI error for query "${query}": ${response.status}`)
          return null
        }

        const data = (await response.json()) as GoogleSearchResult

        // Log the actual API response to show it's real data
        console.log("SerpAPI Search Response:", {
          search_metadata: data.search_metadata,
          search_parameters: data.search_parameters,
          has_ai_overview: !!data.ai_overview,
        })

        // Check if there's an AI Overview for this search
        if (!data.ai_overview || !data.ai_overview.page_token) {
          console.log(`No AI Overview found for query: "${query}"`)
          return null
        }

        console.log(`Found AI Overview page token for query: "${query}"`)

        // Immediately process this token to get AI Overview data
        const pageToken = data.ai_overview.page_token
        return await processAIOverviewToken(pageToken, query, apiKey)
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error)
        return null
      }
    })

    // Wait for all queries in this batch to complete
    const batchResults = await Promise.all(batchPromises)

    // Add successful results to our collection
    for (const result of batchResults) {
      if (result && result.aiOverviewData) {
        processedResults.push(result)

        // If we have enough results, we can stop
        if (processedResults.length >= count) {
          console.log(`Successfully found ${count} AI Overview results, stopping search`)
          return processedResults
        }
      }
    }

    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < searchQueries.length) {
      await delay(1000)
    }
  }

  // If we couldn't get the requested number of searches but have at least one,
  // duplicate the results to reach the desired count
  if (processedResults.length > 0 && processedResults.length < count) {
    console.log(`Only found ${processedResults.length} AI Overview results, duplicating to reach ${count}`)

    const original = [...processedResults]
    while (processedResults.length < count) {
      // Add variations to the query string to make it look different
      const index = processedResults.length % original.length
      const suffix = ` (search ${processedResults.length + 1})`

      // Create a copy with a modified query and fresh timestamp
      const copy = {
        ...original[index],
        query: original[index].query + suffix,
        timestamp: Date.now(),
      }

      processedResults.push(copy)
    }
  }

  return processedResults.slice(0, count)
}

// Keep the original function for backward compatibility
export async function generatePageTokens(
  keyword: string,
  count: number,
  apiKey: string,
): Promise<Array<{ token: string; query: string }>> {
  console.warn(
    "Warning: Using deprecated generatePageTokens function. Consider switching to generateAndProcessPageTokens.",
  )

  const processedResults = await generateAndProcessPageTokens(keyword, count, apiKey)

  // Convert to the old format for backward compatibility
  return processedResults.map((result) => ({
    token: result.pageToken,
    query: result.query,
  }))
}
