"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export function UserNav() {
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"guest" | "employee" | null>(null)

  const handleLogin = (type: "guest" | "employee") => {
    setIsLoggedIn(true)
    setUserType(type)
    toast({
      title: "Logged in successfully",
      description: `You are now logged in as a ${type}.`,
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserType(null)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Login As</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLogin("guest")}>Guest</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLogin("employee")}>Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userType === "guest" ? "G" : "E"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userType === "guest" ? "Guest User" : "Employee"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userType === "guest" ? "Customer" : "Staff Member"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={userType === "guest" ? "/profile" : "/employee/dashboard"}>
            {userType === "guest" ? "Profile" : "Dashboard"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={userType === "guest" ? "/reservations" : "/employee/rentals"}>
            {userType === "guest" ? "My Reservations" : "Manage Rentals"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

