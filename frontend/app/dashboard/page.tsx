"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { animate, motion } from "framer-motion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  Settings,
  Bell,
  Plus,
  Activity,
  Shield,
} from "lucide-react"

type Incident = {
  id: string
  event: string
  status: "active" | "resolved"
  startedAt: string
  duration: string
  resolvedAt?: string
}

const mockActiveIncidents: Incident[] = [
  {
    id: "1",
    event: "payment.completed",
    status: "active",
    startedAt: "4:05 PM",
    duration: "23 min",
  },
]

const mockRecentIncidents: Incident[] = [
  {
    id: "2",
    event: "email.sent",
    status: "resolved",
    startedAt: "Yesterday, 2:30 PM",
    duration: "12 min",
    resolvedAt: "Yesterday, 2:42 PM",
  },
  {
    id: "3",
    event: "user.signup",
    status: "resolved",
    startedAt: "Mar 25, 10:15 AM",
    duration: "8 min",
    resolvedAt: "Mar 25, 10:23 AM",
  },
  {
    id: "4",
    event: "order.created",
    status: "resolved",
    startedAt: "Mar 24, 3:45 PM",
    duration: "45 min",
    resolvedAt: "Mar 24, 4:30 PM",
  },
]

function CountUpInt({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [value])

  return (
    <>
      {new Intl.NumberFormat("en-US").format(Math.round(display))}
    </>
  )
}

function CountUpFloat({
  value,
  decimals,
  suffix = "",
}: {
  value: number
  decimals: number
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [value])

  return <>{display.toFixed(decimals)}{suffix}</>
}

export default function DashboardPage() {
  const [activeIncidents] = useState<Incident[]>(mockActiveIncidents)
  const [recentIncidents] = useState<Incident[]>(mockRecentIncidents)
  const [showEmptyState, setShowEmptyState] = useState(false)

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }

  const listItemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <HeronLogo />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Heron
              </span>
            </Link>

            {/* Project Selector */}
            <Select defaultValue="project-1">
              <SelectTrigger className="w-[180px] border-border bg-secondary text-foreground">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="project-1">Production</SelectItem>
                <SelectItem value="project-2">Staging</SelectItem>
                <SelectItem value="project-3">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <div className="ml-2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.05 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your business events in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="border-border text-foreground hover:bg-secondary"
            >
              Toggle Demo
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </motion.div>

        {showEmptyState ? (
          /* Empty State */
          <motion.div
            className="mt-12 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-foreground">
              No incidents detected
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Your system is healthy. All tracked events are firing as expected.
              We&apos;ll alert you if anything stops.
            </p>
            <div className="mt-8 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                All systems operational
              </span>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Active Incidents */}
            {activeIncidents.length > 0 && (
              <motion.section
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Active Incidents
                  </h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {activeIncidents.length}
                  </span>
                </div>

                <motion.div
                  className="mt-4 space-y-3"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {activeIncidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      className="group relative overflow-hidden rounded-xl border border-primary/50 bg-card transition-all hover:border-primary hover:-translate-y-1 hover:shadow-md"
                      variants={listItemVariants}
                    >
                      {/* Pulse animation on left */}
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                      <div className="absolute left-0 top-0 h-full w-1 animate-pulse bg-primary/50" />

                      <div className="flex items-center justify-between p-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <AlertTriangle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {incident.event}
                              </h3>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                <motion.span
                                  className="h-1.5 w-1.5 rounded-full bg-primary"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.85, 1, 0.85],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.6,
                                    ease: "easeInOut",
                                  }}
                                />
                                Active
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Event stopped firing
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Started
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {incident.startedAt}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Duration
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {incident.duration}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-secondary"
                          >
                            View Details
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Recent Incidents */}
            <motion.section
              className="mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Recent Incidents
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  View All
                </Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Time
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentIncidents.map((incident, index) => (
                      <motion.tr
                        key={incident.id}
                        className="transition-colors hover:bg-secondary/30"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.2, 0.8, 0.2, 1],
                          delay: index * 0.06,
                        }}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {incident.event}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Resolved
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                          {incident.duration}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                          {incident.startedAt}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Details
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Quick Stats */}
            <motion.section
              className="mt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <motion.div
                className="grid gap-4 md:grid-cols-3"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
                  variants={listItemVariants}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Active Incidents
                    </p>
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    <CountUpInt value={activeIncidents.length} />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
                  variants={listItemVariants}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Events Tracked
                    </p>
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    <CountUpInt value={12847} />
                  </p>
                  <p className="mt-1 text-xs text-emerald-500">
                    +23% from last week
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
                  variants={listItemVariants}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Avg Response Time
                    </p>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    <CountUpFloat value={4.2} decimals={1} suffix=" min" />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Time to resolution
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>
          </>
        )}
      </main>
    </motion.div>
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
