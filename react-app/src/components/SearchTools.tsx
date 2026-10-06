import { useState } from "react";

interface Props {
  onFilterTime: (range: string) => void;
}

/**
 * Search tools row: "Any time" / "All results" / "Advanced Search"
 * (mirrors filterTime() in the current site).
 */
export function SearchTools({ onFilterTime }: Props) {
  const [time, setTime] = useState("Any time");

  return (
    <div className="flex gap-4 px-4 py-2 text-sm text-gsub border-b border-gsub/20">
      <select
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
          onFilterTime(e.target.value);
        }}
        className="bg-transparent outline-none cursor-pointer"
        aria-label="Time filter"
      >
        {["Any time", "Past hour", "Past 24 hours", "Past week", "Past month"].map(
          (t) => (
            <option key={t} value={t} className="bg-gcard">
              {t}
            </option>
          ),
        )}
      </select>
      <span>All results ▾</span>
      <span>Advanced Search</span>
    </div>
  );
}
