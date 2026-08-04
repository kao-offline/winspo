"use client";

import { useState } from "react";

function JsonBlock({ value, error }: { value: unknown; error: string | null }) {
  if (error) {
    return <p className="mt-2 rounded-lg bg-accent-soft px-4 py-2.5 text-sm text-accent">{error}</p>;
  }
  if (value === null) return null;
  return (
    <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-border-soft bg-background/70 p-3 text-xs leading-relaxed">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

async function getJson(url: string): Promise<{ ok: boolean; data: unknown; message: string | null }> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        data && typeof data === "object" && "message" in data
          ? String((data as { message: unknown }).message)
          : `Request failed (${res.status})`;
      return { ok: false, data: null, message };
    }
    return { ok: true, data, message: null };
  } catch {
    return { ok: false, data: null, message: "Couldn't reach the API." };
  }
}

export default function DevTools() {
  const [encDataset, setEncDataset] = useState("kao");
  const [encSlots, setEncSlots] = useState("0,1,2");
  const [encResult, setEncResult] = useState<unknown>(null);
  const [encError, setEncError] = useState<string | null>(null);
  const [encLoading, setEncLoading] = useState(false);

  const [decDataset, setDecDataset] = useState("kao");
  const [decCode, setDecCode] = useState("7");
  const [decResult, setDecResult] = useState<unknown>(null);
  const [decError, setDecError] = useState<string | null>(null);
  const [decLoading, setDecLoading] = useState(false);

  const runEncode = async () => {
    setEncLoading(true);
    const { ok, data, message } = await getJson(
      `/api/encode?dataset=${encodeURIComponent(encDataset.trim())}&slots=${encodeURIComponent(encSlots.trim())}`
    );
    setEncLoading(false);
    setEncResult(ok ? data : null);
    setEncError(message);
  };

  const runDecode = async () => {
    setDecLoading(true);
    const { ok, data, message } = await getJson(
      `/api/decode?dataset=${encodeURIComponent(decDataset.trim())}&code=${encodeURIComponent(decCode.trim())}`
    );
    setDecLoading(false);
    setDecResult(ok ? data : null);
    setDecError(message);
  };

  const inputClass =
    "min-w-0 flex-1 rounded-lg border border-border-soft bg-background px-3 py-2 font-mono text-xs focus:border-primary focus:outline-none";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border-soft p-5">
        <h3 className="text-sm font-bold">Encode</h3>
        <p className="mt-1 text-xs text-text/60">
          Turn slot numbers into a base62 selection code.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={encDataset}
            onChange={(event) => setEncDataset(event.target.value)}
            placeholder="dataset source, e.g. kao"
            aria-label="Dataset source for encode"
            className={inputClass}
          />
          <input
            value={encSlots}
            onChange={(event) => setEncSlots(event.target.value)}
            placeholder="slots, e.g. 0,1,2"
            aria-label="Slots for encode"
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={runEncode}
          disabled={encLoading}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {encLoading ? "Encoding…" : "Run encode"}
        </button>
        <JsonBlock value={encResult} error={encError} />
      </div>

      <div className="rounded-2xl border border-border-soft p-5">
        <h3 className="text-sm font-bold">Decode</h3>
        <p className="mt-1 text-xs text-text/60">
          Resolve a code against a dataset, including the design profile.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={decDataset}
            onChange={(event) => setDecDataset(event.target.value)}
            placeholder="dataset source, e.g. kao"
            aria-label="Dataset source for decode"
            className={inputClass}
          />
          <input
            value={decCode}
            onChange={(event) => setDecCode(event.target.value)}
            placeholder="code, e.g. 7"
            aria-label="Selection code for decode"
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={runDecode}
          disabled={decLoading}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {decLoading ? "Decoding…" : "Run decode"}
        </button>
        <JsonBlock value={decResult} error={decError} />
      </div>
    </div>
  );
}
