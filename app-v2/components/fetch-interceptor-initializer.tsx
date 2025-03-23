"use client"

import { useEffect } from "react"
import "@/lib/fetch-interceptor" 

export function FetchInterceptorInitializer() {
  useEffect(() => {
    console.log("Fetch interceptor initialized")

    return () => {
    }
  }, [])

  return null
}

