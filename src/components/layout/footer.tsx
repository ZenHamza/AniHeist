import Link from "next/link";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import { BLOG_URL, DEV_URL } from "@/lib/utils/constants";

const footerLinks = {
  navigation: [
    { label: "Home", href: "/" },
    { label: "Popular", href: "/popular" },
    { label: "Search", href: "/search" },
  ],
  genres: [
    { label: "Action", href: "/genre/Action" },
    { label: "Romance", href: "/genre/Romance" },
    { label: "Comedy", href: "/genre/Comedy" },
    { label: "Fantasy", href: "/genre/Fantasy" },
    { label: "Isekai", href: "/genre/Isekai" },
  ],
  community: [
    { label: "Blog", href: BLOG_URL, external: true },
    { label: "FAQ", href: "/legal/faq" },
    { label: "Contact", href: "/legal/contact" },
    { label: "About", href: "/legal/about" },
  ],
  legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "DMCA", href: "/legal/dmca" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-auto">
      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1.5 mb-3">
              <span className="text-xl font-bold text-accent">Ani</span>
              <span className="text-xl font-bold text-text">Heist</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Watch anime online in high quality with English subtitles.
              Ad-free, fast, and responsive. Track your progress and discover
              your next favorite series.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                aria-label="Discord"
                className="text-text-muted hover:text-text transition-colors"
              >
                <FaDiscord size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-text-muted hover:text-text transition-colors"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-text-muted hover:text-text transition-colors"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-text">
              Navigation
            </h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-text">Genres</h4>
            <ul className="space-y-2">
              {footerLinks.genres.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-text">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={
                      link.external ? "noopener noreferrer" : undefined
                    }
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-sm mb-3 mt-5 text-text">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-8 border-t border-border">
          <p className="text-xs text-text-muted/50 text-center max-w-lg">
            This website does not retain any files on its servers; it solely provides links to media content hosted by third-party services.
          </p>
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} AniHeist. Developed by{" "}
            <a
              href={DEV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors font-medium"
            >
              ZenxHamza
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
