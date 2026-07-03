import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AniHeist",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text">Terms of Service</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <p>Last updated: June 2026</p>

        <h2 className="text-xl font-semibold text-accent">1. Acceptance of Terms</h2>
        <p>
          By accessing or using AniHeist, you agree to be bound by these Terms of Service. If you do not
          agree, please do not use the platform.
        </p>

        <h2 className="text-xl font-semibold text-accent">2. Description of Service</h2>
        <p>
          AniHeist is a web-based platform that provides links to anime content hosted by third-party services.
          We do not host, upload, or store any copyrighted media files. All content links are provided for
          informational and organizational purposes only.
        </p>

        <h2 className="text-xl font-semibold text-accent">3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You must
          provide accurate information when creating an account. You may not use another person&apos;s account
          without permission. We reserve the right to suspend or terminate accounts that violate these terms.
        </p>

        <h2 className="text-xl font-semibold text-accent">4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Use the platform for any illegal purpose.</li>
          <li>Attempt to access restricted areas without authorization.</li>
          <li>Post spam, harassment, or inappropriate content in comments.</li>
          <li>Scrape, crawl, or otherwise extract data without permission.</li>
          <li>Interfere with the proper functioning of the platform.</li>
        </ul>

        <h2 className="text-xl font-semibold text-accent">5. Intellectual Property</h2>
        <p>
          The AniHeist name, logo, and theme are original creations. The platform&apos;s code is open-source
          under the MIT license. Anime metadata and images are sourced from AniList and are subject to
          their respective licenses.
        </p>

        <h2 className="text-xl font-semibold text-accent">6. Limitation of Liability</h2>
        <p>
          AniHeist is provided &quot;as is&quot; without warranties of any kind. We are not responsible for the
          availability or content of third-party services linked from our platform. We shall not be liable
          for any damages arising from your use of the service.
        </p>

        <h2 className="text-xl font-semibold text-accent">7. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the platform after changes constitutes
          acceptance of the new terms. We will notify users of significant changes via email or site notice.
        </p>

        <h2 className="text-xl font-semibold text-accent">8. Governing Law</h2>
        <p>
          These terms are governed by applicable international copyright laws and the laws of the
          jurisdiction in which the platform operates.
        </p>
      </div>
    </div>
  );
}
