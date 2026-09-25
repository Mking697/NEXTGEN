import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "When a refund applies, how to request one, and how long it takes.",
  alternates: { canonical: "/refund" },
};

export default async function RefundPage() {
  const { contact } = await getSettings();
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;

  return (
    <LegalPage title="Refund &amp; Cancellation Policy">
      <p>
        We want you to be happy with what you have paid for. This page sets out exactly when a refund
        applies and when it does not, so there is no confusion later.
      </p>

      <h2>1. Try the demo first</h2>
      <p>
        Every product has a free demo and every marketing engagement starts with a free audit. We
        strongly recommend taking those before you pay, so you know precisely what you are buying.
      </p>

      <h2>2. Cancelling a subscription</h2>
      <ul>
        <li>You can cancel at any time</li>
        <li>Cancellation takes effect at the <strong>end</strong> of the current billing period</li>
        <li>Your service keeps working until that period ends</li>
        <li>Automatic renewal stops once you cancel</li>
        <li>Send cancellation requests to <a href={`mailto:${contact.email}`}>{contact.email}</a> or over WhatsApp</li>
      </ul>

      <h2>3. When a refund applies</h2>
      <ul>
        <li><strong>Technical failure:</strong> the service does not work because of a fault on our side and we have not fixed it within 7 working days</li>
        <li><strong>Duplicate payment:</strong> you were charged twice by mistake, and the full extra amount is returned</li>
        <li><strong>Service never delivered:</strong> your account was never activated after payment</li>
        <li><strong>Incorrect charge:</strong> a billing error on our side</li>
      </ul>

      <h2>4. When a refund does not apply</h2>
      <ul>
        <li>Setup, migration and customisation work already carried out</li>
        <li>You changed your mind while the service works as described</li>
        <li>Your business closed or your requirement changed</li>
        <li>The account was suspended for a breach of our terms</li>
        <li>The unused remainder of a partially used billing period</li>
        <li>Third-party costs: payment gateway fees, SMS or WhatsApp credits, domains, and advertising spend already paid to platforms such as Meta or Google</li>
        <li>Advertising management fees for work already performed, since campaign results depend on factors outside our control</li>
      </ul>

      <h2>5. How to request a refund</h2>
      <ol>
        <li>Email <a href={`mailto:${contact.email}`}>{contact.email}</a> within <strong>7 days</strong> of the payment date</li>
        <li>Include your order or invoice number, the payment date, and the reason</li>
        <li>We review and respond within 3 working days</li>
        <li>If approved, the refund reaches your original payment method within 7&ndash;10 working days</li>
      </ol>

      <h2>6. Plan changes</h2>
      <p>
        You can upgrade at any time and the difference is charged pro-rata. Downgrades take effect from
        the next billing cycle; the remainder of the current cycle is not refunded.
      </p>

      <h2>7. Custom development and marketing retainers</h2>
      <p>
        This policy does not cover custom development projects or monthly marketing retainers. Their
        payment and cancellation terms are set out separately in a signed proposal. Completed milestones
        and delivered campaign work are non-refundable.
      </p>

      <h2>8. Contact</h2>
      <p>
        Email: <a href={`mailto:${contact.email}`}>{contact.email}</a><br />
        Phone / WhatsApp: <a href={tel}>{contact.phone}</a><br />
        {contact.hours}
      </p>

      <p className="note">
        <strong>Note for the site owner:</strong> adjust the refund window, the processing time and the
        non-refundable list to match how you actually operate. Whatever is written here is what applies
        to your customers.
      </p>
    </LegalPage>
  );
}
