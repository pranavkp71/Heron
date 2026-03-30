"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
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
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
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
