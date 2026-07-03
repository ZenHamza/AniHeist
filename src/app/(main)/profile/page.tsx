"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FaUser, FaEnvelope, FaClock, FaHeart, FaList, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-20">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="size-20 rounded-full bg-surface" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-surface rounded" />
              <div className="h-4 w-32 bg-surface rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) redirect("/auth/signin");

  const stats = [
    { icon: FaClock, label: "Watch History", value: "Coming soon", href: "#" },
    { icon: FaHeart, label: "Favorites", value: "Coming soon", href: "#" },
    { icon: FaList, label: "Playlists", value: "Coming soon", href: "#" },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      <div className="rounded-xl border border-border bg-surface p-8">
        <div className="flex items-center gap-6">
          {session.user?.image ? (
            <img src={session.user.image} alt="" className="size-20 rounded-full" />
          ) : (
            <div className="size-20 rounded-full bg-accent/20 flex items-center justify-center">
              <FaUser className="size-8 text-accent" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text">{session.user?.name || "User"}</h1>
            <p className="text-text-secondary flex items-center gap-2 mt-1">
              <FaEnvelope size={14} /> {session.user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {stats.map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="rounded-xl border border-border bg-surface p-6 hover:bg-surface-hover transition-colors group">
            <Icon className="size-6 text-accent mb-3" />
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-lg font-semibold text-text group-hover:text-accent transition-colors">{value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 mt-6">
        <h2 className="text-lg font-semibold text-text mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Provider</span>
            <span className="text-sm text-text capitalize">{session.user?.email ? "OAuth" : "Email"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Email</span>
            <span className="text-sm text-text">{session.user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Joined</span>
            <span className="text-sm text-text">Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
