import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="mx-auto max-w-3xl px-6 py-20 md:py-32">
                <h1 className="mb-10 text-4xl font-bold tracking-tight">Terms of Service</h1>

                <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <ul className="list-inside list-disc space-y-4">
                        <li>Heron is provided "as is"</li>
                        <li>No guarantees of uptime or accuracy</li>
                        <li>Users are responsible for how they use the system</li>
                        <li>Service may change or be discontinued at any time</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    )
}
