"use client";

import { useEffect, useRef } from "react";

const NATIVE_CONTAINER = "container-8625640aeb94d9a2d476701634411d30";
const NATIVE_SCRIPT = "https://surelydecoratedfundraiser.com/8625640aeb94d9a2d476701634411d30/invoke.js";
const SMARTLINK_URL = "https://surelydecoratedfundraiser.com/yb879h04?key=66f51181b2eeb66848b2fe01536c2dc8";

/* ── Native Banner (script-based ad injects into container) ── */
export function AdNative({ className = "" }: { className?: string }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const s = document.createElement("script");
    s.async = true;
    s.dataset.cfasync = "false";
    s.src = NATIVE_SCRIPT;
    document.body.appendChild(s);
  }, []);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 right-0 text-center z-10">
        <span className="text-[8px] uppercase tracking-[0.2em] text-white/10">Advertisement</span>
      </div>
      <div id={NATIVE_CONTAINER} />
    </div>
  );
}

/* ── SmartLink (clickable sponsored banner) ── */
export function AdSmartLink({
  format = "banner",
  className = "",
}: {
  format?: "banner" | "rectangle";
  className?: string;
}) {
  const isRect = format === "rectangle";
  return (
    <a
      href={SMARTLINK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`relative flex flex-col items-center justify-center border border-white/[0.06] rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group ${className}`}
      style={{ width: "100%", maxWidth: isRect ? 300 : 728, minHeight: isRect ? 250 : 90 }}
    >
      <span className="text-[8px] uppercase tracking-[0.2em] text-white/10 absolute top-1 left-0 right-0 text-center">Advertisement</span>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-white/20 group-hover:text-accent/60 transition-colors">Sponsored Link</span>
        <span className="text-[10px] text-white/10">Support AniHeist</span>
      </div>
    </a>
  );
}
