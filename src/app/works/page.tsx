"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { FolderKanban, ExternalLink, Github, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useLanguage } from "@/context/language-context";

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  github?: string;
  image?: string;
  tags: string[];
}

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, getLocalized } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    if (!db) {
      setLoading(false);
      return;
    }

    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.val();
        if (data) {
          const loaded = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProjects(loaded.reverse());
        } else {
          setProjects([]);
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.error("Firebase Works error:", error);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12">
      <FadeIn>
        <div className="space-y-2">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
            {t("works.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("works.subtitle")}
          </p>
        </div>
      </FadeIn>

      {loading ? (
        <FadeIn delay={0.1}>
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("works.loading")}</p>
          </div>
        </FadeIn>
      ) : projects.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground/50" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">{t("works.empty")}</p>
              <p className="text-sm text-muted-foreground">
                {t("works.emptyDesc")}
              </p>
            </div>
          </div>
        </FadeIn>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={0.1 + index * 0.05}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="space-y-4">
                  {project.image && typeof project.image === "string" && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={
                          project.image.startsWith("http") ||
                          project.image.startsWith("/")
                            ? project.image
                            : `/${project.image}`
                        }
                        alt={String(project.title || "")}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {getLocalized(project, "title", "Untitled Project")}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {getLocalized(project, "description")}
                    </p>
                  </div>
                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={String(tag)}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                          {String(tag)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("works.liveDemo")}
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t("works.source")}
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
