"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { FolderKanban, ExternalLink, Github, Loader2, X, ChevronLeft, ChevronRight, PenTool, Calendar, Briefcase, GraduationCap, MessageSquare, Trophy, Award, Code } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  github?: string;
  image?: string;
  additional_images?: string[];
  tags: string[];
  order_index?: number;
  linked_experience_id?: string;
  linked_education_id?: string;
  linked_skill_category_ids?: string[];
  linked_language_id?: string;
  linked_activity_id?: string;
  linked_certification_id?: string;
}

interface LinkedEntity {
  id: string;
  title: string;
  type: "experience" | "education" | "skill" | "language" | "activity" | "certification";
}

interface RelatedBlog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
}

function WorksContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allBlogs, setAllBlogs] = useState<RelatedBlog[]>([]);
  const [entitiesMap, setEntitiesMap] = useState<Record<string, LinkedEntity>>({});
  const { t, getLocalized } = useLanguage();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("project");

  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0 && !selectedProject) {
      const target = projects.find(p => p.id === projectIdFromUrl);
      if (target) setSelectedProject(target);
    }
  }, [projectIdFromUrl, projects]);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      if (!supabase) return;
      const [projectsRes, imagesRes, blogsRes, expRes, eduRes, skillsRes, langsRes, actsRes, certsRes] = await Promise.all([
        supabase.from("projects").select("*").order("order_index", { ascending: true }),
        supabase.from("project_images").select("*").order("order_index", { ascending: true }),
        supabase.from("blogs").select("id, title, excerpt, date, read_time, linked_project_id").not("linked_project_id", "is", null),
        supabase.from("experiences").select("id, title, company"),
        supabase.from("educations").select("id, university"),
        supabase.from("skill_categories").select("id, title"),
        supabase.from("languages").select("id, name"),
        supabase.from("activities").select("id, organization"),
        supabase.from("certifications").select("id, name"),
      ]);

      if (!isMounted) return;

      const map: Record<string, LinkedEntity> = {};
      if (expRes?.data) {
        expRes.data.forEach(e => map[e.id] = { id: e.id, title: `${e.title} at ${e.company}`, type: "experience" });
      }
      if (eduRes?.data) {
        eduRes.data.forEach(e => map[e.id] = { id: e.id, title: e.university, type: "education" });
      }
      if (skillsRes?.data) {
        skillsRes.data.forEach(s => map[s.id] = { id: s.id, title: s.title, type: "skill" });
      }
      if (langsRes?.data) {
        langsRes.data.forEach(l => map[l.id] = { id: l.id, title: l.name, type: "language" });
      }
      if (actsRes?.data) {
        actsRes.data.forEach(a => map[a.id] = { id: a.id, title: a.organization, type: "activity" });
      }
      if (certsRes?.data) {
        certsRes.data.forEach(c => map[c.id] = { id: c.id, title: c.name, type: "certification" });
      }
      setEntitiesMap(map);
      if (projectsRes.error) {
        console.error("Error fetching projects:", projectsRes.error);
        setProjects([]);
      } else {
        const data = projectsRes.data || [];
        const imagesData = imagesRes.data || [];
        
        setProjects(
          data.map((p: any) => {
            const extraImages = imagesData.filter((img: any) => img.project_id === p.id);
            return {
              ...p,
              tags: Array.isArray(p.tags) ? p.tags : [],
              additional_images: extraImages.map((img: any) => img.image_url)
            };
          })
        );
      }
      if (blogsRes.data) {
        setAllBlogs(blogsRes.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          date: b.date,
          read_time: b.read_time,
          linked_project_id: b.linked_project_id,
        })));
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
                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {tag}
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
                {selectedProject.image && typeof selectedProject.image === "string" && (
                  <div className="mb-6 space-y-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={selectedProject.image.startsWith("http") || selectedProject.image.startsWith("/") ? selectedProject.image : `/${selectedProject.image}`}
                        alt={String(selectedProject.title || "")}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    {/* Additional Images Gallery */}
                    {selectedProject.additional_images && selectedProject.additional_images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar snap-x">
                        <div className="relative aspect-video h-20 sm:h-24 flex-shrink-0 snap-start overflow-hidden rounded-md bg-muted border-2 border-primary">
                          <img
                            src={selectedProject.image.startsWith("http") || selectedProject.image.startsWith("/") ? selectedProject.image : `/${selectedProject.image}`}
                            alt="Main image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {selectedProject.additional_images.map((imgUrl, i) => (
                          <div key={i} className="relative aspect-video h-20 sm:h-24 flex-shrink-0 snap-start overflow-hidden rounded-md bg-muted border border-border hover:border-primary/50 transition-colors">
                            <img
                              src={imgUrl.startsWith("http") || imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`}
                              alt={`Additional image ${i + 1}`}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={(e) => {
                                // Simple swap image logic (requires updating the main image source which we can do by modifying DOM or state. For now just viewable in the row)
                                const mainImg = e.currentTarget.closest('.space-y-3')?.querySelector('.relative.aspect-video.w-full > img') as HTMLImageElement;
                                if (mainImg) mainImg.src = e.currentTarget.src;
                                
                                // Reset borders
                                e.currentTarget.closest('.flex.gap-2')?.querySelectorAll('.border-primary').forEach(el => {
                                  el.classList.remove('border-primary', 'border-2');
                                  el.classList.add('border-border', 'border');
                                });
                                e.currentTarget.parentElement?.classList.remove('border-border', 'border');
                                e.currentTarget.parentElement?.classList.add('border-primary', 'border-2');
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
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

                {/* Show Related Entity Badges under tags */}
                {(() => {
                  const hasEntities = selectedProject.linked_experience_id || selectedProject.linked_education_id ||
                    (selectedProject.linked_skill_category_ids && selectedProject.linked_skill_category_ids.length > 0) || selectedProject.linked_language_id ||
                    selectedProject.linked_activity_id || selectedProject.linked_certification_id;
                  if (!hasEntities) return null;
                  
                  return (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { id: selectedProject.linked_experience_id, icon: Briefcase, section: "/#experience" },
                        { id: selectedProject.linked_education_id, icon: GraduationCap, section: "/#education" },
                        ...(selectedProject.linked_skill_category_ids || []).map((id: string) => ({ id, icon: Code, section: "/#skills" })),
                        { id: selectedProject.linked_language_id, icon: MessageSquare, section: "/#languages" },
                        { id: selectedProject.linked_activity_id, icon: Trophy, section: "/#activities" },
                        { id: selectedProject.linked_certification_id, icon: Award, section: "/#certifications" }
                      ].map(({ id, icon: Icon, section }) => {
                        if (!id) return null;
                        const entity = entitiesMap[id];
                        if (!entity) return null;
                        
                        return (
                          <Link
                            key={id}
                            href={section}
                            onClick={() => setSelectedProject(null)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-secondary/50 px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/70 transition-colors"
                          >
                            <Icon className="h-3.5 w-3.5 opacity-70" />
                            <span className="truncate max-w-[200px]">{entity.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-50 ml-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  );
                })()}

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

                {/* Related Blog Posts */}
                {(() => {
                  const relatedBlogs = allBlogs.filter((b: any) => b.linked_project_id === selectedProject.id);
                  if (relatedBlogs.length === 0) return null;
                  return (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                        <PenTool className="h-4 w-4" />
                        {t("works.relatedBlogs")}
                      </h3>
                      <div className="space-y-2">
                        {relatedBlogs.map((blog) => (
                          <Link
                            key={blog.id}
                            href={`/blog?post=${blog.id}`}
                            onClick={() => setSelectedProject(null)}
                            className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 hover:border-primary/30 group"
                          >
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                                {blog.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground/70">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {blog.date}
                                </span>
                                {blog.read_time && (
                                  <>
                                    <span>·</span>
                                    <span>{blog.read_time}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function WorksPage() {
  return (
    <Suspense fallback={<div className="flex h-64 flex-col items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <WorksContent />
    </Suspense>
  );
}
