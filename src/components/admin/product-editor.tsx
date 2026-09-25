"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { saveProduct } from "@/app/actions/admin";
import {
  AreaField, ColorField, FormSection, ItemForm, SelectField, TextField, ToggleField,
} from "@/components/admin/item-form";

export function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const p = product;

  return (
    <ItemForm
      action={saveProduct}
      submitLabel={p ? "Save changes" : "Create product"}
      onSaved={() => { router.push("/admin/products"); router.refresh(); }}
    >
      {p?.id && <input type="hidden" name="id" value={p.id} />}

      <FormSection title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Product name" name="name" defaultValue={p?.name} required placeholder="ChatXFlow" />
          <TextField label="Slug (URL)" name="slug" defaultValue={p?.slug} placeholder="chatxflow"
            hint="Leave empty and it is generated from the name. Changing it changes the page URL." />
        </div>
        <TextField label="Tagline" name="tagline" defaultValue={p?.tagline}
          placeholder="WhatsApp & Omnichannel Chat Automation" />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Category" name="category" defaultValue={p?.category} placeholder="Marketing Automation" />
          <SelectField label="Status" name="status" defaultValue={p?.status ?? "live"}
            options={[
              { value: "live", label: "Live" },
              { value: "beta", label: "Beta" },
              { value: "soon", label: "Coming soon" },
            ]} />
          <TextField label="Sort order" name="sort_order" type="number" defaultValue={String(p?.sort_order ?? 99)}
            hint="Lower numbers come first." />
        </div>
        <TextField label="Live URL" name="url" type="url" defaultValue={p?.url} placeholder="https://chatxflow.online"
          hint="Leave empty for products that are not launched. A live URL becomes the proof row on the card." />
      </FormSection>

      <FormSection title="Copy">
        <AreaField label="Short description" name="description" defaultValue={p?.description} rows={3}
          hint="Shown on the card. Two or three lines." />
        <AreaField label="Long description" name="long_description" defaultValue={p?.long_description} rows={5}
          hint="Shown on the product page." />
        <TextField label="Features" name="features" defaultValue={p?.features?.join(", ")}
          placeholder="Chatbot Flow Builder, Bulk Broadcast, Shared Team Inbox"
          hint="Separate with commas. The first four appear on the card." />
        <AreaField label="Highlights" name="highlights" defaultValue={p?.highlights?.join("\n")} rows={4}
          hint="One benefit per line. These appear as ticks on the product page." />
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Price" name="price" defaultValue={p?.price} placeholder="₹4,999/mo" />
          <TextField label="Old price" name="old_price" defaultValue={p?.old_price} placeholder="₹7,999" />
          <TextField label="Price note" name="price_note" defaultValue={p?.price_note} placeholder="Pricing on request" />
        </div>
      </FormSection>

      <FormSection title="Appearance">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Logo text" name="logo_text" defaultValue={p?.logo_text} placeholder="CX"
            hint="Two letters." />
          <ColorField label="Stripe colour 1" name="color_from" defaultValue={p?.color_from} />
          <ColorField label="Stripe colour 2" name="color_to" defaultValue={p?.color_to} />
        </div>
        <p className="text-[0.76rem] text-muted-foreground">
          These two colours only paint the 3px stripe along the top of the card. The logo tile stays
          neutral on purpose — a grid of saturated tiles on white reads as a rainbow and takes the
          emphasis away from the call to action.
        </p>
      </FormSection>

      <FormSection title="Visibility">
        <ToggleField label="Show on the website" name="published" defaultChecked={p?.published !== false} />
        <ToggleField label="Feature on the homepage" name="featured" defaultChecked={!!p?.featured} />
      </FormSection>
    </ItemForm>
  );
}
