import type { SqlQuery } from "@/contexts/sql-query-context"

type FetchWithSqlCallback = (query: Omit<SqlQuery, "id" | "timestamp">) => void

export async function fetchWithSql(
  url: string,
  options?: RequestInit,
  onSqlQuery?: FetchWithSqlCallback,
): Promise<Response> {
  const startTime = performance.now()

  try {
    const response = await fetch(url, options)

    // Extract SQL queries from headers
    const sqlQueriesHeader = response.headers.get("x-sql-queries")

    if (sqlQueriesHeader && onSqlQuery) {
      try {
        const sqlQueries = JSON.parse(sqlQueriesHeader)

        // Process each query
        sqlQueries.forEach((queryData: any) => {
          onSqlQuery({
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

    return response
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  } finally {
    const endTime = performance.now()
    console.log(`Fetch to ${url} took ${endTime - startTime}ms`)
  }
}

