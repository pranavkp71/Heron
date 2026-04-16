import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-20 md:py-32">
                <h1 className="mb-10 text-4xl font-bold tracking-tight">Privacy Policy</h1>

                <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-foreground">What data we collect</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Email (for authentication)</li>
                            <li>API keys</li>
                            <li>Event data (event name, timestamp, metadata)</li>
                            <li>Slack webhook URLs</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-foreground">How data is used</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Only for monitoring and alerting</li>
                            <li>Not sold or shared with third parties</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-foreground">User control</h2>
                        <ul className="list-inside list-disc space-y-2">
                            <li>Users own their data</li>
                            <li>Can delete their account/project</li>
                        </ul>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    )
}
