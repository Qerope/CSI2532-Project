import type { SqlQuery } from "@/contexts/sql-query-context"

const originalFetch = global.fetch
type SqlQueryCallback = (query: Omit<SqlQuery, "id" | "timestamp">) => void
let globalSqlQueryCallback: SqlQueryCallback | null = null
export function setGlobalSqlQueryCallback(callback: SqlQueryCallback | null) {
  globalSqlQueryCallback = callback
}

global.fetch = async function interceptedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const startTime = performance.now()

  try {
    const response = await originalFetch(input, init)

    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url

    const sqlQueriesHeader = response.headers.get("x-sql-queries")

    if (sqlQueriesHeader && globalSqlQueryCallback) {
      try {
        const sqlQueries = JSON.parse(sqlQueriesHeader)

        // Process each query
        sqlQueries.forEach((queryData: any) => {
          globalSqlQueryCallback!({
            query: queryData.query,
            params: queryData.params || [],
            endpoint: url,
            duration: queryData.duration,
            rowCount: queryData.rowCount,
          })
        })
      } catch (error) {
        console.error("Failed to parse SQL queries header:", error)
      }
    }

    // Return the original response
    return response
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  } finally {
    const endTime = performance.now()
    console.log(`Fetch to ${typeof input === "string" ? input : "URL"} took ${endTime - startTime}ms`)
  }
}

// Function to restore the original fetch (useful for testing)
export function restoreOriginalFetch() {
  global.fetch = originalFetch
}

