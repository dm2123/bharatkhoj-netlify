import type { AIResponse } from "../api/types";

/**
 * Renders an AI Mode answer. Grounded answers show sources below
 * (Google AI Mode parity: sources UNDER the answer, no web results
 * beside it). ai_general answers carry the honest disclaimer note.
 * no_results shows the honest "index me jaankari nahi mili" message.
 */
export function AIOverview({ data }: { data: AIResponse }) {
  if (data.mode === "no_results") {
    return (
      <div className="py-10 text-center text-gsub">
        <p>
          BharatKhoj ke index me is sawal par abhi jaankari nahi mili. Thoda
          alag shabdon me khoj karke dekho — index roz badh raha hai.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="text-gtext leading-relaxed whitespace-pre-wrap">
        {data.answer}
      </div>
      {data.mode === "ai_general" && data.note && (
        <p className="text-xs text-gsub mt-4 border-t border-gsub/20 pt-3">
          {data.note}
        </p>
      )}
      {data.sources && data.sources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gtext mb-2">Sources</h3>
          <ul className="space-y-2">
            {data.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-glink text-sm hover:underline"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.engine && (
        <p className="text-[11px] text-gsub mt-4">engine: {data.engine}</p>
      )}
    </div>
  );
}
