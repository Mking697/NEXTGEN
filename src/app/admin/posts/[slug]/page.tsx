import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { PostEditor } from "@/components/admin/post-editor";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "@/app/actions/admin";
import { getPost } from "@/lib/data";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, { includeHidden: true });
  if (!post) notFound();

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/posts"><ArrowLeft className="size-4" /> Back to posts</Link>
      </Button>
      <PageHead title={post.title} sub="Changes go live the moment you save.">
        {post.id && (
          <DeleteButton id={post.id} name={post.title} action={deletePost} redirectTo="/admin/posts" />
        )}
      </PageHead>
      <PostEditor post={post} />
    </>
  );
}
