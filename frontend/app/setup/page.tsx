"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { createProject, updateSlackWebhook } from "@/lib/heron-api"
import { setProjectId, setApiKey } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Check,
  Copy,
  ArrowRight,
  Key,
  Code,
  MessageSquare,
  Rocket,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const steps = [
  { id: 1, title: "Create Project", icon: Key },
  { id: 2, title: "Add SDK", icon: Code },
  { id: 3, title: "Add Slack", icon: MessageSquare },
  { id: 4, title: "Done", icon: Rocket },
]

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState("")
  const [projectName, setProjectName] = useState("My First Project")
  const [apiKey, setApiKeyState] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const codeSnippet = `import heron

heron.init(api_key="YOUR_KEY")

# Track any business event
heron.track("payment.completed")`

  const copyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey)
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeSnippet.replace("YOUR_KEY", apiKey))
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const directionRef = useRef<1 | -1>(1)

  const handleNextStep = async () => {
    if (currentStep === 1) {
      setIsLoading(true)
      try {
        const res = await createProject(projectName)
        setApiKeyState(res.api_key)
        setProjectId(String(res.project_id))
        setApiKey(res.api_key)
        directionRef.current = 1
        setCurrentStep(2)
      } catch (err: any) {
        alert(err.message || "Failed to create project")
      } finally {
        setIsLoading(false)
      }
    } else if (currentStep === 3) {
      if (slackWebhook) {
        setIsLoading(true)
        try {
          await updateSlackWebhook(slackWebhook)
          directionRef.current = 1
          setCurrentStep(4)
        } catch (err: any) {
          alert(err.message || "Failed to save webhook")
        } finally {
          setIsLoading(false)
        }
      } else {
        directionRef.current = 1
        setCurrentStep(4)
      }
    } else if (currentStep < 4) {
      directionRef.current = 1
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/dashboard"
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      directionRef.current = -1
      setCurrentStep(currentStep - 1)
    }
  }

  const stepDir = directionRef.current

  const progressContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }

  const progressItemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <HeronLogo />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Heron
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip setup
          </Link>
        </div>
      </header>

      <motion.main
        className="mx-auto max-w-4xl px-6 py-12"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* Progress Steps */}
        <div className="mb-12">
          <motion.div
            className="flex items-center justify-between"
            variants={progressContainerVariants}
            initial="hidden"
            animate="show"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex items-center"
                variants={progressItemVariants}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    animate={{
                      scale:
                        currentStep === step.id ? 1.08 : currentStep > step.id ? 1.03 : 1,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs font-medium ${currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-16 sm:w-24 md:w-32 ${currentStep > step.id ? "bg-primary" : "bg-border"
                      }`}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Step Content */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <AnimatePresence mode="wait">
            {/* Step 1: Create Project */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                className="p-8"
                initial={{
                  opacity: 0,
                  x: stepDir > 0 ? 24 : -24,
                  y: 10,
                  scale: 0.99,
                }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: stepDir > 0 ? -24 : 24,
                  y: 10,
                  scale: 0.99,
                }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Create your project
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Your project is ready. Here&apos;s your API key to get started.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Project Name</Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="h-11 bg-secondary border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={apiKey}
                          readOnly
                          className="h-11 pr-24 font-mono text-sm bg-secondary border-border text-foreground"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyApiKey}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {apiKeyCopied ? (
                              <motion.span
                                key="copied"
                                className="inline-flex items-center"
                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{
                                  duration: 0.2,
                                  ease: [0.2, 0.8, 0.2, 1],
                                }}
                              >
                                <Check className="mr-1.5 h-3 w-3 text-emerald-500" />
                                Copied
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                className="inline-flex items-center"
                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{
                                  duration: 0.2,
                                  ease: [0.2, 0.8, 0.2, 1],
                                }}
                              >
                                <Copy className="mr-1.5 h-3 w-3" />
                                Copy
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep this key secure. You won&apos;t be able to see it again.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add SDK */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                className="p-8"
                initial={{
                  opacity: 0,
                  x: stepDir > 0 ? 24 : -24,
                  y: 10,
                  scale: 0.99,
                }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: stepDir > 0 ? -24 : 24,
                  y: 10,
                  scale: 0.99,
                }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Add the Heron SDK
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Install the SDK and start tracking your business events.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-foreground">Install the package</Label>
                    <div className="rounded-lg border border-border bg-background p-4">
                      <code className="text-sm text-primary">pip install heron</code>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">Initialize and track events</Label>
                    <div className="relative rounded-lg border border-border bg-background">
                      <pre className="overflow-x-auto p-4">
                        <code className="text-sm text-foreground">
                          <span className="text-primary">import</span> heron
                          {"\n\n"}
                          heron.init(api_key=
                          <span className="text-emerald-400">&quot;YOUR_KEY&quot;</span>)
                          {"\n\n"}
                          <span className="text-muted-foreground"># Track any business event</span>
                          {"\n"}
                          heron.track(
                          <span className="text-emerald-400">&quot;payment.completed&quot;</span>)
                        </code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyCode}
                        className="absolute right-2 top-2 h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {codeCopied ? (
                            <motion.span
                              key="copied"
                              className="inline-flex items-center"
                              initial={{ opacity: 0, y: 4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.98 }}
                              transition={{
                                duration: 0.2,
                                ease: [0.2, 0.8, 0.2, 1],
                              }}
                            >
                              <Check className="mr-1.5 h-3 w-3 text-emerald-500" />
                              Copied
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              className="inline-flex items-center"
                              initial={{ opacity: 0, y: 4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.98 }}
                              transition={{
                                duration: 0.2,
                                ease: [0.2, 0.8, 0.2, 1],
                              }}
                            >
                              <Copy className="mr-1.5 h-3 w-3" />
                              Copy
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-foreground">
                      <strong>Tip:</strong> Track events at key moments in your
                      business flow — payments, signups, email sends, cron jobs,
                      etc.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Add Slack */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                className="p-8"
                initial={{
                  opacity: 0,
                  x: stepDir > 0 ? 24 : -24,
                  y: 10,
                  scale: 0.99,
                }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: stepDir > 0 ? -24 : 24,
                  y: 10,
                  scale: 0.99,
                }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Add Slack notifications
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Get alerted instantly when events stop happening.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Slack Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="h-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                      <a
                        href="https://api.slack.com/messaging/webhooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Learn how to create a Slack webhook
                      </a>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A154B]">
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Slack Integration
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Receive real-time alerts in your Slack channel
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    You can also add email, PagerDuty, or custom webhooks later in
                    settings.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Done */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                className="p-8 text-center"
                initial={{
                  opacity: 0,
                  x: stepDir > 0 ? 24 : -24,
                  y: 10,
                  scale: 0.99,
                }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: stepDir > 0 ? -24 : 24,
                  y: 10,
                  scale: 0.99,
                }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">
                  You&apos;re all set!
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Heron is now monitoring your business events. We&apos;ll alert you
                  if anything stops happening.
                </p>

                <div className="mt-8 rounded-lg border border-border bg-secondary/50 p-6">
                  <h3 className="font-semibold text-foreground">What&apos;s next?</h3>
                  <ul className="mt-4 space-y-3 text-left text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        Add more events to track critical business flows
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        Configure alert thresholds for each event type
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        Invite your team members to the dashboard
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border bg-card/50 px-8 py-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Please wait..." : currentStep === 4 ? "Go to Dashboard" : "Continue"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.main>
    </div>
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
