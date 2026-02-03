'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import StarBorder from '@/components/StarBorder';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

import { toast } from "sonner";

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
            onSuccess: () => {
                toast.success("Account created successfully!");
                router.push(redirectTo);
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });
      } else {
        await authClient.signIn.email({
          email,
          password,
        }, {
            onSuccess: () => {
                toast.success("Signed in successfully!");
                router.push(redirectTo);
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Side: Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-topo relative z-10 border-r border-white/5">
        <div className="absolute top-8 left-8 sm:left-12 lg:left-24">
            <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
            </Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8 shadow-2xl">
                <img src="/images/lumi-logo.ico" alt="Lumi" className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-hero italic mb-3 tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Join Lumi'}
            </h1>
            <p className="text-white/40 text-lg">
                {mode === 'signin' 
                  ? 'Sign in to continue your professional drafting.' 
                  : 'Start your journey into professional AI drafting.'}
            </p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-full mb-10 w-fit">
              <Link 
                href="/sign-up" 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Register
              </Link>
              <Link 
                href="/sign-in" 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'signin' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                Login
              </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                {mode === 'signup' && (
                <div className="space-y-4 mb-4">
                    <div className="relative group">
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-lg placeholder:text-white/20"
                            placeholder="John Doe"
                        />
                        <label className="absolute -top-2 left-4 bg-black px-2 text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-white transition-colors">
                            Username
                        </label>
                    </div>
                </div>
                )}
                
                <div className="relative group mb-4">
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-lg placeholder:text-white/20"
                        placeholder="email@example.com"
                    />
                    <label className="absolute -top-2 left-4 bg-black px-2 text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-white transition-colors">
                        Email Address
                    </label>
                </div>

                <div className="relative group">
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 outline-none focus:border-white/30 focus:bg-white/10 transition-all text-lg placeholder:text-white/20"
                        placeholder="••••••••"
                    />
                    <label className="absolute -top-2 left-4 bg-black px-2 text-[10px] uppercase tracking-widest text-white/40 group-focus-within:text-white transition-colors">
                        Password
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/40 pt-2">
                <input type="checkbox" className="rounded-md bg-white/5 border-white/10 w-4 h-4 checked:bg-white checked:border-white transition-all appearance-none border cursor-pointer hover:border-white/30" />
                <span>Remember me</span>
            </div>

            <StarBorder
              as="button"
              type="submit"
              disabled={loading}
              className="w-full mt-4"
              color="white"
              speed="3s"
            >
              {loading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block align-middle" />
              ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-bold text-lg">{mode === 'signin' ? 'Start your session' : 'Begin your adventure'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
              )}
            </StarBorder>
          </form>
        </div>

        <footer className="absolute bottom-8 left-8 sm:left-12 lg:left-24 text-[10px] tracking-widest uppercase text-white/20">
            © {new Date().getFullYear()} Lumi AI Platform.
        </footer>
      </div>

      {/* Right Side: Hero Image Container */}
      <div className="hidden lg:flex flex-1 relative bg-white/5 overflow-hidden justify-center items-center p-12">
        <div className="absolute inset-0 z-0">
            <img 
                src="/images/auth.jpg" 
                alt="Lumi Auth Hero" 
                className="w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/20 to-black/80" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-3xl mb-8">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">Lumi Premium Experience</span>
            </div>
            <h2 className="text-6xl font-hero italic text-white mb-6 leading-tight">
                Your professional <br />
                drafting starts <span className="bg-white text-black px-4 rounded-xl rotate-3 inline-block">here</span>
            </h2>
            <p className="text-white/60 text-xl leading-relaxed">
                Discover the best AI-powered legal document generation for your business needs.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
                {['Contracts', 'Proposals', 'SOWs', 'NDAs'].map((type) => (
                    <span key={type} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 backdrop-blur-md">
                        {type}
                    </span>
                ))}
            </div>
        </div>
        
        {/* Floating Tag similar to image */}
        <div className="absolute top-12 right-12 px-5 py-2.5 rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10 flex items-center gap-3 shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">Premium Access Active</span>
        </div>
      </div>
    </div>
  );
}
