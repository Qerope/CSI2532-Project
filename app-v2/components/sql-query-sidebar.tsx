"use client"

import { useState, useEffect } from "react"
import { useSqlQueries, SqlQuery } from "@/contexts/sql-query-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ChevronLeft, Database, Clock, X, Copy, Trash2, DownloadCloud, Search, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SqlQuerySidebar() {
  const { queries, clearQueries, isSidebarOpen, toggleSidebar } = useSqlQueries()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [expandedQueries, setExpandedQueries] = useState<Record<string, boolean>>({})
  
  // Reset expanded state when queries change
  useEffect(() => {
    const newExpandedState: Record<string, boolean> = {}
    queries.forEach(query => {
      newExpandedState[query.id] = expandedQueries[query.id] || false
    })
    setExpandedQueries(newExpandedState)
  }, [queries])
  
  const toggleQueryExpanded = (id: string) => {
    setExpandedQueries(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  
  const copyQueryToClipboard = (query: string) => {
    navigator.clipboard.writeText(query)
      .then(() => {
        // Show toast or some feedback
        console.log("Query copied to clipboard")
      })
      .catch(err => {
        console.error("Failed to copy query:", err)
      })
  }
  
  const downloadQueriesAsJson = () => {
    const dataStr = JSON.stringify(queries, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `sql-queries-${format(new Date(), "yyyy-MM-dd-HH-mm")}.json`
    
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }
  
  // Filter queries based on search term and active tab
  const filteredQueries = queries.filter(query => {
    const matchesSearch = searchTerm === "" || 
      query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "select" && query.query.toLowerCase().trim().startsWith("select")) return matchesSearch
    if (activeTab === "insert" && query.query.toLowerCase().trim().startsWith("insert")) return matchesSearch
    if (activeTab === "update" && query.query.toLowerCase().trim().startsWith("update")) return matchesSearch
    if (activeTab === "delete" && query.query.toLowerCase().trim().startsWith("delete")) return matchesSearch
    
    return false
  })
  
  // Group queries by endpoint
  const queryGroups: Record<string, SqlQuery[]> = {}
  filteredQueries.forEach(query => {
    const endpoint = query.endpoint
    if (!queryGroups[endpoint]) {
      queryGroups[endpoint] = []
    }
    queryGroups[endpoint].push(query)
  })
  
  const formatSqlQuery = (query: string) => {
    return query
      .replace(
        /(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|SET|VALUES|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER|BEGIN|END|DECLARE|IF|ELSE|WHILE|RETURN|CASE|WHEN|THEN|ELSE|END)/g,
        '<span class="text-purple-400 font-semibold">$1</span>'
      )
      .replace(
        /( = |\*|\.|AS)/g,
        '<span class="text-red-400 font-semibold">$1</span>'
      )
  }
  
  // Get query type badge
  const getQueryTypeBadge = (query: string) => {
    const queryType = query.trim().split(" ")[0].toUpperCase()
    
    switch (queryType) {
      case "SELECT":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">SELECT</Badge>
      case "INSERT":
        return <Badge className="bg-green-100 text-green-800 border-green-200">INSERT</Badge>
      case "UPDATE":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">UPDATE</Badge>
      case "DELETE":
        return <Badge className="bg-red-100 text-red-800 border-red-200">DELETE</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{queryType}</Badge>
    }
  }
  
  if (!isSidebarOpen) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                size="icon" 
                onClick={toggleSidebar}
                className="rounded-l-lg rounded-r-none bg-hotel-600 hover:bg-hotel-700 shadow-md"
              >
                <Database className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Show SQL Queries ({queries.length})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-y-0 right-0 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Database className="h-5 w-5 text-hotel-600 mr-2" />
          <h2 className="text-lg font-semibold">SQL Query Inspector</h2>
          <Badge className="ml-2 bg-hotel-100 text-hotel-800 border-hotel-200">{queries.length}</Badge>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={downloadQueriesAsJson}>
                  <DownloadCloud className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Queries</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={clearQueries}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear All Queries</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="select">SELECT</TabsTrigger>
            <TabsTrigger value="insert">INSERT</TabsTrigger>
            <TabsTrigger value="update">UPDATE</TabsTrigger>
            <TabsTrigger value="delete">DELETE</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="flex-1 p-0">
          <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
            <div className="p-4 space-y-4">
              {Object.keys(queryGroups).length > 0 ? (
                Object.entries(queryGroups).map(([endpoint, endpointQueries]) => (
                  <div key={endpoint} className="space-y-2">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {endpoint}
                      </Badge>
                      <Badge className="ml-2 bg-gray-100 text-gray-700 border-gray-200">
                        {endpointQueries.length}
                      </Badge>
                    </div>
                    
                    {endpointQueries.map((query) => (
                      <Collapsible
                        key={query.id}
                        open={expandedQueries[query.id]}
                        onOpenChange={() => toggleQueryExpanded(query.id)}
                        className="border rounded-md bg-white overflow-hidden"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            {getQueryTypeBadge(query.query)}
                            <span className="text-sm font-medium truncate max-w-[200px]">
                              {query.query.substring(0, 30)}
                              {query.query.length > 30 ? "..." : ""}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {query.duration ? `${query.duration.toFixed(2)}ms` : "N/A"}
                            </Badge>
                            <ChevronRight className={`h-4 w-4 transition-transform ${expandedQueries[query.id] ? "rotate-90" : ""}`} />
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="p-3 border-t bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs text-gray-500">
                                {format(query.timestamp, "MMM d, yyyy HH:mm:ss")}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyQueryToClipboard(query.query)}
                                className="h-6 px-2"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            
                            <div className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto text-sm font-mono">
                              <pre 
                                dangerouslySetInnerHTML={{ 
                                  __html: formatSqlQuery(query.query) 
                                }} 
                              />
                            </div>
                            
                            {query.params && query.params.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs font-medium text-gray-500 mb-1">Parameters:</div>
                                <div className="bg-gray-100 p-2 rounded-md overflow-x-auto text-sm">
                                  <pre>{JSON.stringify(query.params, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                            
                            {query.rowCount !== undefined && (
                              <div className="mt-2 text-xs text-gray-500">
                                Rows affected: {query.rowCount}
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {queries.length === 0 ? (
                    <div>
                      <Database className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No SQL queries captured yet.</p>
                      <p className="text-sm">Queries will appear here as you use the application.</p>
                    </div>
                  ) : (
                    <div>
                      <Filter className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No queries match your filter.</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSearchTerm("")
                          setActiveTab("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
