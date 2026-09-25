import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Essor Automations collects, uses and protects your data, and what your rights are.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const { contact, brand } = await getSettings();
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;

  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains how <strong>{brand.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;)
        collects, uses and protects your data when you use our website or our products. By using the
        website you agree to this policy.
      </p>

      <h2>1. What we collect</h2>
      <ul>
        <li><strong>What you give us:</strong> name, phone number, WhatsApp number, email address, company name, and whatever you write in a form or a chat.</li>
        <li><strong>Automatic technical data:</strong> IP address, browser and device type, referring page, and which pages you viewed. This comes from analytics cookies.</li>
        <li><strong>Product data:</strong> if you use one of our products, the business data inside it stays yours; we access it only to run the service and provide support.</li>
      </ul>

      <h2>2. Why we collect it</h2>
      <ul>
        <li>To answer your enquiry and schedule a demo</li>
        <li>To deliver the service, set up your account and provide support</li>
        <li>For invoicing, payments and account communication</li>
        <li>To understand and improve how the website performs</li>
        <li>To measure advertising campaigns (for example Meta Pixel, Google Analytics)</li>
        <li>To meet a legal or regulatory obligation</li>
      </ul>

      <h2>3. Cookies and tracking</h2>
      <p>
        We use cookies and similar technologies. These may include third-party tools such as the Meta
        (Facebook) Pixel and Google Analytics, which tell us where you arrived from and what you did.
        You can block or delete cookies in your browser settings, though parts of the site will then
        not work properly.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We do not sell your personal data. It is shared only in these cases:</p>
      <ul>
        <li><strong>Service providers:</strong> hosting, database, email, payment gateway and analytics partners acting on our instructions</li>
        <li><strong>Legal requirement:</strong> where the law, a court or a government authority requires it</li>
        <li><strong>Business transfer:</strong> in a merger or acquisition, under the same terms as this policy</li>
      </ul>

      <h2>5. How long we keep it</h2>
      <p>
        Enquiry data is kept for as long as it is needed for the business purpose, or until you ask us
        to delete it. Customer and billing records are retained as required by applicable tax and
        accounting law.
      </p>

      <h2>6. Security</h2>
      <p>
        Data is stored on secure servers, transmitted over HTTPS, and access is role-based so only the
        team members who need it have it. Backups are taken regularly. No internet transmission is ever
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>7. Your rights</h2>
      <ul>
        <li>Request a copy of your data</li>
        <li>Have incorrect data corrected</li>
        <li>Have your data deleted, where no legal obligation requires us to keep it</li>
        <li>Opt out of marketing communication</li>
        <li>Request an export of your data</li>
      </ul>
      <p>
        For any of these, email <a href={`mailto:${contact.email}`}>{contact.email}</a>. We respond
        within 30 days.
      </p>

      <h2>8. Children</h2>
      <p>Our services are not intended for anyone under 18 and we do not knowingly collect their data.</p>

      <h2>9. Third-party links</h2>
      <p>
        Our website links to other sites, including our own product domains. Those sites have their own
        privacy policies and we are not responsible for their content.
      </p>

      <h2>10. Changes</h2>
      <p>We may update this policy. The new version will be published on this page with a revised date.</p>

      <h2>11. Contact</h2>
      <p>
        <strong>{brand.name}</strong><br />
        Email: <a href={`mailto:${contact.email}`}>{contact.email}</a><br />
        Phone: <a href={tel}>{contact.phone}</a><br />
        {contact.address}
      </p>

      <p className="note">
        <strong>Note for the site owner:</strong> this is a general template. Before running ads, add
        your registered company name, address and GSTIN, and have it reviewed by a legal advisor.
      </p>
    </LegalPage>
  );
}
