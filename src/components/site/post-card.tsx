import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-card shadow-sm transition-all duration-200 hover:border-input/40 hover:shadow-lg md:hover:-translate-y-[3px]">
      {post.cover_image_url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b bg-muted">
          <Image
            src={post.cover_image_url} alt={post.title} fill
            sizes="(max-width:768px) 100vw, 420px"
            className="object-cover object-top"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <span className="mb-2 text-[0.74rem] font-extrabold uppercase tracking-[0.08em] text-brand-ink">
            {post.category}
          </span>
        )}
        <h3 className="mb-2 text-[1.1rem] font-bold leading-snug">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mb-4 flex-1 text-[0.9rem] text-muted-foreground">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 text-[0.83rem] font-semibold text-muted-foreground group-hover:text-brand-ink">
          {post.read_minutes ?? 4} min read <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </article>
  );
}
