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

export function GitHubContribution() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchCommits() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error();
        const json = await res.json();

        if (json.data?.user?.contributionsCollection?.contributionCalendar) {
          setTotal(
            json.data.user.contributionsCollection.contributionCalendar
              .totalContributions
          );
          setWeeks(
            json.data.user.contributionsCollection.contributionCalendar.weeks
          );
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error("Failed to fetch Github contributions", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, []);

  const getLevel = (count: number) => {
    if (count === 0) return "bg-muted/50";
    if (count <= 3) return "bg-green-900/40 dark:bg-green-900/40";
    if (count <= 6) return "bg-green-700/60 dark:bg-green-700/60";
    if (count <= 9) return "bg-green-500/80 dark:bg-green-500/80";
    return "bg-green-400 dark:bg-green-400";
  };

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
            <div className="flex gap-px">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-px">
                  {week.contributionDays.map((day) => (
                    <motion.div
                      whileHover={{ scale: 1.8, zIndex: 10 }}
                      key={day.date}
                      title={`${day.contributionCount} contributions on ${day.date}`}
                      className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-[2px] transition-colors duration-200 ${getLevel(
                        day.contributionCount
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <span>{t("home.github.less")}</span>
              <div className="flex gap-1">
                {[0, 2, 5, 8, 12].map((count) => (
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
