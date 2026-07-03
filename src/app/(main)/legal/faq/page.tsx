import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — AniHeist",
};

const faqs = [
  {
    q: "What is AniHeist?",
    a: "AniHeist is a free anime streaming platform that helps you find and watch your favorite anime in HD quality with English subtitles. Think of it as your vault for anime discovery and streaming.",
  },
  {
    q: "Does AniHeist host anime videos?",
    a: "No. AniHeist does not host, store, or distribute any video files. We provide links to content hosted by third-party streaming services. We are a curation and discovery platform.",
  },
  {
    q: "Is AniHeist free to use?",
    a: "Yes, AniHeist is completely free. There are no subscription fees, paywalled features, or hidden costs. Watch unlimited anime without registration.",
  },
  {
    q: "How do I watch an anime?",
    a: "Search for an anime using the search bar, click on it, then select any episode. Our video player supports HLS streaming with subtitle tracks and quality selection.",
  },
  {
    q: "What quality is available?",
    a: "Streams are available in up to 1080p HD quality with HLS adaptive streaming. The video player automatically adjusts quality based on your connection speed.",
  },
  {
    q: "Do I need an account to watch?",
    a: "No account is required to watch anime. Creating an account unlocks features like watch history tracking, watchlists, and personalized recommendations.",
  },
  {
    q: "Are there ads?",
    a: "No. AniHeist is completely ad-free. We believe in providing a clean, uninterrupted viewing experience.",
  },
  {
    q: "What devices are supported?",
    a: "AniHeist works on any modern browser — desktop, laptop, tablet, and mobile. The responsive design adapts to your screen size.",
  },
  {
    q: "How is my data protected?",
    a: "Your password is hashed with bcrypt, all data is transmitted over HTTPS, and we do not share your personal information with third parties. See our Privacy Policy for full details.",
  },
  {
    q: "Who develops AniHeist?",
    a: "AniHeist is developed by ZenxHamza, a solo developer. The project is open-source and available on GitHub. Contributions, bug reports, and feature suggestions are always welcome.",
  },
];

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-text">Frequently Asked Questions</h1>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border-focus"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-text">
                <span>{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-text-secondary">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
