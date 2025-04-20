"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 px-8 py-4 border-b bg-[#F9F9FA]">
      <Link href="/" passHref>
        <Button variant={pathname === "/" ? "default" : "outline"} className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          Google AI Tracker
        </Button>
      </Link>
      <Link href="/chatgpt-tracker" passHref>
        <Button variant={pathname === "/chatgpt-tracker" ? "default" : "outline"} className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          ChatGPT Tracker
        </Button>
      </Link>
    </nav>
  )
}
