"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-1.5"><span className="text-2xl font-bold text-accent">Ani</span><span className="text-2xl font-bold text-text">Heist</span></Link>
        </div>
        <h2 className="mb-6 text-center text-2xl font-bold text-text">Create Account</h2>
        {error && <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Username</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your username" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Confirm Password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} placeholder="Repeat your password" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20" /></div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">{loading ? "Creating account..." : "Sign Up"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-text-muted">Already have an account? <Link href="/auth/signin" className="font-medium text-accent hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
