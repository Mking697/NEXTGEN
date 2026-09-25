"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AreaField, FormSection, ItemForm, TextField } from "@/components/admin/item-form";

export function SettingsEditor({ settings }: { settings: SiteSettings }) {
  const s = settings;
  const [faq, setFaq] = useState(s.faq);

  return (
    <ItemForm action={saveSettings} submitLabel="Save settings">
      <FormSection title="Brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Company name" name="brand_name" defaultValue={s.brand.name} required />
          <TextField label="Website URL" name="brand_url" defaultValue={s.brand.url} placeholder="https://essorautomations.com" />
        </div>
        <TextField label="Tagline" name="brand_tagline" defaultValue={s.brand.tagline} />
      </FormSection>

      <FormSection title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Primary phone" name="phone" defaultValue={s.contact.phone} placeholder="+91 93114 32603" />
          <TextField label="Secondary phone" name="phone2" defaultValue={s.contact.phone2} placeholder="+91 90272 02796" />
        </div>
        <TextField
          label="WhatsApp number" name="whatsapp" defaultValue={s.contact.whatsapp}
          placeholder="919311432603"
          hint="Digits only, with the country code and no + or spaces. Every WhatsApp button on the site uses this — if it is wrong, every enquiry goes nowhere."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" name="email" type="email" defaultValue={s.contact.email} />
          <TextField label="Address" name="address" defaultValue={s.contact.address} />
        </div>
        <TextField label="Business hours" name="hours" defaultValue={s.contact.hours} placeholder="Mon – Sat, 10:00 AM – 7:00 PM IST" />
      </FormSection>

      <FormSection title="Social links">
        <p className="text-[0.8rem] text-muted-foreground">Leave a field empty and that icon is hidden from the footer.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Facebook" name="facebook" defaultValue={s.social.facebook} placeholder="https://facebook.com/..." />
          <TextField label="Instagram" name="instagram" defaultValue={s.social.instagram} placeholder="https://instagram.com/..." />
          <TextField label="LinkedIn" name="linkedin" defaultValue={s.social.linkedin} placeholder="https://linkedin.com/company/..." />
          <TextField label="YouTube" name="youtube" defaultValue={s.social.youtube} placeholder="https://youtube.com/@..." />
          <TextField label="X / Twitter" name="twitter" defaultValue={s.social.twitter} placeholder="https://x.com/..." />
        </div>
      </FormSection>

      <FormSection title="Homepage hero">
        <TextField label="Badge text" name="hero_pill" defaultValue={s.hero.pill} placeholder="7 products built in-house" />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Headline — first part" name="hero_title_lead" defaultValue={s.hero.title_lead} />
          <TextField label="Headline — red part" name="hero_title_accent" defaultValue={s.hero.title_accent}
            hint="This is the only part shown in red." />
          <TextField label="Headline — last part" name="hero_title_tail" defaultValue={s.hero.title_tail} />
        </div>
        <AreaField label="Sub-headline" name="hero_subtitle" defaultValue={s.hero.subtitle} rows={3} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Primary button" name="hero_cta_primary" defaultValue={s.hero.cta_primary} />
          <TextField label="WhatsApp button" name="hero_cta_whatsapp" defaultValue={s.hero.cta_whatsapp} />
        </div>
      </FormSection>

      <FormSection title="Trust band">
        <p className="text-[0.8rem] text-muted-foreground">
          Three numbers, shown under the hero. Use only figures you could defend if a visitor asked
          about them on WhatsApp — this audience is quick to distrust a padded stat. Leave a pair
          empty to drop that column.
        </p>
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <div>
              <Label htmlFor={`trust_value_${i}`} className="mb-1.5">Number {i + 1}</Label>
              <Input id={`trust_value_${i}`} name={`trust_value_${i}`} defaultValue={s.trust[i]?.value ?? ""} placeholder="32" />
            </div>
            <div>
              <Label htmlFor={`trust_label_${i}`} className="mb-1.5">Label {i + 1}</Label>
              <Input id={`trust_label_${i}`} name={`trust_label_${i}`} defaultValue={s.trust[i]?.label ?? ""} placeholder="Businesses served" />
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Who it is for">
        <AreaField
          label="Audience chips" name="audiences" defaultValue={s.audiences.join("\n")} rows={7}
          hint="One per line. These are the chips under the trust band."
        />
      </FormSection>

      <FormSection title="Call-to-action band">
        <TextField label="Heading" name="cta_title" defaultValue={s.cta.title} />
        <AreaField label="Sub-text" name="cta_subtitle" defaultValue={s.cta.subtitle} rows={2} />
      </FormSection>

      <FormSection title="FAQ">
        <p className="text-[0.8rem] text-muted-foreground">
          The first question is the one people actually scroll for — keeping the pricing question at
          the top turns the objection into the call to action.
        </p>
        <div className="space-y-4">
          {faq.map((f, i) => (
            <div key={i} className="rounded-xl border bg-muted/40 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <Label htmlFor={`faq_q_${i}`} className="text-[0.8rem] font-bold">Question {i + 1}</Label>
                <Button
                  type="button" variant="ghost" size="icon"
                  aria-label={`Remove question ${i + 1}`}
                  className="size-8 hover:text-destructive"
                  onClick={() => setFaq(faq.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Input id={`faq_q_${i}`} name="faq_q" defaultValue={f.q} placeholder="Why are there no prices on the site?" className="mb-2" />
              <Textarea name="faq_a" defaultValue={f.a} rows={3} aria-label={`Answer ${i + 1}`} />
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => setFaq([...faq, { q: "", a: "" }])}>
          <Plus className="size-4" /> Add question
        </Button>
      </FormSection>

      <FormSection title="SEO">
        <TextField label="Page title" name="seo_title" defaultValue={s.seo.title}
          hint="Shown in the browser tab and in Google results. Around 60 characters works best." />
        <AreaField label="Meta description" name="seo_description" defaultValue={s.seo.description} rows={3}
          hint="The grey text under your link in Google. Around 155 characters." />
      </FormSection>
    </ItemForm>
  );
}
