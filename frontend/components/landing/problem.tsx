import { XCircle, Mail, Cog } from "lucide-react"

const problems = [
  {
    icon: XCircle,
    title: "No errors, but payments stop",
    description:
      "Your monitoring shows green, but revenue silently stops flowing.",
  },
  {
    icon: Mail,
    title: "Email jobs silently fail",
    description:
      "Critical notifications never reach your customers, and you don't know until they complain.",
  },
  {
    icon: Cog,
    title: "Background workers stop running",
    description:
      "Scheduled tasks quietly die without triggering any alerts in your system.",
  },
]

export function Problem() {
  return (
    <section id="features" className="border-t border-border py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The bugs you don&apos;t see are the most dangerous
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Traditional monitoring catches crashes and errors. But what about
            when things simply stop happening?
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <problem.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
