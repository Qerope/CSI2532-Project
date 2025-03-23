"use client"

import { useEffect } from "react"
import { useSqlQueries } from "@/contexts/sql-query-context"

export function ServerSqlTracker() {
  const { addQuery } = useSqlQueries()

  useEffect(() => {
    // Function to check for server SQL queries in cookies
    const checkForServerQueries = () => {
      const cookies = document.cookie.split(";")

      // Find the server-sql-queries cookie
      const sqlQueriesCookie = cookies.find((cookie) => cookie.trim().startsWith("server-sql-queries="))

      if (sqlQueriesCookie) {
        try {
          // Extract the value
          const cookieValue = sqlQueriesCookie.split("=")[1]

          // Decode and parse
          const sqlQueries = JSON.parse(decodeURIComponent(cookieValue))

          // Add each query to the context
          sqlQueries.forEach((queryData: any) => {
            addQuery({
              query: queryData.query,
              params: queryData.params || [],
              endpoint: window.location.pathname,
              duration: queryData.duration,
              rowCount: queryData.rowCount,
            })
          })

          // Clear the cookie
          document.cookie = "server-sql-queries=; Max-Age=0; path=/;"
        } catch (error) {
          console.error("Failed to parse server SQL queries:", error)
        }
      }
    }

    // Check immediately
    checkForServerQueries()

    // Also set up an interval to check periodically
    const intervalId = setInterval(checkForServerQueries, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [addQuery])

  // This component doesn't render anything
  return null
}

