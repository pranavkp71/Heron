"use client"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

export function AlertDemo() {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  }

  return (
    <motion.section
      id="demo"
      className="border-t border-border py-20 md:py-32"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Real-time alerts that matter
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Clear, actionable notifications when your business events go silent.
          </p>
        </div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Alert Card */}
          <motion.div
            className="group relative transition-transform hover:-translate-y-1 hover:shadow-md"
            variants={itemVariants}
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-0 blur transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-xl border border-primary/50 bg-card">
              <div className="border-b border-border bg-primary/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Heron Alert
                  </span>
                  <span className="relative ml-auto flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  payment.completed stopped
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">
                      Last seen
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      18 minutes ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">
                      Expected frequency
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      ~3 minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recovery Card */}
          <motion.div
            className="group relative transition-transform hover:-translate-y-1 hover:shadow-md"
            variants={itemVariants}
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 blur transition-opacity group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/50 bg-card">
              <div className="border-b border-border bg-emerald-500/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-emerald-500">
                    Heron Recovery
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  payment.completed recovered
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">
                      Total downtime
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      18 minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">
                      Events missed
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      ~6 events
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Resolved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
