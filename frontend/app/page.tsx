import Link from "next/link";
import { Sparkles, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>Lumi</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium hover:underline">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-medium text-primary px-2">
              AI-Powered Legal Documents
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Turn messy notes into <br />
            <span className="text-primary">professional contracts</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Lumi instantly converts your unstructured notes, chats, and thoughts
            into formatted legal contracts, proposals, and statements of work using
            advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground h-12 px-8 rounded-lg font-medium text-lg hover:bg-primary/90 transition-all hover:shadow-lg"
            >
              Start Generating <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border bg-background h-12 px-8 rounded-lg font-medium text-lg hover:bg-accent transition-colors"
            >
              Log In
            </Link>
          </div>
        </section>

        <section className="bg-muted/30 py-24 border-y">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">Instant Drafting</h3>
                        <p className="text-muted-foreground">Paste any text, and our AI drafts a structured contract in seconds.</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                             <Sparkles className="w-5 h-5" />
                         </div>
                        <h3 className="font-semibold text-xl mb-2">Smart Formatting</h3>
                        <p className="text-muted-foreground">Automatically adheres to legal structures, tone, and standard clauses.</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                             <ArrowRight className="w-5 h-5" />
                         </div>
                        <h3 className="font-semibold text-xl mb-2">Easy Export</h3>
                        <p className="text-muted-foreground">Edit in our rich editor and export to Markdown or PDF instantly.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Lumi. All rights reserved.
      </footer>
    </div>
  );
}