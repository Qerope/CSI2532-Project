"use client"

import { useCallback } from "react"
import { useSqlQueries } from "@/contexts/sql-query-context"

export function useFetchWithSql() {
  const { addQuery } = useSqlQueries()
  
  const fetchWithSql = useCallback(async (url: string, options?: RequestInit) => {
    const startTime = performance.now()
    
    try {
      const response = await fetch(url, options)
      
      // Clone the response to read headers without consuming the body
      const clonedResponse = response.clone()
      
      // Extract SQL queries from headers
      const sqlQueriesHeader = clonedResponse.headers.get("x-sql-queries")
      
      if (sqlQueriesHeader) {
        try {
          const sqlQueries = JSON.parse(sqlQueriesHeader)
          
          // Add each query to the context
          sqlQueries.forEach((queryData: any) => {
            addQuery({
              query: queryData.query,
              params: queryData.params || [],
              endpoint: url,
              duration: queryData.duration,
              rowCount: queryData.rowCount
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
  }, [addQuery])
  
  return fetchWithSql
}
