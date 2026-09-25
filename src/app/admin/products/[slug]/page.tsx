import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { ProductEditor } from "@/components/admin/product-editor";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct } from "@/app/actions/admin";
import { getProduct } from "@/lib/data";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug, { includeHidden: true });
  if (!product) notFound();

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/products"><ArrowLeft className="size-4" /> Back to products</Link>
      </Button>
      <PageHead title={product.name} sub="Changes go live the moment you save.">
        {product.id && (
          <DeleteButton id={product.id} name={product.name} action={deleteProduct} redirectTo="/admin/products" />
        )}
      </PageHead>
      <ProductEditor product={product} />
    </>
  );
}
