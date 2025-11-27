import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChangelogList } from "@/components/changelog-list";

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Changelog"
        subtitle="Track product releases and updates"
        actions={
          <Link href="/admin/changelog/create">
            <Button>Add Changelog</Button>
          </Link>
        }
      />
      <ChangelogList />
    </div>
  );
}
