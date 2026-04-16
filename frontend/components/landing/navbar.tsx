"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border/50 backdrop-blur-md transition-[background-color,box-shadow] duration-300",
        scrolled ? "bg-background/90 shadow-xs" : "bg-background/80"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <HeronLogo />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Heron
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#how-it-works"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-primary/70 after:content-[''] after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-primary/70 after:content-[''] after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            Features
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link href="/login?signup=true">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}

function HeronLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M14 2L4 8v12l10 6 10-6V8L14 2z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14 8v12M8 11l6 3 6-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
