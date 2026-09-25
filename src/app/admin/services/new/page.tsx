import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/admin/page-head";
import { ServiceEditor } from "@/components/admin/service-editor";

export default function NewServicePage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/admin/services"><ArrowLeft className="size-4" /> Back to services</Link>
      </Button>
      <PageHead title="New service" sub="It appears on the website as soon as you save it with visibility on." />
      <ServiceEditor />
    </>
  );
}
