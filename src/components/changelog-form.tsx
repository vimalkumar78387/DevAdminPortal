"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Modal } from "./ui/modal";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

const releaseTypes = ["Major", "Minor", "Patch"] as const;
const statuses = ["Latest", "Stable", "Deprecated"] as const;
const impacts = ["Breaking", "Non-breaking"] as const;

type ApiChange = { endpoint: string; description: string; impact: string };

export function ChangelogForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const addedText = useRef("");
  const improvedText = useRef("");
  const fixedText = useRef("");
  const securityText = useRef("");
  const deprecatedText = useRef("");
  const breakingText = useRef("");
  const [version, setVersion] = useState("");
  const [productName, setProductName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [releaseType, setReleaseType] = useState<(typeof releaseTypes)[number]>("Minor");
  const [status, setStatus] = useState<(typeof statuses)[number]>("Stable");
  const [apiChanges, setApiChanges] = useState<ApiChange[]>([]);
  const [migrationTitle, setMigrationTitle] = useState("");
  const [migrationDescription, setMigrationDescription] = useState("");
  const [migrationCode, setMigrationCode] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const addApiChange = () => {
    setApiChanges((prev) => [...prev, { endpoint: "", description: "", impact: "Breaking" }]);
  };

  const updateApiChange = (idx: number, field: keyof ApiChange, value: string) => {
    setApiChanges((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const removeApiChange = (idx: number) => {
    setApiChanges((prev) => prev.filter((_, i) => i !== idx));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => Array.from(new Set([...prev, tagInput.trim()])));
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!version.trim() || !releaseDate) {
      toast.error("Version and release date are required");
      return;
    }

    const lines = (value: string) =>
      (value || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    setSaving(true);
    const payload = {
      version,
      releaseDate: new Date(releaseDate).toISOString(),
      releaseType,
      status,
      productName,
      added: lines(addedText.current),
      improved: lines(improvedText.current),
      fixed: lines(fixedText.current),
      security: lines(securityText.current),
      deprecated: lines(deprecatedText.current),
      breaking: lines(breakingText.current),
      apiChanges: apiChanges.filter((a) => a.endpoint || a.description),
      migrationTitle: migrationTitle || undefined,
      migrationDescription: migrationDescription || undefined,
      migrationCode: migrationCode || undefined,
      tags,
      docsUrl: docsUrl || undefined,
    };

    const res = await fetch("/api/changelog/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      toast.success("Changelog saved");
      router.push("/admin/changelog");
      router.refresh();
    } else {
      toast.error("Failed to save changelog");
    }
  };

  const SectionSingle = ({
    title,
    onChange,
  }: {
    title: string;
    onChange: (value: string) => void;
  }) => (
    <Card className="bg-white">
      <CardHeader title={title} description={`Add ${title.toLowerCase()} notes`} />
      <textarea
        rows={3}
        autoComplete="off"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder={`${title} item`}
        onChange={(e) => onChange(e.target.value)}
      />
    </Card>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-white">
        <CardHeader title="Basic Information" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Version</label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="2.1.0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product / Application</label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="SabPaisa Platform" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Release Date</label>
            <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Release Type</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              value={releaseType}
              onChange={(e) => setReleaseType(e.target.value as (typeof releaseTypes)[number])}
            >
              {releaseTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SectionSingle title="Added" onChange={(v) => (addedText.current = v)} />
        <SectionSingle title="Improved" onChange={(v) => (improvedText.current = v)} />
        <SectionSingle title="Fixed" onChange={(v) => (fixedText.current = v)} />
        <SectionSingle title="Security" onChange={(v) => (securityText.current = v)} />
        <SectionSingle title="Deprecated" onChange={(v) => (deprecatedText.current = v)} />
        <SectionSingle title="Breaking Changes" onChange={(v) => (breakingText.current = v)} />
      </div>

      <Card className="bg-white">
        <CardHeader title="API Changes" description="Document endpoint-level changes" />
        <div className="space-y-3">
          {apiChanges.map((change, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">API Change #{idx + 1}</p>
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => removeApiChange(idx)}
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Endpoint</label>
                  <Input
                    value={change.endpoint}
                    onChange={(e) => updateApiChange(idx, "endpoint", e.target.value)}
                    placeholder="/api/v2/payments"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-slate-600">Impact</label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                    value={change.impact}
                    onChange={(e) => updateApiChange(idx, "impact", e.target.value)}
                  >
                    {impacts.map((imp) => (
                      <option key={imp} value={imp}>
                        {imp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <label className="text-sm text-slate-600">Description</label>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  value={change.description}
                  onChange={(e) => updateApiChange(idx, "description", e.target.value)}
                  placeholder="Describe the change and impact."
                />
              </div>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addApiChange}>
            <Plus className="h-4 w-4" /> Add API Change
          </Button>
        </div>
      </Card>

      <Card className="bg-white">
        <CardHeader title="Migration Guidance (Optional)" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Migration Title</label>
            <Input value={migrationTitle} onChange={(e) => setMigrationTitle(e.target.value)} placeholder="e.g., Upgrade to v2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Docs / Release Notes URL</label>
            <Input value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Migration Description</label>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
            value={migrationDescription}
            onChange={(e) => setMigrationDescription(e.target.value)}
            placeholder="Explain how to migrate."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Code Example (optional)</label>
          <textarea
            className="font-mono min-h-[120px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            value={migrationCode}
            onChange={(e) => setMigrationCode(e.target.value)}
            placeholder={`// Example
fetch('/v2/payments', { method: 'POST' })`}
          />
        </div>
      </Card>

      <Card className="bg-white">
        <CardHeader title="Meta Information" />
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Tags / Labels</label>
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="payments, auth, sdk"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="muted" className="flex items-center gap-2">
                  {tag}
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => setShowConfirm(true)} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changelog"}
        </Button>
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => router.push("/admin/changelog")}
        confirmLabel="Leave"
        confirmVariant="outline"
        title="Discard changes?"
        description="You have unsaved changes. Leave without saving?"
      />
    </form>
  );
}
