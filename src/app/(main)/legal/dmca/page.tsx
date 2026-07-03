import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA — AniHeist",
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text">DMCA Notice</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <p>Last updated: June 2026</p>

        <h2 className="text-xl font-semibold text-accent">Copyright Compliance</h2>
        <p>
          AniHeist respects the intellectual property rights of others and expects its users to do the same.
          In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to notices
          of alleged copyright infringement.
        </p>

        <h2 className="text-xl font-semibold text-accent">No Hosting of Copyrighted Content</h2>
        <p>
          AniHeist does not host, store, or distribute any copyrighted media files on its servers. Our platform
          solely provides links to content hosted by third-party services. We do not control the content
          available through these external links.
        </p>

        <h2 className="text-xl font-semibold text-accent">Filing a DMCA Notice</h2>
        <p>
          If you believe that your copyrighted work has been made available on AniHeist in a way that constitutes
          copyright infringement, please provide our designated copyright agent with the following information:
        </p>
        <ul className="list-inside list-disc space-y-1 pl-4">
          <li>Your physical or electronic signature.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing, with enough detail for us to locate it.</li>
          <li>Your name, address, telephone number, and email address.</li>
          <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner.</li>
          <li>A statement, under penalty of perjury, that the information in the notice is accurate.</li>
        </ul>

        <h2 className="text-xl font-semibold text-accent">Submission</h2>
        <p>
          Send DMCA notices to our designated agent through our{" "}
          <a href="/legal/contact" className="text-accent hover:underline">Contact page</a>.
          We will investigate and take appropriate action within 48 hours of receiving a valid notice.
        </p>

        <h2 className="text-xl font-semibold text-accent">Counter-Notification</h2>
        <p>
          If you believe that material you posted was removed or disabled as a result of a mistake or
          misidentification, you may file a counter-notification with the same contact information above,
          including a statement under penalty of perjury that you have a good faith belief the material
          was removed as a result of mistake or misidentification.
        </p>
      </div>
    </div>
  );
}
