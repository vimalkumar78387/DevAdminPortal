import { PageHeader } from "@/components/page-header";
import { Card, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your admin session" />
      <Card>
        <CardHeader title="Logout" description="Sign out of the admin portal" />
        <p className="text-sm text-slate-600">
          Click below to end your session and clear the secure admin cookie.
        </p>
        <form action="/logout" method="post" className="mt-3">
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Logout
          </button>
        </form>
      </Card>
      <Card>
        <CardHeader
          title="Credential policy"
          description="Static credentials are configured via environment variables"
        />
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>ADMIN_USERNAME and ADMIN_PASSWORD are stored in your deployment environment.</li>
          <li>Rotate ADMIN_SESSION_SECRET periodically (32+ chars) and restart the app.</li>
          <li>Use HTTPS in production to keep httpOnly cookies secure.</li>
        </ul>
      </Card>
    </div>
  );
}
