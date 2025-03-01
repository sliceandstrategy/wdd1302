"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-primary shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virevo-kJYQZpBFHSZVoeQml8ALLJionwIJUu.webp"
              alt="Virevo Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white font-bold text-xl">Virevo</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Button variant="link" className="text-white hover:text-secondary">
              Research
            </Button>
            <Button variant="link" className="text-white hover:text-secondary">
              Publications
            </Button>
            <Button variant="link" className="text-white hover:text-secondary">
              About
            </Button>
            <Button variant="link" className="text-white hover:text-secondary">
              Contact
            </Button>
          </div>

          <Button className="bg-secondary hover:bg-secondary/90 text-white hidden md:block">Partner with Us</Button>

          <Button variant="ghost" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Button variant="link" className="text-white hover:text-secondary w-full justify-start">
              Research
            </Button>
            <Button variant="link" className="text-white hover:text-secondary w-full justify-start">
              Publications
            </Button>
            <Button variant="link" className="text-white hover:text-secondary w-full justify-start">
              About
            </Button>
            <Button variant="link" className="text-white hover:text-secondary w-full justify-start">
              Contact
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90 text-white w-full mt-4">Partner with Us</Button>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

