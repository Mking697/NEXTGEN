"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/admin/item-form";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"];

/**
 * Uploads straight from the browser to Supabase Storage and puts the resulting
 * public URL in a hidden input, so the surrounding server action saves it like
 * any other text field.
 *
 * The upload runs as the signed-in admin, so the bucket's write policy — the
 * same is_admin() allow-list the tables use — is what authorises it. The type
 * and size are checked here for a usable error, and again by the bucket, which
 * is the check that actually counts.
 */
export function ImageField({
  name = "image_url", label = "Screenshot", defaultValue, hint, folder,
}: {
  name?: string;
  label?: string;
  defaultValue?: string | null;
  hint?: string;
  folder: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (!supabaseConfigured) {
      toast.error("Supabase is not connected, so there is nowhere to upload to.");
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      toast.error("Use a PNG, JPG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`That file is ${(file.size / 1048576).toFixed(1)} MB. The limit is 5 MB.`);
      return;
    }

    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      // Date-stamped and random, so re-uploading never collides with a cached
      // copy of the previous image at the same URL.
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const supabase = createClient();
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
      toast.success("Uploaded. Remember to save.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Field label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="flex flex-wrap items-start gap-4">
          {/* A plain img, not next/image: this is the admin's own preview of a
              file that may have been uploaded seconds ago, and it must not
              depend on the optimiser having the host allow-listed yet. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url} alt="" width={220} height={140}
            className="h-[140px] w-[220px] rounded-xl border bg-muted object-cover"
          />
          <div className="space-y-2">
            <Button
              type="button" variant="outline" size="sm" disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-4" /> Replace
            </Button>
            <Button
              type="button" variant="outline" size="sm" disabled={busy}
              className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setUrl("")}
            >
              <Trash2 className="size-4" /> Remove
            </Button>
            <p className="max-w-[40ch] break-all text-[0.7rem] text-muted-foreground">{url}</p>
          </div>
        </div>
      ) : (
        <Button
          type="button" variant="outline" disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy
            ? <><Loader2 className="size-4 animate-spin" /> Uploading...</>
            : <><Upload className="size-4" /> Choose an image</>}
        </Button>
      )}

      <input
        ref={inputRef} type="file" accept={ALLOWED.join(",")} className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
    </Field>
  );
}
