"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Now in public beta
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Know when your business{" "}
            <span className="text-primary">silently breaks</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Heron detects when critical events like payments, signups, or emails
            stop — even when your system looks healthy.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login?signup=true">
              <Button size="lg" className="group h-12 px-8 text-base">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-border text-foreground hover:bg-secondary"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Mock Alert UI */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl" />
            
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-1 shadow-2xl">
              <div className="rounded-lg bg-background p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-primary">
                        Heron Alert
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      payment.completed stopped
                    </p>
                    <div className="flex flex-col gap-1 pt-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                      <span>Last seen: 18 minutes ago</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Expected every ~3 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
