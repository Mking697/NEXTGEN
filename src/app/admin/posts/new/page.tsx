import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { PostEditor } from "@/components/admin/post-editor";

export default function NewPostPage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/posts"><ArrowLeft className="size-4" /> Back to posts</Link>
      </Button>
      <PageHead title="New post" sub="It appears on the blog as soon as you save it with visibility on." />
      <PostEditor />
    </>
  );
}
