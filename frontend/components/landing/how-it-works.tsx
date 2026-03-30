"use client"

import { motion } from "framer-motion"
import { Code, Brain, Bell, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Code,
    title: "Track events",
    description: "Add a single line of code to track your business events.",
    code: `heron.track('payment.completed')`,
  },
  {
    number: "02",
    icon: Brain,
    title: "Heron learns patterns",
    description:
      "Our system automatically learns the expected frequency and timing of your events.",
    code: null,
  },
  {
    number: "03",
    icon: Bell,
    title: "Alerts when events stop",
    description:
      "Get instant notifications when expected events don't happen on schedule.",
    code: null,
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Detects recovery",
    description:
      "Heron notifies you when things are back to normal and tracks total downtime.",
    code: null,
  },
]

export function HowItWorks() {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  }

  return (
    <motion.section
      id="how-it-works"
      className="border-t border-border py-20 md:py-32"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Get started in minutes with just a few lines of code.
          </p>
        </div>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} className="relative" variants={itemVariants}>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-border via-primary/30 to-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {step.code && (
                  <div className="mt-4 w-full rounded-lg border border-border bg-background">
                    <pre className="p-4 text-left">
                      <code className="text-sm text-primary">{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
