"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "@/context/language-context";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

const LEVEL_COLORS = [
  { max: 0, className: "bg-muted/50" },
  { max: 3, className: "bg-green-900/40" },
  { max: 6, className: "bg-green-700/60" },
  { max: 9, className: "bg-green-500/80" },
  { max: Infinity, className: "bg-green-400" },
];

const LEGEND_COUNTS = [0, 2, 5, 8, 12];

function getLevel(count: number) {
  return (
    LEVEL_COLORS.find((l) => count <= l.max)?.className ?? "bg-green-400"
  );
}

export function GitHubContribution() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    async function fetchContributions() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error();
        const json = await res.json();
        const calendar =
          json.data?.user?.contributionsCollection?.contributionCalendar;

        if (!calendar) throw new Error();
        if (cancelled) return;

        setTotal(calendar.totalContributions);
        setWeeks(calendar.weeks);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchContributions();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("home.github")}
        </h2>
        {!loading && !error && (
          <span className="text-sm text-muted-foreground">
            {t("home.github.contributions", { count: total })}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col h-32 items-center justify-center text-sm text-muted-foreground gap-2">
            <p>{t("home.github.contributions", { count: 0 })}</p>
            <p className="text-xs opacity-50">{t("home.github.nodata")}</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto -mx-1 px-1 pb-2 github-graph-scroll">
              <div className="flex gap-px w-max">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-px">
                    {week.contributionDays.map((day) => (
                      <motion.div
                        whileHover={{ scale: 1.8, zIndex: 10 }}
                        key={day.date}
                        title={`${day.contributionCount} contributions on ${day.date}`}
                        className={`h-[10px] w-[10px] sm:h-2.5 sm:w-2.5 rounded-[2px] transition-colors duration-200 ${getLevel(day.contributionCount)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>{t("home.github.less")}</span>
              <div className="flex gap-1">
                {LEGEND_COUNTS.map((count) => (
                  <div
                    key={count}
                    className={`h-3 w-3 rounded-sm ${getLevel(count)}`}
                  />
                ))}
              </div>
              <span>{t("home.github.more")}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
