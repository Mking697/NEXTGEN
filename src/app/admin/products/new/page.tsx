import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { ProductEditor } from "@/components/admin/product-editor";

export default function NewProductPage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/products"><ArrowLeft className="size-4" /> Back to products</Link>
      </Button>
      <PageHead title="New product" sub="It appears on the website as soon as you save it with visibility on." />
      <ProductEditor />
    </>
  );
}
