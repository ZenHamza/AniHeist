import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AniHeist",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text">Privacy Policy</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <p>Last updated: June 2026</p>

        <h2 className="text-xl font-semibold text-accent">1. Information We Collect</h2>
        <p>
          When you create an account on AniHeist, we collect your email address, username, and any avatar image you upload.
          If you sign in via OAuth (Google or Discord), we receive the email and name associated with that provider.
        </p>
        <p>
          We also collect anonymized usage data such as pages visited, watchlist entries, and interaction with the platform
          to improve our service. This data cannot be traced back to you personally.
        </p>

        <h2 className="text-xl font-semibold text-accent">2. How We Use Your Information</h2>
        <p>
          Your information is used solely to operate and improve AniHeist. This includes personalizing your experience,
          maintaining your watchlist and profile, and communicating with you about account-related matters.
        </p>
        <p>
          We do not sell, rent, or share your personal information with third parties for their marketing purposes.
        </p>

        <h2 className="text-xl font-semibold text-accent">3. Data Storage and Security</h2>
        <p>
          Your data is stored on secure servers with encryption at rest and in transit. Passwords are hashed using bcrypt
          and are never stored in plain text. We implement industry-standard security measures to protect your information.
        </p>

        <h2 className="text-xl font-semibold text-accent">4. Third-Party Services</h2>
        <p>
          AniHeist uses AniList as a data source for anime metadata. When you search for or add anime to your watchlist,
          queries are sent to the AniList API. AniList may collect anonymized query data under their own privacy policy.
        </p>
        <p>
          We also use OAuth providers (Google, Discord) for authentication. These providers share only the information
          you authorize (email and name) and are governed by their respective privacy policies.
        </p>

        <h2 className="text-xl font-semibold text-accent">5. Cookies</h2>
        <p>
          We use essential cookies for session management and authentication. No third-party tracking cookies are used.
          You can control cookie settings through your browser preferences.
        </p>

        <h2 className="text-xl font-semibold text-accent">6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any time by contacting us.
          Account deletion removes all associated data including watchlists, comments, and profile information.
        </p>

        <h2 className="text-xl font-semibold text-accent">7. Contact</h2>
        <p>
          For privacy-related inquiries, please reach out through our{" "}
          <a href="/legal/contact" className="text-accent hover:underline">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
