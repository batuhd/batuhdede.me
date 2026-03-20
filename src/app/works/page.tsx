"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { FolderKanban, ExternalLink, Github, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  github?: string;
  image?: string;
  tags: string[];
  order_index?: number;
}

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t, getLocalized } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

      if (!isMounted) return;
      if (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } else {
        setProjects(
          (data || []).map((p: any) => ({
            ...p,
            tags: Array.isArray(p.tags) ? p.tags : [],
          }))
        );
      }
      setLoading(false);
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  return (
    <>
      <div className="space-y-8 sm:space-y-12 max-w-2xl mx-auto w-full">
        <FadeIn>
          <div className="space-y-2">
            <h1 className="flex items-center gap-3 text-2xl sm:text-4xl font-bold tracking-tight">
              <FolderKanban className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
              {t("works.title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t("works.subtitle")}
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("works.loading")}
              </p>
            </div>
          </FadeIn>
        ) : projects.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 text-center px-4">
              <FolderKanban className="h-10 w-10 text-muted-foreground/50" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {t("works.empty")}
                </p>
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
                <div
                  onClick={() => setSelectedProject(project)}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 sm:p-6 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50 active:scale-[0.99]"
                >
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
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                        {getLocalized(project, "title", "Untitled Project")}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {getLocalized(project, "description")}
                      </p>
                    </div>
                    {Array.isArray(project.tags) &&
                      project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
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
                      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                        {t("works.liveDemo")}
                      </span>
                    )}
                    {project.github && (
                      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        <Github className="h-4 w-4" />
                        {t("works.source")}
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 px-0 sm:px-6 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-sm font-medium text-muted-foreground truncate pr-4">
                  {getLocalized(selectedProject, "title", "Project")}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-4 sm:p-8">
                {selectedProject.image &&
                  typeof selectedProject.image === "string" && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted mb-6">
                      <img
                        src={
                          selectedProject.image.startsWith("http") ||
                          selectedProject.image.startsWith("/")
                            ? selectedProject.image
                            : `/${selectedProject.image}`
                        }
                        alt={String(selectedProject.title || "")}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}

                <h1 className="mb-4 text-xl sm:text-3xl font-bold tracking-tight">
                  {getLocalized(selectedProject, "title", "Untitled Project")}
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap mb-6">
                  {getLocalized(selectedProject, "description")}
                </p>

                {Array.isArray(selectedProject.tags) &&
                  selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={String(tag)}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                          {String(tag)}
                        </span>
                      ))}
                    </div>
                  )}

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("works.liveDemo")}
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <Github className="h-4 w-4" />
                      {t("works.source")}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
