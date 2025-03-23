import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { SqlQueryProvider } from "@/contexts/sql-query-context"
import { SqlQuerySidebar } from "@/components/sql-query-sidebar"
import { FetchInterceptorInitializer } from "@/components/fetch-interceptor-initializer"
import { ServerSqlTracker } from "@/components/server-sql-tracker"
import "./globals.css"
import { Hotel } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>E-Hotel Booking</title>
        <meta name="description" content="Book luxury rooms across five major hotel chains" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SqlQueryProvider>
            <FetchInterceptorInitializer />
            <ServerSqlTracker />

            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <SqlQuerySidebar />
            <Toaster />
          </SqlQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

