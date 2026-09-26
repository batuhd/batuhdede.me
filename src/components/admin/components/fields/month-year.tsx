"use client";

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Eski verilerde TR/DE/ES ay adları da saklanmış olabilir → İngilizceye çevir.
export const MONTH_ALIASES: Record<string, string> = {
  Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", May: "May", Jun: "Jun",
  Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Oct", Nov: "Nov", Dec: "Dec",
  Oca: "Jan", Şub: "Feb", Nis: "Apr", Haz: "Jun", Tem: "Jul", Ağu: "Aug",
  Eyl: "Sep", Eki: "Oct", Kas: "Nov", Ara: "Dec",
  Mär: "Mar", Mai: "May", Okt: "Oct", Dez: "Dec",
  Ene: "Jan", Abr: "Apr", Ago: "Aug", Dic: "Dec",
};

export const YEARS = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i);

export interface ParsedMonthYear {
  month: string;
  year: string;
}

/** "Sep 2023", "2023" veya boş string'i ay/yıl bileşenlerine ayırır. */
export function parseMonthYear(value: string): ParsedMonthYear {
  const raw = String(value ?? "").trim();
  if (!raw || /present|devam|heute|actual/i.test(raw)) return { month: "", year: "" };
  const parts = raw.split(" ");
  if (parts.length === 2) {
    const m = MONTH_ALIASES[parts[0]];
    if (m && MONTHS.includes(m) && /^\d{4}$/.test(parts[1])) {
      return { month: m, year: parts[1] };
    }
  } else if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    return { month: "", year: parts[0] };
  }
  return { month: "", year: "" };
}

const selectClass =
  "flex-1 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-violet-500/60 disabled:opacity-50";

interface MonthYearSelectsProps {
  month: string;
  year: string;
  onMonth: (month: string) => void;
  onYear: (year: string) => void;
  disabled?: boolean;
}

export function MonthYearSelects({ month, year, onMonth, onYear, disabled }: MonthYearSelectsProps) {
  return (
    <div className="flex gap-2">
      <select
        aria-label="Ay"
        value={month}
        disabled={disabled}
        onChange={(e) => onMonth(e.target.value)}
        className={selectClass}
      >
        <option value="">Ay</option>
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label="Yıl"
        value={year}
        disabled={disabled}
        onChange={(e) => onYear(e.target.value)}
        className={selectClass}
      >
        <option value="">Yıl</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Ay/Yıl seçimini "Sep 2023" metnine dönüştürür. */
export function composeMonthYear(month: string, year: string): string {
  return month && year ? `${month} ${year}` : year || month || "";
}