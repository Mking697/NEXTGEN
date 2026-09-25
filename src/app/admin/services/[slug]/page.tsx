import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { ServiceEditor } from "@/components/admin/service-editor";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteService } from "@/app/actions/admin";
import { getService } from "@/lib/data";

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug, { includeHidden: true });
  if (!service) notFound();

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/services"><ArrowLeft className="size-4" /> Back to services</Link>
      </Button>
      <PageHead title={service.name} sub="Changes go live the moment you save.">
        {service.id && (
          <DeleteButton id={service.id} name={service.name} action={deleteService} redirectTo="/admin/services" />
        )}
      </PageHead>
      <ServiceEditor service={service} />
    </>
  );
}
