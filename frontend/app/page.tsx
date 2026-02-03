import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden text-white">
      <div className="fixed inset-0 -z-10 bg-black">
         <Image
            src="/images/bg.jpg"
            alt="Background"
            fill
            className="object-cover opacity-60"
            priority
            quality={75}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      </div>

      <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src="/images/lumi-logo.ico" alt="Lumi" className="w-6 h-6" />
          <span className="text-white">Lumi</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-white/80 hover:text-white hover:underline transition-colors">
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-all shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-32 text-center max-w-4xl">
          <div className="inline-flex items-center justify-center p-1 px-3 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-md">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
              AI-Powered Legal Documents
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-hero mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
            Turn messy notes into <br />
            professional contracts.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto">
            Lumi instantly converts your unstructured notes, chats, and thoughts
            into formatted legal documents using advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black h-14 px-10 rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-xl"
            >
              Start Generating <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md h-14 px-10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all text-white"
            >
              Log In
            </Link>
          </div>

          <div className="mt-24 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-auto"
                  >
                    <source src="/video/dashboard.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
              </div>
          </div>
        </section>


        <section className="bg-white/[0.02] py-32 border-y border-white/10 backdrop-blur-3xl">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-2xl mb-3 text-white">Instant Drafting</h3>
                        <p className="text-white/50 leading-relaxed">Paste any text, and our AI drafts a structured contract in seconds.</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl hover:bg-white/10 transition-all group">
                         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                             <img src="/images/lumi-logo.ico" alt="Lumi" className="w-6 h-6" />
                         </div>
                        <h3 className="font-bold text-2xl mb-3 text-white">Smart Formatting</h3>
                        <p className="text-white/50 leading-relaxed">Automatically adheres to legal structures, tone, and standard clauses.</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl hover:bg-white/10 transition-all group">
                         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                             <ArrowRight className="w-6 h-6" />
                         </div>
                        <h3 className="font-bold text-2xl mb-3 text-white">Easy Export</h3>
                        <p className="text-white/50 leading-relaxed">Edit in our rich editor and export to Markdown or PDF instantly.</p>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/10 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Lumi. All rights reserved.
      </footer>
    </div>

  );
}