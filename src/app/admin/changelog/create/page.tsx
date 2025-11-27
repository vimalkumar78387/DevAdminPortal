import { PageHeader } from "@/components/page-header";
import { ChangelogForm } from "@/components/changelog-form";

export default function CreateChangelogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Changelog"
        subtitle="Document release details and changes"
      />
      <ChangelogForm />
    </div>
  );
}
