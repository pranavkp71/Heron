"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ─── Nav structure ──────────────────────────────────────────────────────────
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const NAV = [
    {
        group: "Getting started",
        links: [
            { id: "intro", label: "Introduction" },
            { id: "how-it-works", label: "How it works" },
            { id: "quickstart", label: "Quick start" },
        ],
    },
    {
        group: "Setup",
        links: [
            { id: "database", label: "Database setup" },
            { id: "server", label: "Running the server" },
            { id: "project", label: "Creating a project" },
            { id: "slack", label: "Slack alerts" },
        ],
    },
    {
        group: "SDK",
        links: [
            { id: "sdk-install", label: "Installation" },
            { id: "sdk-reference", label: "SDK reference" },
        ],
    },
    {
        group: "Reference",
        links: [
            { id: "api", label: "API reference" },
            { id: "alerts", label: "Alert format" },
            { id: "pattern-learning", label: "Pattern learning" },
            { id: "troubleshooting", label: "Troubleshooting" },
        ],
    },
]

const ALL_IDS = NAV.flatMap((g) => g.links.map((l) => l.id))

// ─── Small reusable pieces ───────────────────────────────────────────────────

function Callout({ children, warning = false }: { children: React.ReactNode; warning?: boolean }) {
    return (
        <div
            style={{
                borderLeft: `3px solid ${warning ? "#BA7517" : "var(--heron-accent)"}`,
                background: warning ? "#FAEEDA" : "var(--heron-accent-light)",
                borderRadius: "0 8px 8px 0",
                padding: "0.75rem 1rem",
                margin: "1.25rem 0",
                fontSize: 14,
                color: warning ? "#633806" : "var(--heron-accent-dark)",
            }}
        >
            {children}
        </div>
    )
}

function Code({ children }: { children: React.ReactNode }) {
    return (
        <code
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12.5,
                background: "var(--color-background-secondary, hsl(var(--secondary)))",
                border: "0.5px solid var(--color-border-tertiary, hsl(var(--border)))",
                borderRadius: 4,
                padding: "1px 5px",
                color: "var(--heron-accent-dark)",
            }}
        >
            {children}
        </code>
    )
}

function Pre({ children }: { children: React.ReactNode }) {
    return (
        <pre
            style={{
                background: "var(--color-background-secondary, hsl(var(--secondary)))",
                border: "0.5px solid var(--color-border-tertiary, hsl(var(--border)))",
                borderRadius: 8,
                padding: "1rem 1.25rem",
                overflowX: "auto",
                margin: "1rem 0",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
                lineHeight: 1.6,
                color: "hsl(var(--foreground))",
            }}
        >
            {children}
        </pre>
    )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p
            style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--heron-accent)",
                marginBottom: "0.5rem",
            }}
        >
            {children}
        </p>
    )
}

function Hr() {
    return (
        <hr
            style={{
                border: "none",
                borderTop: "0.5px solid hsl(var(--border))",
                margin: "2.5rem 0",
            }}
        />
    )
}

function Endpoint({
    method,
    path,
    description,
    children,
}: {
    method: string
    path: string
    description: string
    children?: React.ReactNode
}) {
    return (
        <div
            style={{
                background: "hsl(var(--card))",
                border: "0.5px solid hsl(var(--border))",
                borderRadius: 10,
                overflow: "hidden",
                margin: "1rem 0",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0.75rem 1rem",
                    borderBottom: "0.5px solid hsl(var(--border))",
                    background: "hsl(var(--secondary))",
                }}
            >
                <span
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "var(--heron-accent-light)",
                        color: "var(--heron-accent-dark)",
                    }}
                >
                    {method}
                </span>
                <span
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13,
                        color: "hsl(var(--foreground))",
                    }}
                >
                    {path}
                </span>
            </div>
            <div style={{ padding: "1rem" }}>
                <p style={{ fontSize: 13.5 }}>{description}</p>
                {children}
            </div>
        </div>
    )
}

function Badge({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "gray" | "red" }) {
    const styles: Record<string, React.CSSProperties> = {
        green: { background: "var(--heron-accent-light)", color: "var(--heron-accent-dark)" },
        gray: { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" },
        red: { background: "#FCEBEB", color: "#A32D2D" },
    }
    return (
        <span
            style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 100,
                ...styles[variant],
            }}
        >
            {children}
        </span>
    )
}

function DocTable({ rows }: { rows: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode][] }) {
    const heads = ["Parameter", "Type", "Required", "Description"]
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, margin: "1rem 0" }}>
            <thead>
                <tr>
                    {heads.map((h) => (
                        <th
                            key={h}
                            style={{
                                textAlign: "left",
                                fontWeight: 500,
                                fontSize: 12,
                                color: "hsl(var(--muted-foreground))",
                                borderBottom: "0.5px solid hsl(var(--border))",
                                padding: "8px 12px",
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td
                                key={j}
                                style={{
                                    padding: "10px 12px",
                                    borderBottom: i === rows.length - 1 ? "none" : "0.5px solid hsl(var(--border))",
                                    color: "hsl(var(--muted-foreground))",
                                    verticalAlign: "top",
                                    ...(j === 0
                                        ? {
                                            color: "hsl(var(--foreground))",
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: 12.5,
                                        }
                                        : {}),
                                }}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function PatternTable() {
    const rows: [string, string][] = [
        ["Event is new (< 3 occurrences)", "Heron collects data but won't alert yet — not enough history to establish a reliable pattern."],
        ["Event fires very infrequently", "Alerts will fire with a wider tolerance. A once-per-day job won't alert after 5 minutes of silence."],
        ["Event frequency changes", "The rolling average adjusts over time. A sudden permanent change in frequency will stabilize after a few occurrences."],
        ["Alert fires too aggressively", "This may mean your event has high variance (e.g., batch jobs that run irregularly). More sophisticated threshold tuning is on the roadmap."],
    ]
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, margin: "1rem 0" }}>
            <thead>
                <tr>
                    {["Situation", "Behavior"].map((h) => (
                        <th
                            key={h}
                            style={{
                                textAlign: "left",
                                fontWeight: 500,
                                fontSize: 12,
                                color: "hsl(var(--muted-foreground))",
                                borderBottom: "0.5px solid hsl(var(--border))",
                                padding: "8px 12px",
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map(([situation, behavior], i) => (
                    <tr key={i}>
                        <td
                            style={{
                                padding: "10px 12px",
                                borderBottom: i === rows.length - 1 ? "none" : "0.5px solid hsl(var(--border))",
                                color: "hsl(var(--foreground))",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 12.5,
                                verticalAlign: "top",
                            }}
                        >
                            {situation}
                        </td>
                        <td
                            style={{
                                padding: "10px 12px",
                                borderBottom: i === rows.length - 1 ? "none" : "0.5px solid hsl(var(--border))",
                                color: "hsl(var(--muted-foreground))",
                                verticalAlign: "top",
                            }}
                        >
                            {behavior}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function Steps({ steps }: { steps: { title: string; content: React.ReactNode }[] }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", margin: "1.25rem 0" }}>
            {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "var(--heron-accent-light)",
                                color: "var(--heron-accent-dark)",
                                fontSize: 12,
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 2,
                            }}
                        >
                            {i + 1}
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                style={{
                                    width: 1.5,
                                    flex: 1,
                                    background: "hsl(var(--border))",
                                    margin: "4px 0",
                                    minHeight: 16,
                                }}
                            />
                        )}
                    </div>
                    <div style={{ paddingBottom: "1.5rem", flex: 1 }}>
                        <h3
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                marginBottom: "0.3rem",
                                color: "hsl(var(--foreground))",
                            }}
                        >
                            {step.title}
                        </h3>
                        {step.content}
                    </div>
                </div>
            ))}
        </div>
    )
}

function FlowDiagram() {
    const nodes = [
        { label: "Your app", accent: false },
        { label: "Heron SDK", accent: false },
        { label: "Heron server", accent: false },
        { label: "Pattern learning", accent: true },
        { label: "Silence detection", accent: true },
        { label: "Slack alert", accent: true },
    ]
    return (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, margin: "1.25rem 0" }}>
            {nodes.map((n, i) => (
                <React.Fragment key={n.label}>
                    <div
                        style={{
                            background: n.accent ? "var(--heron-accent-light)" : "hsl(var(--secondary))",
                            border: `0.5px solid ${n.accent ? "#9FE1CB" : "hsl(var(--border))"}`,
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 12.5,
                            color: n.accent ? "var(--heron-accent-dark)" : "hsl(var(--foreground))",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {n.label}
                    </div>
                    {i < nodes.length - 1 && (
                        <span key={`arrow-${i}`} style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", padding: "0 2px" }}>
                            →
                        </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

function AlertBox({ type }: { type: "fire" | "ok" }) {
    const isFire = type === "fire"
    return (
        <div
            style={{
                background: "hsl(var(--card))",
                border: "0.5px solid hsl(var(--border))",
                borderLeft: `3px solid ${isFire ? "#E24B4A" : "#1D9E75"}`,
                borderRadius: 10,
                padding: "1rem 1.25rem",
                margin: "1rem 0",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13,
            }}
        >
            <div
                style={{
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    fontSize: 14,
                    color: isFire ? "#A32D2D" : "#0F6E56",
                }}
            >
                {isFire ? "🚨 Heron alert" : "✅ Heron recovery"}
            </div>
            {isFire ? (
                <>
                    <AlertRow label="Event" value="payment.completed" />
                    <AlertRow label="Last seen" value="18 minutes ago" />
                    <AlertRow label="Expected interval" value="~3 minutes" />
                    <AlertRow label="Service" value="payments-service" />
                    <AlertRow label="Environment" value="production" />
                </>
            ) : (
                <>
                    <AlertRow label="Event" value="payment.completed" />
                    <AlertRow label="Downtime" value="18 minutes" />
                    <AlertRow label="Service" value="payments-service" />
                    <AlertRow label="Environment" value="production" />
                </>
            )}
        </div>
    )
}

function AlertRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                fontSize: 13,
                color: "hsl(var(--muted-foreground))",
                margin: "2px 0",
            }}
        >
            <span style={{ color: "hsl(var(--muted-foreground))", minWidth: 120, opacity: 0.6 }}>{label}</span>
            <span>{value}</span>
        </div>
    )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function DocsPage() {
    const [activeId, setActiveId] = useState("intro")
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                }
            },
            { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
        )
        ALL_IDS.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observerRef.current?.observe(el)
        })
        return () => observerRef.current?.disconnect()
    }, [])

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
        setActiveId(id)
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root {
          --heron-accent: #1D9E75;
          --heron-accent-light: rgba(29,158,117,0.10);
          --heron-accent-dark: #0F6E56;
        }
        .doc-nav-link { transition: background 0.15s, color 0.15s; }
        .doc-nav-link:hover { background: hsl(var(--secondary)); color: hsl(var(--foreground)); }
        .doc-section { scroll-margin-top: 5rem; }
        @media (max-width: 768px) {
          .doc-sidebar { display: none !important; }
        }
        .c-green { color: #1D9E75; }
        .c-muted { color: hsl(var(--muted-foreground)); opacity: 0.7; }
        .c-str   { color: #BA7517; }
        .c-key   { color: hsl(var(--muted-foreground)); }
      `}</style>

            {/* Top bar with back link */}
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    borderBottom: "0.5px solid hsl(var(--border))",
                    background: "hsl(var(--background) / 0.9)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                }}
            >
                <div
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: "0 1.5rem",
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            textDecoration: "none",
                            color: "var(--heron-accent)",
                            fontWeight: 600,
                            fontSize: 16,
                        }}
                    >
                        <HeronLogo />
                        Heron
                    </Link>
                    <Link
                        href="/"
                        style={{
                            fontSize: 13,
                            color: "hsl(var(--muted-foreground))",
                            textDecoration: "none",
                        }}
                    >
                        Go to dashboard →
                    </Link>
                </div>
            </header>

            {/* Page body */}
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "2.5rem 1.5rem 6rem",
                    display: "flex",
                    gap: 0,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "hsl(var(--foreground))",
                }}
            >
                {/* ── Sidebar ── */}
                <aside
                    className="doc-sidebar"
                    style={{
                        width: 210,
                        flexShrink: 0,
                        position: "sticky",
                        top: "4.5rem",
                        alignSelf: "flex-start",
                        paddingRight: "2rem",
                        maxHeight: "calc(100vh - 5rem)",
                        overflowY: "auto",
                    }}
                >
                    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {NAV.map((group) => (
                            <div key={group.group}>
                                <div
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "hsl(var(--muted-foreground))",
                                        opacity: 0.6,
                                        padding: "12px 8px 4px",
                                    }}
                                >
                                    {group.group}
                                </div>
                                {group.links.map((link) => {
                                    const isActive = activeId === link.id
                                    return (
                                        <button
                                            key={link.id}
                                            className="doc-nav-link"
                                            onClick={() => scrollTo(link.id)}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                textAlign: "left",
                                                fontSize: 13,
                                                color: isActive ? "var(--heron-accent-dark)" : "hsl(var(--muted-foreground))",
                                                textDecoration: "none",
                                                padding: "5px 8px",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                                border: "none",
                                                fontWeight: isActive ? 500 : 400,
                                                background: isActive ? "var(--heron-accent-light)" : "transparent",
                                            }}
                                        >
                                            {link.label}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* ── Main content ── */}
                <main style={{ flex: 1, minWidth: 0 }}>

                    {/* INTRODUCTION */}
                    <section className="doc-section" id="intro" style={{ marginBottom: "3.5rem" }}>
                        <SectionLabel>Getting started</SectionLabel>
                        <h1
                            style={{
                                fontSize: 28,
                                fontWeight: 600,
                                letterSpacing: "-0.5px",
                                marginBottom: "0.5rem",
                                lineHeight: 1.3,
                                color: "hsl(var(--foreground))",
                            }}
                        >
                            Know when your business silently breaks
                        </h1>
                        <p
                            style={{
                                fontSize: 16,
                                color: "hsl(var(--muted-foreground))",
                                marginBottom: "1.25rem",
                                lineHeight: 1.6,
                            }}
                        >
                            Standard monitoring tells you when your server crashes. Heron tells you when your business flow quietly fails — when payment webhooks stop firing, email jobs silently stall, or background workers die without throwing an error.
                        </p>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Your system looks healthy. But revenue is stopped. Heron catches that.
                        </p>

                        <Callout>
                            <strong>Early access:</strong> Heron is in active development. Core monitoring, incident tracking, Slack alerts, and multi-project support are all working. A hosted SaaS version is on the roadmap.
                        </Callout>

                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem" }}>
                            Common events people monitor with Heron:
                        </p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, margin: "0.5rem 0 1rem" }}>
                            {[
                                ["payment.completed", "detect payment pipeline failures"],
                                ["user.signup", "detect broken signup webhooks"],
                                ["email.sent", "detect stalled email queues"],
                                ["job.processed", "detect silent worker failures"],
                            ].map(([event, desc]) => (
                                <li key={event} style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", display: "flex", gap: 8 }}>
                                    <span style={{ color: "var(--heron-accent)" }}>→</span>
                                    <span><Code>{event}</Code> — {desc}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <Hr />

                    {/* HOW IT WORKS */}
                    <section className="doc-section" id="how-it-works" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            How it works
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Heron works in three phases: ingest, learn, and detect.
                        </p>

                        <FlowDiagram />

                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            When you call <Code>heron.track("payment.completed")</Code>, Heron records that event with a timestamp. Over time, it computes the average interval between occurrences — for example, <em>payment.completed fires every ~3 minutes</em>.
                        </p>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            The background monitor checks each event's last-seen timestamp against its learned interval. If the silence exceeds the expected interval by a meaningful margin, Heron opens an incident and fires a Slack alert. When the event resumes, it automatically closes the incident and reports the total downtime.
                        </p>

                        <Callout>
                            <strong>Pattern learning:</strong> Heron needs at least a few data points before it can reliably detect silence. Events that fire infrequently will have wider tolerance windows. See <button onClick={() => scrollTo("pattern-learning")} style={{ color: "var(--heron-accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", padding: 0 }}>Pattern learning</button> for details.
                        </Callout>
                    </section>

                    <Hr />

                    {/* QUICK START */}
                    <section className="doc-section" id="quickstart" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Quick start
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Get Heron running locally in about 10 minutes.
                        </p>

                        <Steps steps={[
                            {
                                title: "Clone the repository",
                                content: <Pre><code>{`git clone https://github.com/pranavkp71/Heron.git\ncd heron/heron-server`}</code></Pre>,
                            },
                            {
                                title: "Install dependencies",
                                content: <Pre><code>pip install -r requirements.txt</code></Pre>,
                            },
                            {
                                title: "Set up PostgreSQL",
                                content: <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                                    Create a database, then run the schema. See <button onClick={() => scrollTo("database")} style={{ color: "var(--heron-accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", padding: 0 }}>Database setup</button> for the full SQL.
                                </p>,
                            },
                            {
                                title: "Start the server",
                                content: (
                                    <>
                                        <Pre><code>python run.py</code></Pre>
                                        <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                                            Server runs at <Code>{baseUrl}</Code>.
                                        </p>
                                    </>
                                ),
                            },
                            {
                                title: "Create a project and get your API key",
                                content: (
                                    <>
                                        <Pre><code>{`curl -X POST "${baseUrl}/v1/projects?name=MyApp"`}</code></Pre>
                                        <Pre><code><span className="c-muted"># Response</span>{"\n"}{"{"}{"\n"}  <span className="c-key">"project_id"</span>: 1,{"\n"}  <span className="c-key">"api_key"</span>: <span className="c-str">"heron_xxxxx"</span>{"\n"}{"}"}</code></Pre>
                                    </>
                                ),
                            },
                            {
                                title: "Track your first event",
                                content: (
                                    <>
                                        <Pre><code><span className="c-muted"># In your application code</span>{"\n"}import sys{"\n"}sys.path.append(<span className="c-str">"/path/to/heron-sdk"</span>){"\n\n"}import heron{"\n\n"}heron.init(api_key=<span className="c-str">"heron_xxxxx"</span>){"\n"}heron.track(<span className="c-str">"payment.completed"</span>)</code></Pre>
                                        <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                                            Heron will now track this event, learn its frequency, and alert you if it stops.
                                        </p>
                                    </>
                                ),
                            },
                        ]} />
                    </section>

                    <Hr />

                    {/* DATABASE */}
                    <section className="doc-section" id="database" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Database setup
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Heron requires a PostgreSQL database with four tables. Run the following SQL after creating your database:
                        </p>
                        <Pre><code><span className="c-muted">-- Stores your projects and their Slack webhook URLs</span>{"\n"}CREATE TABLE projects ({"\n"}    id              SERIAL PRIMARY KEY,{"\n"}    name            TEXT NOT NULL,{"\n"}    api_key         TEXT UNIQUE NOT NULL,{"\n"}    slack_webhook_url TEXT,{"\n"}    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP{"\n"});{"\n\n"}<span className="c-muted">-- Raw event log — every heron.track() call lands here</span>{"\n"}CREATE TABLE events ({"\n"}    id          SERIAL PRIMARY KEY,{"\n"}    api_key     TEXT,{"\n"}    event_name  TEXT,{"\n"}    service     TEXT,{"\n"}    environment TEXT,{"\n"}    metadata    JSONB,{"\n"}    timestamp   BIGINT{"\n"});{"\n\n"}<span className="c-muted">-- Per-event statistics updated on each track() call</span>{"\n"}CREATE TABLE event_stats ({"\n"}    api_key         TEXT,{"\n"}    event_name      TEXT,{"\n"}    service         TEXT,{"\n"}    environment     TEXT,{"\n"}    last_seen       BIGINT,{"\n"}    avg_interval    FLOAT,{"\n"}    event_count     INTEGER,{"\n"}    incident_active BOOLEAN DEFAULT FALSE{"\n"});{"\n\n"}<span className="c-muted">-- One row per incident, open or resolved</span>{"\n"}CREATE TABLE incidents ({"\n"}    id          SERIAL PRIMARY KEY,{"\n"}    api_key     TEXT,{"\n"}    event_name  TEXT,{"\n"}    service     TEXT,{"\n"}    environment TEXT,{"\n"}    started_at  TIMESTAMP,{"\n"}    resolved_at TIMESTAMP,{"\n"}    duration    INTEGER{"\n"});</code></Pre>
                    </section>

                    <Hr />

                    {/* SERVER */}
                    <section className="doc-section" id="server" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Running the server
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Start the Heron server from the <Code>heron-server</Code> directory:
                        </p>
                        <Pre><code>python run.py</code></Pre>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            The server starts at <Code>{baseUrl}</Code>. It runs a background monitor that periodically checks for silent events and opens or resolves incidents.
                        </p>
                        <Callout warning>
                            <strong>Note:</strong> You must configure your database connection before starting the server. Check your <Code>.env</Code> or config file for the database URL setting.
                        </Callout>
                    </section>

                    <Hr />

                    {/* PROJECT */}
                    <section className="doc-section" id="project" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Creating a project
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Each project gets its own API key. Use separate projects to isolate different apps or environments.
                        </p>
                        <Pre><code>{`curl -X POST "${baseUrl}/v1/projects?name=MyApp"`}</code></Pre>
                        <Pre><code>{"{"}{"\n"}  <span className="c-key">"project_id"</span>: 1,{"\n"}  <span className="c-key">"api_key"</span>: <span className="c-str">"heron_xxxxx"</span>{"\n"}{"}"}</code></Pre>
                        <p style={{ color: "hsl(var(--muted-foreground))" }}>
                            Store the <Code>api_key</Code> securely — it authenticates all SDK calls and API requests for this project.
                        </p>
                    </section>

                    <Hr />

                    {/* SLACK */}
                    <section className="doc-section" id="slack" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Slack alerts
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Heron sends incident alerts and recovery notifications to a Slack channel via an incoming webhook.
                        </p>
                        <Steps steps={[
                            {
                                title: "Create a Slack incoming webhook",
                                content: <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>Go to your Slack workspace → <strong>Apps</strong> → search for <em>Incoming Webhooks</em> → Add to a channel. Copy the webhook URL.</p>,
                            },
                            {
                                title: "Add the webhook to your project",
                                content: (
                                    <>
                                        <Pre><code>{`curl -X PATCH "${baseUrl}/v1/projects/1/slack" \\\n  -H "Content-Type: application/json" \\\n  -d '{"slack_webhook_url": "https://hooks.slack.com/..."}'`}</code></Pre>
                                        <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>Once set, Heron will automatically post alerts when incidents open or resolve.</p>
                                    </>
                                ),
                            },
                        ]} />
                    </section>

                    <Hr />

                    {/* SDK INSTALL */}
                    <section className="doc-section" id="sdk-install" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            SDK installation
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            The Heron SDK is not yet published on PyPI. Install it by pointing Python to the local SDK directory:
                        </p>
                        <Pre><code>import sys{"\n"}sys.path.append(<span className="c-str">"/path/to/heron-sdk"</span>)  <span className="c-muted"># absolute path to the cloned repo's SDK folder</span>{"\n\n"}import heron</code></Pre>
                        <Callout>
                            <strong>PyPI coming soon:</strong> Once published, installation will simplify to <Code>pip install heron-sdk</Code>. Follow progress on <a href="https://x.com/pranavk_p" style={{ color: "var(--heron-accent)" }}>X (@pranavk_p)</a>.
                        </Callout>
                    </section>

                    <Hr />

                    {/* SDK REFERENCE */}
                    <section className="doc-section" id="sdk-reference" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            SDK reference
                        </h2>

                        <h3 style={{ fontSize: 15, fontWeight: 500, marginTop: "1.25rem", marginBottom: "0.4rem", color: "hsl(var(--foreground))" }}>
                            <Code>heron.init()</Code>
                        </h3>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.75rem" }}>Call once at application startup to configure the SDK.</p>
                        <Pre><code>heron.init({"\n"}    api_key=<span className="c-str">"heron_xxxxx"</span>,      <span className="c-muted"># required</span>{"\n"}    service=<span className="c-str">"payments-service"</span>,  <span className="c-muted"># optional — tag events by service</span>{"\n"}    environment=<span className="c-str">"production"</span>     <span className="c-muted"># optional — "production", "staging", etc.</span>{"\n"})</code></Pre>
                        <DocTable rows={[
                            ["api_key", "string", <Badge>required</Badge>, "Your project API key from the create project step."],
                            ["service", "string", <Badge variant="gray">optional</Badge>, "Tag events with a service name. Useful for multi-service projects."],
                            ["environment", "string", <Badge variant="gray">optional</Badge>, "Tag events with an environment. Incidents are scoped per environment."],
                        ]} />

                        <h3 style={{ fontSize: 15, fontWeight: 500, marginTop: "2rem", marginBottom: "0.4rem", color: "hsl(var(--foreground))" }}>
                            <Code>heron.track()</Code>
                        </h3>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.75rem" }}>
                            Call this wherever a business event occurs. Each call records an event occurrence and updates the pattern data.
                        </p>
                        <Pre><code>heron.track({"\n"}    event_name=<span className="c-str">"payment.completed"</span>,  <span className="c-muted"># required</span>{"\n"}    metadata={"{"}<span className="c-muted">                          # optional</span>{"\n"}        <span className="c-str">"amount"</span>: 49.99,{"\n"}        <span className="c-str">"currency"</span>: <span className="c-str">"USD"</span>,{"\n"}        <span className="c-str">"user_id"</span>: <span className="c-str">"usr_123"</span>{"\n"}    {"}"}{"\n"})</code></Pre>
                        <DocTable rows={[
                            ["event_name", "string", <Badge>required</Badge>, "Dot-separated event identifier. Use consistent naming — Heron tracks each unique name separately."],
                            ["metadata", "dict", <Badge variant="gray">optional</Badge>, "Arbitrary key-value data stored with the event. Useful for debugging incidents. Stored as JSONB."],
                        ]} />

                        <Callout warning>
                            <strong>SDK failure behavior:</strong> If the Heron server is unreachable, the SDK will fail silently by default — your application code will not be interrupted. This is intentional. Monitoring should never break production.
                        </Callout>
                    </section>

                    <Hr />

                    {/* API REFERENCE */}
                    <section className="doc-section" id="api" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            API reference
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            All endpoints require your project's <Code>api_key</Code> as a query parameter.
                        </p>

                        <Endpoint method="GET" path="/v1/incidents" description="Returns all incidents (open and resolved) for your project.">
                            <Pre><code>{`curl "${baseUrl}/v1/incidents?api_key=heron_xxxxx"`}</code></Pre>
                            <Pre><code>[{"\n"}  {"{"}{"\n"}    <span className="c-key">"id"</span>: 1,{"\n"}    <span className="c-key">"event_name"</span>: <span className="c-str">"payment.completed"</span>,{"\n"}    <span className="c-key">"service"</span>: <span className="c-str">"payments-service"</span>,{"\n"}    <span className="c-key">"environment"</span>: <span className="c-str">"production"</span>,{"\n"}    <span className="c-key">"started_at"</span>: <span className="c-str">"2024-11-01T14:22:00Z"</span>,{"\n"}    <span className="c-key">"resolved_at"</span>: <span className="c-str">"2024-11-01T14:40:00Z"</span>,{"\n"}    <span className="c-key">"duration"</span>: 1080{"\n"}  {"}"}{"\n"}]</code></Pre>
                        </Endpoint>

                        <Endpoint method="GET" path="/v1/incidents/active" description="Returns only currently open incidents. Useful for status dashboards or health checks.">
                            <Pre><code>{`curl "${baseUrl}/v1/incidents/active?api_key=heron_xxxxx"`}</code></Pre>
                            <Pre><code>[{"\n"}  {"{"}{"\n"}    <span className="c-key">"id"</span>: 3,{"\n"}    <span className="c-key">"event_name"</span>: <span className="c-str">"email.sent"</span>,{"\n"}    <span className="c-key">"service"</span>: <span className="c-str">"notifications"</span>,{"\n"}    <span className="c-key">"started_at"</span>: <span className="c-str">"2024-11-01T15:10:00Z"</span>,{"\n"}    <span className="c-key">"resolved_at"</span>: null,{"\n"}    <span className="c-key">"duration"</span>: null{"\n"}  {"}"}{"\n"}]</code></Pre>
                        </Endpoint>
                    </section>

                    <Hr />

                    {/* ALERT FORMAT */}
                    <section className="doc-section" id="alerts" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Alert format
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Heron sends two types of Slack messages: incident alerts when an event stops, and recovery alerts when it resumes.
                        </p>
                        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: "0.75rem", color: "hsl(var(--foreground))" }}>Incident alert</h3>
                        <AlertBox type="fire" />
                        <h3 style={{ fontSize: 15, fontWeight: 500, marginTop: "1.5rem", marginBottom: "0.75rem", color: "hsl(var(--foreground))" }}>Recovery alert</h3>
                        <AlertBox type="ok" />
                    </section>

                    <Hr />

                    {/* PATTERN LEARNING */}
                    <section className="doc-section" id="pattern-learning" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Pattern learning
                        </h2>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            Heron does not require you to manually configure thresholds. Instead, it learns the natural cadence of each event from observed data.
                        </p>
                        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "1rem" }}>
                            On every <Code>heron.track()</Code> call, Heron computes a rolling average of the interval between consecutive events. This becomes the expected interval for that event. The silence detector runs periodically and compares the current gap (time since <Code>last_seen</Code>) against the expected interval.
                        </p>
                        <PatternTable />
                    </section>

                    <Hr />

                    {/* TROUBLESHOOTING */}
                    <section className="doc-section" id="troubleshooting" style={{ marginBottom: "3.5rem" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "0.75rem" }}>
                            Troubleshooting
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            {[
                                {
                                    q: "My event is being tracked but I'm not getting alerts",
                                    a: "Heron requires a minimum number of data points before it can establish a reliable pattern. Make sure the event has fired at least 3–5 times. Also confirm your Slack webhook URL is correctly set on your project.",
                                },
                                {
                                    q: "I'm getting false positive alerts",
                                    a: "This usually means the event fires at irregular intervals (e.g., user-driven events with low volume, or batch jobs that run at unpredictable times). Heron's pattern learning will stabilize over time as more data is collected.",
                                },
                                {
                                    q: "The SDK is not connecting to the server",
                                    a: <>Check that your Heron server is running at <Code>{baseUrl}</Code> and that there are no firewall rules blocking the connection. The SDK fails silently by design — check your server logs to confirm events are being received.</>,
                                },
                                {
                                    q: "Database connection errors on startup",
                                    a: <>Make sure your PostgreSQL instance is running and the connection string in your config file is correct. Also confirm all four tables exist by running the setup SQL from the <button onClick={() => scrollTo("database")} style={{ color: "var(--heron-accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", padding: 0 }}>Database setup</button> section.</>,
                                },
                                {
                                    q: "Events show the wrong service or environment",
                                    a: <>The <Code>service</Code> and <Code>environment</Code> values are set globally in <Code>heron.init()</Code>. If you need different values per event, re-call <Code>heron.init()</Code> before the relevant <Code>heron.track()</Code> calls, or open a GitHub issue — per-event overrides may be added.</>,
                                },
                            ].map(({ q, a }) => (
                                <div key={q}>
                                    <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: "0.3rem", color: "hsl(var(--foreground))" }}>{q}</h3>
                                    <p style={{ color: "hsl(var(--muted-foreground))", margin: 0 }}>{a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>
        </>
    )
}

function HeronLogo() {
    return (
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M14 8v12M8 11l6 3 6-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
