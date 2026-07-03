"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text">Contact Us</h1>

      {sent ? (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-lg font-semibold text-green-400">Message Sent!</p>
          <p className="mt-1 text-sm text-text-secondary">We&apos;ll get back to you within 24-48 hours.</p>
          <button
            onClick={() => setSent(false)}
            className="mt-4 rounded-lg bg-surface-raised border border-border px-4 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Name</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Subject</label>
            <input
              type="text" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="What is this about?"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">Message</label>
            <textarea
              required value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              placeholder="Tell us your thoughts..."
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none"
            />
          </div>
          <button
            type="submit" disabled={sending}
            className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}

      <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
        <h2 className="text-xl font-semibold text-accent">Other Ways to Reach Us</h2>
        <p>Email: <a href="mailto:support@yourdomain.com" className="text-accent hover:underline">support@yourdomain.com</a></p>
        <p>For DMCA notices, see our <a href="/legal/dmca" className="text-accent hover:underline">DMCA page</a>.</p>
        <p>Response time: 24-48 hours during business days.</p>

        <div className="mt-6 rounded-xl border border-border bg-surface-raised p-4">
          <p className="font-semibold text-accent">Developed by ZenxHamza</p>
          <p className="mt-1">
            <a href="https://zenxhamza.xyz" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              zenxhamza.xyz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
