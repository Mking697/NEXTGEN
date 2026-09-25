"use client";

import { useRouter } from "next/navigation";
import type { Service } from "@/lib/types";
import { saveService } from "@/app/actions/admin";
import {
  AreaField, ColorField, FormSection, ItemForm, SelectField, TextField, ToggleField,
} from "@/components/admin/item-form";
import { ImageField } from "@/components/admin/image-field";

const ICONS = [
  { value: "target", label: "Target — paid advertising" },
  { value: "chart", label: "Chart — analytics, search" },
  { value: "chat", label: "Chat — messaging, WhatsApp" },
  { value: "zap", label: "Zap — speed, web, automation" },
  { value: "sliders", label: "Sliders — creative, branding" },
  { value: "refresh", label: "Refresh — SEO, ongoing work" },
  { value: "tool", label: "Tool — custom development" },
];

export function ServiceEditor({ service }: { service?: Service }) {
  const router = useRouter();
  const s = service;

  return (
    <ItemForm
      action={saveService}
      submitLabel={s ? "Save changes" : "Create service"}
      onSaved={() => { router.push("/admin/services"); router.refresh(); }}
    >
      {s?.id && <input type="hidden" name="id" value={s.id} />}

      <FormSection title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Service name" name="name" defaultValue={s?.name} required placeholder="Meta Ads Management" />
          <TextField label="Slug (URL)" name="slug" defaultValue={s?.slug} placeholder="meta-ads-management"
            hint="Leave empty and it is generated from the name." />
        </div>
        <TextField label="Tagline" name="tagline" defaultValue={s?.tagline}
          placeholder="Facebook & Instagram ads that bring enquiries, not just likes" />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Category" name="category" defaultValue={s?.category} placeholder="Paid Advertising" />
          <SelectField label="Icon" name="icon" defaultValue={s?.icon ?? "zap"} options={ICONS} />
          <TextField label="Sort order" name="sort_order" type="number" defaultValue={String(s?.sort_order ?? 99)}
            hint="Lower numbers come first." />
        </div>
      </FormSection>

      <FormSection title="Copy">
        <AreaField label="Short description" name="description" defaultValue={s?.description} rows={3}
          hint="Shown on the card." />
        <AreaField label="Long description" name="long_description" defaultValue={s?.long_description} rows={5}
          hint="Shown on the service page." />
        <AreaField label="What is included" name="deliverables" defaultValue={s?.deliverables?.join("\n")} rows={6}
          hint="One deliverable per line. The first four appear on the card." />
        <AreaField label="What changes for the customer" name="outcomes" defaultValue={s?.outcomes?.join("\n")} rows={4}
          hint="One outcome per line. These appear as ticks on the service page." />
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Price" name="price" defaultValue={s?.price} placeholder="₹25,000/mo" />
          <TextField label="Price note" name="price_note" defaultValue={s?.price_note}
            placeholder="Monthly retainer + ad spend. Quoted after a free audit." />
        </div>
      </FormSection>

      <FormSection title="Appearance">
        <ImageField folder="services" defaultValue={s?.image_url}
          hint="A real screen from the service, not a stock photo. This is the strongest proof you have that the software exists. Wide shots read best — around 1600x1000. PNG, JPG, WebP or AVIF, up to 5 MB." />
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField label="Stripe colour 1" name="color_from" defaultValue={s?.color_from} />
          <ColorField label="Stripe colour 2" name="color_to" defaultValue={s?.color_to} />
        </div>
        <p className="text-[0.76rem] text-muted-foreground">
          These paint the 3px stripe along the top of the card only. The icon tile uses the brand tint
          so the cards stay consistent with each other.
        </p>
      </FormSection>

      <FormSection title="Visibility">
        <ToggleField label="Show on the website" name="published" defaultChecked={s?.published !== false} />
        <ToggleField label="Feature on the homepage" name="featured" defaultChecked={!!s?.featured} />
      </FormSection>
    </ItemForm>
  );
}
