"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DatasetPickerForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const input = value.trim().replace(/^\/+|\/+$/g, "");
    if (!input) {
      setError("Enter a GitHub username and repo, e.g. kaooffline/winspo");
      return;
    }
    const parts = input.split("/").filter(Boolean);
    if (parts.length !== 2) {
      setError("Use the form username/repo, optionally with @ref (e.g. user/repo@v1)");
      return;
    }
    const [user, repo] = parts;
    router.push(`/byo/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`);
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          placeholder="username/repo  (e.g. kaooffline/winspo)"
          spellCheck={false}
          autoCapitalize="off"
          aria-label="GitHub username and repository"
          className="min-w-0 flex-1 rounded-lg border border-border-soft bg-background px-4 py-2.5 font-mono text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Load dataset
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </form>
  );
}
