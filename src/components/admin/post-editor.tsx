"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { savePost } from "@/app/actions/admin";
import {
  AreaField, FormSection, ItemForm, TextField, ToggleField,
} from "@/components/admin/item-form";
import { ImageField } from "@/components/admin/image-field";

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const p = post;

  return (
    <ItemForm
      action={savePost}
      submitLabel={p ? "Save changes" : "Publish post"}
      onSaved={() => { router.push("/admin/posts"); router.refresh(); }}
    >
      {p?.id && <input type="hidden" name="id" value={p.id} />}

      <FormSection title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Title" name="title" defaultValue={p?.title} required
            placeholder="Pharmacy Billing Software in India: What to Look for in 2025" />
          <TextField label="Slug (URL)" name="slug" defaultValue={p?.slug} placeholder="pharmacy-billing-software-india"
            hint="Leave empty and it is generated from the title. Changing it changes the page URL." />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Category" name="category" defaultValue={p?.category} placeholder="Healthcare" />
          <TextField label="Read time (minutes)" name="read_minutes" type="number"
            defaultValue={String(p?.read_minutes ?? 4)} />
        </div>
        <AreaField label="Excerpt" name="excerpt" defaultValue={p?.excerpt} rows={2}
          hint="Shown on the blog listing card and used as the fallback meta description." />
      </FormSection>

      <FormSection title="Content">
        <AreaField label="Body" name="content" defaultValue={p?.content} rows={16}
          hint={'Lightweight markdown: leave a blank line between paragraphs, start a line with "## " for a heading, and "- " for a bullet list.'} />
      </FormSection>

      <FormSection title="Cover image">
        <ImageField name="cover_image_url" folder="posts" defaultValue={p?.cover_image_url}
          hint="Shown on the listing card and at the top of the post. 1600x1000 or wider reads best." />
      </FormSection>

      <FormSection title="SEO">
        <TextField label="SEO title" name="seo_title" defaultValue={p?.seo_title}
          hint="Overrides the browser tab title and search-result title. Leave empty to use the post title." />
        <AreaField label="SEO description" name="seo_description" defaultValue={p?.seo_description} rows={2}
          hint="The meta description search engines show. Leave empty to use the excerpt." />
      </FormSection>

      <FormSection title="Visibility">
        <ToggleField label="Publish on the website" name="published" defaultChecked={p?.published !== false} />
        <ToggleField label="Feature on the blog listing" name="featured" defaultChecked={!!p?.featured} />
      </FormSection>
    </ItemForm>
  );
}
