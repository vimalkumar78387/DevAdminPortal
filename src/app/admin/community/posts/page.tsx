import { PageHeader } from "@/components/page-header";
import { PostsTable } from "@/components/posts-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Posts | DevAdminPortal",
};

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community Posts"
        subtitle="Search, filter, and moderate discussions"
      />
      <PostsTable />
    </div>
  );
}
