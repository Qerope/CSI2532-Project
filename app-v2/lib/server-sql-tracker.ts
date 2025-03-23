
export function trackServerSqlQueries(response: Response): Response {
  // Extract SQL queries from headers
  const sqlQueriesHeader = response.headers.get("x-sql-queries")

  console.log("SQLQ:" + response)
  if (sqlQueriesHeader) {
        console.log("SQLQ:" + sqlQueriesHeader)
    try {
    } catch (error) {
      console.error("Failed to set SQL queries cookie:", error)
    }
  }

  return response
}

