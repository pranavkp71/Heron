"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchAllIncidents, BackendIncident } from "@/lib/heron-api"
import { getAccessToken } from "@/lib/auth"
import { motion } from "framer-motion"
import {
    Activity,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react"

type Incident = {
    id: string
    event: string
    status: "active" | "resolved"
    startedAt: string
    duration: string
    resolvedAt?: string
    rawStartedAt?: string
}

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [tick, setTick] = useState(0)

    const formatDuration = (startedAtRaw: string | Date, resolvedAtRaw?: string | Date | null, durationSec?: number | null): string => {
        if (resolvedAtRaw && durationSec != null) {
            const mins = Math.round(durationSec / 60)
            if (mins < 60) return `${mins} min`
            return `${Math.floor(mins / 60)}h ${mins % 60}m`
        }
        // active incident: compute from now
        const now = Date.now()
        const started = new Date(startedAtRaw).getTime()
        const elapsedSec = Math.floor((now - started) / 1000)
        if (elapsedSec < 60) return "Just now"
        const mins = Math.floor(elapsedSec / 60)
        if (mins < 60) return `${mins}m`
        return `${Math.floor(mins / 60)}h ${mins % 60}m`
    }

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const token = getAccessToken()
        if (!token) {
            window.location.href = "/login"
            return
        }

        const loadData = async () => {
            try {
                const allRes = await fetchAllIncidents()

                const mapIncident = (inc: BackendIncident): Incident => ({
                    id: inc.started_at + inc.event_name,
                    event: inc.event_name,
                    status: inc.resolved_at ? "resolved" : "active",
                    startedAt: new Date(inc.started_at).toLocaleString(),
                    duration: inc.resolved_at ? (inc.duration ? `${Math.round(inc.duration / 60)} min` : "0 min") : formatDuration(inc.started_at),
                    resolvedAt: inc.resolved_at ? new Date(inc.resolved_at).toLocaleString() : undefined,
                    rawStartedAt: inc.started_at,
                })

                const mapped = (allRes.incidents || []).map(mapIncident)
                setIncidents(mapped)
            } catch (err) {
                console.error("Failed to fetch all incidents", err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>
    }

    return (
        <motion.div
            className="min-h-screen bg-background"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-6">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            Heron
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">All Incidents</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Comprehensive log of all caught business event anomalies
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No incidents recorded.
                                    </td>
                                </tr>
                            ) : incidents.map((incident, index) => (
                                <motion.tr
                                    key={incident.id}
                                    className="transition-colors hover:bg-secondary/30"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.45,
                                        ease: [0.2, 0.8, 0.2, 1],
                                        delay: index * 0.03,
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
                                        {incident.status === "active" ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Resolved
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                                        {incident.status === "active" && incident.rawStartedAt ? formatDuration(incident.rawStartedAt) : incident.duration}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                                        {incident.startedAt}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </motion.div>
    )
}
