import { useState } from "react";
import type { EntityPanel } from "../api/types";

/**
 * Knowledge panel: desktop right rail (360px), mobile stacks above results.
 * Sub-tabs Overview/Stats/Videos/News (kpShowTab), share button (kpShare).
 * images_locked entities never hit random image search — honoured by backend.
 */
export function KnowledgePanel({ entity }: { entity: EntityPanel }) {
  const tabs = Object.keys(entity.tabs ?? {}) as (keyof NonNullable<EntityPanel["tabs"]>)[];
  const [tab, setTab] = useState<(typeof tabs)[number]>("overview");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: entity.name, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <aside className="bg-gbg md:w-[360px] md:ml-6 border border-gsub/20 rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between p-4">
        <h2 className="text-2xl text-gtext">{entity.name}</h2>
        <button
          onClick={share}
          aria-label="Share panel"
          className="text-gsub hover:text-gtext"
        >
          ↗
        </button>
      </div>
      {entity.image && (
        <img
          src={entity.image}
          alt={entity.name}
          className="w-full max-h-72 object-cover"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
      {entity.headline && (
        <p className="px-4 pt-3 text-sm text-gsub">{entity.headline}</p>
      )}
      {tabs.length > 0 && (
        <div className="flex gap-4 px-4 mt-2 border-b border-gsub/20 text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 capitalize border-b-2 -mb-px ${
                tab === t
                  ? "border-glink text-glink"
                  : "border-transparent text-gsub"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <div className="p-4 text-sm text-gtext">
        {tab === "overview" && entity.description && <p>{entity.description}</p>}
        {tab !== "overview" && entity.tabs?.[tab] && <p>{entity.tabs[tab]}</p>}
        {entity.facts && entity.facts.length > 0 && (
          <dl className="mt-3 space-y-2">
            {entity.facts.map((f) => (
              <div key={f.label} className="flex gap-2">
                <dt className="text-gsub shrink-0 w-28">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </aside>
  );
}
