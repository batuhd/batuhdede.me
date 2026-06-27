"use client";

import {
  FolderKanban,
  PenTool,
  Award,
  Eye,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AdminCard } from "./ui/admin-card";
import { AdminButton } from "./ui/admin-button";
import { AdminBadge } from "./ui/admin-badge";
import { AdminEmptyState } from "./ui/admin-empty-state";
import { cn } from "@/lib/utils";
import type { AdminTab } from "./admin-layout";

interface WorkItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  title_tr?: string;
  title_de?: string;
  title_es?: string;
}

interface BlogItem {
  id: string;
  title?: string;
  excerpt?: string;
  image_url?: string;
  is_published?: boolean;
}

interface SkillCategoryItem {
  id: string;
  title?: string;
}

interface AdminDashboardProps {
  userEmail?: string | null;
  works: unknown[];
  blogs: unknown[];
  skillCategories: unknown[];
  onTabChange: (tab: AdminTab) => void;
  onAddWork: () => void;
  onAddBlog: () => void;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}

function StatCard({ title, value, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/20">
      <div className="flex items-center justify-between">
        <div className={cn("rounded-lg p-2", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export function AdminDashboard({
  userEmail,
  works,
  blogs,
  skillCategories,
  onTabChange,
  onAddWork,
  onAddBlog,
}: AdminDashboardProps) {
  const typedWorks = works as WorkItem[];
  const typedBlogs = blogs as BlogItem[];
  const typedSkillCategories = skillCategories as SkillCategoryItem[];

  const publishedBlogs = typedBlogs.filter((b) => b.is_published).length;

  const recentWorks = [...typedWorks].reverse().slice(0, 4);
  const recentBlogs = [...typedBlogs].reverse().slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-background p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back{userEmail ? "," : ""}
            </h1>
            <p className="text-lg text-muted-foreground">
              {userEmail || "Ready to manage your portfolio?"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AdminButton
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onAddWork}
            >
              Add Work
            </AdminButton>
            <AdminButton
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onAddBlog}
            >
              New Post
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Works"
          value={typedWorks.length}
          icon={FolderKanban}
          colorClass="bg-primary/10 text-primary"
        />
        <StatCard
          title="Blog Posts"
          value={typedBlogs.length}
          icon={PenTool}
          colorClass="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="Published"
          value={publishedBlogs}
          icon={Eye}
          colorClass="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="Skill Categories"
          value={typedSkillCategories.length}
          icon={Award}
          colorClass="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Quick Links */}
      <AdminCard title="Quick Management" description="Frequently used sections">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { tab: "works" as AdminTab, label: "Works", desc: "Projects & portfolio", icon: FolderKanban },
            { tab: "blog" as AdminTab, label: "Blog", desc: "Posts & articles", icon: PenTool },
            { tab: "about" as AdminTab, label: "About Me", desc: "Profile & bio", icon: Sparkles },
            { tab: "section_layout" as AdminTab, label: "Page Layout", desc: "Sections & order", icon: ArrowRight },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onTabChange(item.tab)}
                className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </AdminCard>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard
          title="Recent Works"
          action={
            <AdminButton
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => onTabChange("works")}
            >
              View All
            </AdminButton>
          }
        >
          {recentWorks.length === 0 ? (
            <AdminEmptyState
              title="No works yet"
              description="Add your first project to showcase it."
              action={
                <AdminButton size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddWork}>
                  Add Work
                </AdminButton>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentWorks.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  {work.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={work.image}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {work.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {work.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {work.title_tr && <AdminBadge>TR</AdminBadge>}
                    {work.title_de && <AdminBadge>DE</AdminBadge>}
                    {work.title_es && <AdminBadge>ES</AdminBadge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard
          title="Recent Blog Posts"
          action={
            <AdminButton
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => onTabChange("blog")}
            >
              View All
            </AdminButton>
          }
        >
          {recentBlogs.length === 0 ? (
            <AdminEmptyState
              title="No posts yet"
              description="Start writing your first blog post."
              action={
                <AdminButton size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddBlog}>
                  New Post
                </AdminButton>
              }
            />
          ) : (
            <div className="space-y-2">
              {recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  {blog.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.image_url}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                      <PenTool className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {blog.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {blog.excerpt}
                    </p>
                  </div>
                  <AdminBadge
                    variant={blog.is_published ? "success" : "warning"}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </AdminBadge>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
