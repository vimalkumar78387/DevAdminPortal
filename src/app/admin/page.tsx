import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardSummary } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { AdminActivityLog } from "@/lib/schema";
import { PieChart, MessagesSquare, CheckCircle2, Clock3 } from "lucide-react";

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-emerald-50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/30">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}

function ActivityItem({ log }: { log: AdminActivityLog }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
      <div>
        <p className="text-sm font-semibold text-slate-900">{log.action}</p>
        <p className="text-xs text-slate-500">
          {log.adminUsername} • {log.targetType} • {log.targetId}
        </p>
      </div>
      <span className="text-xs text-slate-500">{formatDate(log.createdAt)}</span>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor the community at a glance"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total Posts" value={summary.totalPosts} icon={<MessagesSquare className="h-5 w-5" />} />
        <StatCard title="Published" value={summary.publishedPosts} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard title="Pending" value={summary.pendingPosts} icon={<Clock3 className="h-5 w-5" />} />
        <StatCard title="Answers" value={summary.totalAnswers} icon={<PieChart className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Latest actions" description="Most recent moderation logs" />
          <div className="space-y-3">
            {summary.latestActions.length ? (
              summary.latestActions.map((log) => <ActivityItem key={log.id} log={log} />)
            ) : (
              <p className="text-sm text-slate-500">No actions logged yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Moderation tips" description="Stay consistent with the community guidelines" />
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Remove duplicate or spammy questions quickly.</li>
            <li>Check client codes before deleting to avoid false positives.</li>
            <li>Mark high-signal answers as accepted; clean up low-quality replies.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Community health</Badge>
            <Badge variant="success">Live data</Badge>
            <Badge variant="muted">Audit ready</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
