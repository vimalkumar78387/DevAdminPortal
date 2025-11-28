import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { getChangelog } from "@/lib/changelog";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader title={title} />
      {items?.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No items.</p>
      )}
    </Card>
  );
}

export default async function ChangelogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getChangelog(id);
  if (!entry) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Version ${entry.version}`}
        subtitle={`Release date ${formatDate(entry.releaseDate)} • ${entry.releaseType}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="muted">{entry.productName || "General"}</Badge>
            <Badge>{entry.status}</Badge>
            <Link
              href="/admin/changelog"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
            >
              Back to changelogs
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section title="Added" items={entry.added ?? []} />
        <Section title="Improved" items={entry.improved ?? []} />
        <Section title="Fixed" items={entry.fixed ?? []} />
        <Section title="Security" items={entry.security ?? []} />
        <Section title="Deprecated" items={entry.deprecated ?? []} />
        <Section title="Breaking Changes" items={entry.breaking ?? []} />
      </div>

      <Card>
        <CardHeader title="API Changes" />
        {entry.apiChanges && (entry.apiChanges as any[])?.length ? (
          <div className="space-y-3">
            {(entry.apiChanges as any[]).map((change, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">{change.endpoint}</p>
                <p className="text-sm text-slate-600">{change.description}</p>
                <Badge variant={change.impact?.toLowerCase() === "breaking" ? "danger" : "muted"}>
                  {change.impact}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No API changes.</p>
        )}
      </Card>

      {(entry.migrationTitle || entry.migrationDescription || entry.migrationCode) && (
        <Card>
          <CardHeader title="Migration Guidance" />
          {entry.migrationTitle ? <p className="text-sm font-semibold text-slate-800">{entry.migrationTitle}</p> : null}
          {entry.migrationDescription ? (
            <p className="text-sm text-slate-600">{entry.migrationDescription}</p>
          ) : null}
          {entry.migrationCode ? (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              {entry.migrationCode}
            </pre>
          ) : null}
        </Card>
      )}

      {(entry.tags?.length || entry.docsUrl) && (
        <Card>
          <CardHeader title="Meta" />
          <div className="flex flex-wrap gap-2 text-sm text-slate-700">
            {entry.tags?.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
            {entry.docsUrl ? (
              <a href={entry.docsUrl} className="text-indigo-600 underline" target="_blank" rel="noreferrer">
                Docs / Release Notes
              </a>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
