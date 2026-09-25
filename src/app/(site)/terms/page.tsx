import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to using Essor Automations products and services.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const { contact, brand } = await getSettings();
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;

  return (
    <LegalPage title="Terms &amp; Conditions">
      <p>
        These terms apply to the <strong>{brand.name}</strong> website and services. By using the
        website or subscribing to a service you agree to them. If you do not agree, please do not use
        the services.
      </p>

      <h2>1. Services</h2>
      <p>
        We provide subscription-based business software (such as ChatXFlow, DawaiStore, PanelSuite,
        Autolyst and Admetics) along with setup, customisation and support, and digital marketing
        services. The exact features, limits and pricing for your engagement are set out in your order
        or proposal.
      </p>

      <h2>2. Account and eligibility</h2>
      <ul>
        <li>You must be 18 or older to create an account</li>
        <li>You will provide accurate and complete information</li>
        <li>Keeping your login credentials secure is your responsibility</li>
        <li>You are responsible for activity carried out on your account</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>While using the services you will not:</p>
      <ul>
        <li>Do anything unlawful, send spam, or message people in bulk without permission</li>
        <li>Attempt to hack, reverse engineer or bypass security</li>
        <li>Infringe the intellectual property or privacy rights of others</li>
        <li>Resell or sublicense the service without written permission</li>
        <li>Upload malware or unlawful data</li>
      </ul>
      <p>We may suspend or terminate an account that breaches these terms, without refund.</p>

      <h2>4. Payment and billing</h2>
      <ul>
        <li>Fees follow your selected plan or proposal</li>
        <li>Subscription fees are payable in advance</li>
        <li>Applicable taxes (GST) are charged separately</li>
        <li>Service may be suspended for non-payment</li>
        <li>Existing customers get notice before any price change</li>
      </ul>

      <h2>5. Your data</h2>
      <p>
        Your business data remains yours. We process it only to deliver the service, take backups and
        provide support, as described in our <Link href="/privacy">Privacy Policy</Link>. You can export
        your full data at any time while your subscription is active.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        All rights in the software, source code, design, branding and documentation remain with us. A
        subscription grants you a limited, non-exclusive, non-transferable right to use the software.
        Ownership does not transfer.
      </p>

      <h2>7. Uptime and support</h2>
      <p>
        We work hard to keep the services reliable but cannot guarantee uninterrupted uptime. Planned
        maintenance is announced in advance. Support is available during business hours ({contact.hours}).
      </p>

      <h2>8. Third-party services</h2>
      <p>
        Some features depend on third parties (payment gateways, messaging platforms, cloud hosting, ad
        platforms). We are not responsible for their downtime, policy changes or restrictions.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect, incidental or consequential loss,
        including loss of business, profit or data. Our total liability for any claim is limited to the
        amount you paid us in the preceding three months.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may cancel at any time; cancellation takes effect from the next billing cycle. We may
        terminate for breach, non-payment or misuse. After termination you have 30 days to export your
        data.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by Indian law. Any dispute falls under the exclusive jurisdiction of
        the courts local to our registered office.
      </p>

      <h2>12. Contact</h2>
      <p>
        <strong>{brand.name}</strong><br />
        Email: <a href={`mailto:${contact.email}`}>{contact.email}</a><br />
        Phone: <a href={tel}>{contact.phone}</a>
      </p>

      <p className="note">
        <strong>Note for the site owner:</strong> this is a general template. Add your registered
        company name, address and jurisdiction city, and have it reviewed by a legal advisor before
        launch.
      </p>
    </LegalPage>
  );
}
