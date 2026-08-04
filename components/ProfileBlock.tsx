import type { DesignProfile } from "@/lib/profile";

export default function ProfileBlock({ profile }: { profile: DesignProfile }) {
  return (
    <section className="rounded-2xl border border-border-soft bg-primary-soft p-6 sm:p-8">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
        Design profile
      </h2>
      <p className="mt-3 text-lg font-medium leading-relaxed sm:text-xl">
        {profile.summary}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {(
          [
            ["palette", profile.byCategory.palette],
            ["layout", profile.byCategory.layout],
            ["motion", profile.byCategory.motion],
            ["typography", profile.byCategory.typography],
            ["category", profile.byCategory.category],
          ] as const
        ).map(([label, agg]) => (
          <div key={label} className="rounded-xl bg-background/70 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text/40">
              {label}
            </div>
            <div className="mt-2 text-sm font-medium leading-relaxed">
              {agg.top.length > 0 ? agg.top.join(", ") : "—"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
