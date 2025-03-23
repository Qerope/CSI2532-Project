"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setGlobalSqlQueryCallback } from "@/lib/fetch-interceptor"

export interface SqlQuery {
  id: string
  timestamp: Date
  query: string
  params: any[]
  endpoint: string
  duration?: number
  rowCount?: number
}

interface SqlQueryContextType {
  queries: SqlQuery[]
  addQuery: (query: Omit<SqlQuery, "id" | "timestamp">) => void
  clearQueries: () => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const SqlQueryContext = createContext<SqlQueryContextType | undefined>(undefined)

export function SqlQueryProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<SqlQuery[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Load queries from localStorage on mount
  useEffect(() => {
    const savedQueries = localStorage.getItem("sqlQueries")
    if (savedQueries) {
      try {
        const parsedQueries = JSON.parse(savedQueries)
        // Convert string timestamps back to Date objects
        const queriesWithDates = parsedQueries.map((q: any) => ({
          ...q,
          timestamp: new Date(q.timestamp),
        }))
        setQueries(queriesWithDates)
      } catch (error) {
        console.error("Failed to parse saved queries:", error)
      }
    }
  }, [])

  // Save queries to localStorage when updated
  useEffect(() => {
    localStorage.setItem("sqlQueries", JSON.stringify(queries))
  }, [queries])

  const addQuery = (query: Omit<SqlQuery, "id" | "timestamp">) => {
    const newQuery: SqlQuery = {
      ...query,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    }

    setQueries((prev) => [newQuery, ...prev].slice(0, 100)) // Keep only the last 100 queries

    // Auto-open sidebar on first query
    if (queries.length === 0) {
      setIsSidebarOpen(true)
    }
  }

  const clearQueries = () => {
    setQueries([])
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  // Set up the global callback when the component mounts
  useEffect(() => {
    setGlobalSqlQueryCallback(addQuery)

    // Clean up when the component unmounts
    return () => {
      setGlobalSqlQueryCallback(null)
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <SqlQueryContext.Provider
      value={{
        queries,
        addQuery,
        clearQueries,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </SqlQueryContext.Provider>
  )
}

export function useSqlQueries() {
  const context = useContext(SqlQueryContext)
  if (context === undefined) {
    throw new Error("useSqlQueries must be used within a SqlQueryProvider")
  }
  return context
}

