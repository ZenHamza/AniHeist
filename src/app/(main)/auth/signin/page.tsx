"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) setError("Invalid email or password");
    else router.push("/");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-accent">Ani</span>
            <span className="text-2xl font-bold text-text">Heist</span>
          </Link>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-text">Sign In</h2>
        {error && <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">Sign In</button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" /><span className="text-xs text-text-muted">or continue with</span><div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background py-2.5 text-sm text-text transition-colors hover:bg-surface-hover"><FaGoogle size={16} /> Google</button>
          <button onClick={() => signIn("discord", { callbackUrl: "/" })} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background py-2.5 text-sm text-text transition-colors hover:bg-surface-hover"><FaDiscord size={16} /> Discord</button>
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">Don&apos;t have an account? <Link href="/auth/signup" className="font-medium text-accent hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}
