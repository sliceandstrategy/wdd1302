/**
 * Utility function to fetch with retry capability
 * @param url The URL to fetch
 * @param options Fetch options
 * @param retries Number of retries
 * @param backoff Initial backoff in ms (will be doubled for each retry)
 * @returns Promise with the fetch response
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = 300,
): Promise<Response> {
  try {
    const response = await fetch(url, options)

    // If the request was successful, return the response
    if (response.ok) return response

    // If we have no more retries, throw an error
    if (retries <= 0) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)

    // Wait for the backoff period
    await new Promise((resolve) => setTimeout(resolve, backoff))

    // Retry with one less retry and double the backoff
    console.log(`Retrying fetch to ${url}, ${retries} retries left`)
    return fetchWithRetry(url, options, retries - 1, backoff * 2)
  } catch (error) {
    if (retries <= 0) throw error

    // Wait for the backoff period
    await new Promise((resolve) => setTimeout(resolve, backoff))

    // Retry with one less retry and double the backoff
    console.log(`Retrying fetch to ${url} after error: ${error}, ${retries} retries left`)
    return fetchWithRetry(url, options, retries - 1, backoff * 2)
  }
}
