"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  FolderKanban,
  PenTool,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn, sanitizeUrl } from "@/lib/utils";
import {
  AdminErrorProvider,
  useAdminError,
} from "@/context/admin-error-context";
import type { User } from "@supabase/supabase-js";
import {
  AdminAboutTab,
  AdminCrudTab,
  AdminSocialLinksTab,
  AdminContactEmailsTab,
  AdminSkillsTab,
  AdminLayoutTab,
} from "@/components/admin/admin-tabs";
import { AdminEasterEggConfigTab } from "@/components/admin/easter-egg-config-tab";
import { WorkForm } from "@/components/admin/work-form";
import { BlogForm } from "@/components/admin/blog-form";
import { AdminLayout, type AdminTab } from "@/components/admin/admin-layout";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  AdminListView,
  AdminListContainer,
  AdminListItem,
  type AdminListItemBadge,
  AdminConfirmDialog,
  AdminFormStepper,
  type FormStep,
} from "@/components/admin/ui";
import { Toaster, toast } from "sonner";

type Tab = AdminTab | "dashboard";

// Type definitions for better type safety
interface Project {
  id: string;
  title: string;
  description?: string;
  link?: string;
  github?: string;
  image?: string;
  tags?: string[];
  title_tr?: string;
  description_tr?: string;
  title_de?: string;
  description_de?: string;
  title_es?: string;
  description_es?: string;
  order_index?: number;
  linked_experience_id?: string;
  linked_education_id?: string;
  linked_skill_category_ids?: string[];
  linked_language_id?: string;
  linked_activity_id?: string;
  linked_certification_id?: string;
  additional_images?: string;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string;
  order_index?: number;
}

interface Blog {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  date?: string;
  read_time?: string;
  image_url?: string;
  is_published?: boolean;
  title_tr?: string;
  excerpt_tr?: string;
  content_tr?: string;
  title_de?: string;
  excerpt_de?: string;
  content_de?: string;
  title_es?: string;
  excerpt_es?: string;
  content_es?: string;
  order_index?: number;
  linked_project_id?: string;
  linked_experience_id?: string;
  linked_education_id?: string;
  linked_skill_category_ids?: string[];
  linked_language_id?: string;
  linked_activity_id?: string;
  linked_certification_id?: string;
  additional_images?: string;
}

interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  caption?: string;
  order_index?: number;
}

// Field whitelists to prevent mass assignment
const PROJECT_FIELDS = [
  "title",
  "description",
  "link",
  "github",
  "image",
  "tags",
  "order_index",
  "title_tr",
  "description_tr",
  "title_de",
  "description_de",
  "title_es",
  "description_es",
  "linked_experience_id",
  "linked_education_id",
  "linked_skill_category_ids",
  "linked_language_id",
  "linked_activity_id",
  "linked_certification_id",
];
const BLOG_FIELDS = [
  "title",
  "excerpt",
  "content",
  "date",
  "read_time",
  "image_url",
  "is_published",
  "order_index",
  "linked_project_id",
  "linked_experience_id",
  "linked_education_id",
  "linked_skill_category_ids",
  "linked_language_id",
  "linked_activity_id",
  "linked_certification_id",
  "title_tr",
  "excerpt_tr",
  "content_tr",
  "title_de",
  "excerpt_de",
  "content_de",
  "title_es",
  "excerpt_es",
  "content_es",
];

const URL_FIELDS = ["link", "github", "image", "image_url"];

function cleanObj(obj: Record<string, unknown>, allowedFields?: string[]) {
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    // Skip fields not in whitelist (if provided)
    if (allowedFields && !allowedFields.includes(k)) continue;
    if (typeof v === "string" && v.trim() === "") {
      if (
        k.startsWith("linked_") ||
        URL_FIELDS.includes(k)
      ) {
        cleaned[k] = null;
      }
      continue;
    }
    if (typeof v === "string" && URL_FIELDS.includes(k)) {
      cleaned[k] = sanitizeUrl(v.trim());
      continue;
    }
    cleaned[k] = v;
  }
  return cleaned;
}

export default function AdminDashboardPage() {
  return (
    <AdminErrorProvider>
      <AdminDashboardContent />
    </AdminErrorProvider>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const { handleOperationError } = useAdminError();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [workSearch, setWorkSearch] = useState("");
  const [blogSearch, setBlogSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "work" | "blog";
    id: string;
  } | null>(null);

  const [works, setWorks] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  const [isAddingWork, setIsAddingWork] = useState(false);
  const [workForm, setWorkForm] = useState({
    title: "",
    description: "",
    link: "",
    github: "",
    image: "",
    tags: "",
    additional_images: "",
    linked_experience_id: "",
    linked_education_id: "",
    linked_skill_category_ids: [] as string[],
    linked_language_id: "",
    linked_activity_id: "",
    linked_certification_id: "",
    title_tr: "",
    description_tr: "",
    title_de: "",
    description_de: "",
    title_es: "",
    description_es: "",
  });

  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [editWorkForm, setEditWorkForm] = useState({
    title: "",
    description: "",
    link: "",
    github: "",
    image: "",
    tags: "",
    additional_images: "",
    linked_experience_id: "",
    linked_education_id: "",
    linked_skill_category_ids: [] as string[],
    linked_language_id: "",
    linked_activity_id: "",
    linked_certification_id: "",
    title_tr: "",
    description_tr: "",
    title_de: "",
    description_de: "",
    title_es: "",
    description_es: "",
  });

  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogStep, setBlogStep] = useState("basic");
  const [editBlogStep, setEditBlogStep] = useState("basic");
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    read_time: "",
    image_url: "",
    is_published: false,
    additional_images: "",
    linked_project_id: "",
    linked_experience_id: "",
    linked_education_id: "",
    linked_skill_category_ids: [] as string[],
    linked_language_id: "",
    linked_activity_id: "",
    linked_certification_id: "",
    title_tr: "",
    excerpt_tr: "",
    content_tr: "",
    title_de: "",
    excerpt_de: "",
    content_de: "",
    title_es: "",
    excerpt_es: "",
    content_es: "",
  });

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editBlogForm, setEditBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    read_time: "",
    image_url: "",
    is_published: false,
    additional_images: "",
    linked_project_id: "",
    linked_experience_id: "",
    linked_education_id: "",
    linked_skill_category_ids: [] as string[],
    linked_language_id: "",
    linked_activity_id: "",
    linked_certification_id: "",
    title_tr: "",
    excerpt_tr: "",
    content_tr: "",
    title_de: "",
    excerpt_de: "",
    content_de: "",
    title_es: "",
    excerpt_es: "",
    content_es: "",
  });

  useEffect(() => {
    if (!supabase) {
      router.push("/admin/login");
      return;
    }
    const sb = supabase;
    const checkAuth = async () => {
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push("/admin/login");
      else setUser(session.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Fetch works and blogs
  useEffect(() => {
    if (!supabase) return;
    const sb = supabase;
    const fetchData = async () => {
      const [
        worksRes,
        projectImagesRes,
        blogsRes,
        blogImagesRes,
        expRes,
        eduRes,
        skillsRes,
        langRes,
        actRes,
        certRes,
      ] = await Promise.all([
        sb
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true }),
        sb
          .from("project_images")
          .select("*")
          .order("order_index", { ascending: true }),
        sb.from("blogs").select("*").order("order_index", { ascending: true }),
        sb
          .from("blog_images")
          .select("*")
          .order("order_index", { ascending: true }),
        sb.from("experiences").select("id, title, company"),
        sb.from("educations").select("id, university, degree"),
        sb.from("skill_categories").select("id, title"),
        sb.from("languages").select("id, name"),
        sb.from("activities").select("id, organization"),
        sb.from("certifications").select("id, name"),
      ]);

      if (worksRes.data) {
        let projectsData = worksRes.data;
        if (projectImagesRes.data) {
          projectsData = projectsData.map((project: Project) => {
            const extraImages =
              projectImagesRes.data?.filter(
                (img: ProjectImage) => img.project_id === project.id,
              ) || [];
            return {
              ...project,
              additional_images: extraImages
                .map((img: ProjectImage) => img.image_url)
                .join(", "),
            };
          });
        }
        setWorks(projectsData);
      }
      if (blogsRes.data) {
        let blogsData = blogsRes.data;
        if (blogImagesRes.data) {
          blogsData = blogsData.map((blog: Blog) => {
            const extraImages =
              blogImagesRes.data?.filter(
                (img: BlogImage) => img.blog_id === blog.id,
              ) || [];
            return {
              ...blog,
              additional_images: extraImages
                .map((img: BlogImage) => img.image_url)
                .join(", "),
            };
          });
        }
        setBlogs(blogsData);
      }
      if (expRes.data) setExperiences(expRes.data);
      if (eduRes.data) setEducations(eduRes.data);
      if (skillsRes.data) setSkillCategories(skillsRes.data);
      if (langRes.data) setLanguages(langRes.data);
      if (actRes.data) setActivities(actRes.data);
      if (certRes.data) setCertifications(certRes.data);
    };
    fetchData();
  }, []);

  const refreshWorks = async () => {
    if (!supabase) return;
    const [worksRes, projectImagesRes] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("project_images")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    if (worksRes.data) {
      let projectsData = worksRes.data;
      if (projectImagesRes.data) {
        projectsData = projectsData.map((project: Project) => {
          const extraImages =
            projectImagesRes.data?.filter(
              (img: ProjectImage) => img.project_id === project.id,
            ) || [];
          return {
            ...project,
            additional_images: extraImages
              .map((img: ProjectImage) => img.image_url)
              .join(", "),
          };
        });
      }
      setWorks(projectsData);
    }
  };

  const refreshBlogs = async () => {
    if (!supabase) return;
    const [blogsRes, blogImagesRes] = await Promise.all([
      supabase
        .from("blogs")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("blog_images")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    if (blogsRes.data) {
      let blogsData = blogsRes.data;
      if (blogImagesRes.data) {
        blogsData = blogsData.map((blog: Blog) => {
          const extraImages =
            blogImagesRes.data?.filter(
              (img: BlogImage) => img.blog_id === blog.id,
            ) || [];
          return {
            ...blog,
            additional_images: extraImages
              .map((img: BlogImage) => img.image_url)
              .join(", "),
          };
        });
      }
      setBlogs(blogsData);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await supabase?.auth.signOut();
    } catch {
      // Ignore errors and redirect to login regardless
    }
    router.push("/admin/login");
  };

  // ── Works CRUD ──
  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { link, github, image, tags, additional_images, ...rest } = workForm;
    const maxOrder = works.reduce(
      (max, w) => Math.max(max, w.order_index ?? 0),
      -1,
    );
    const data = cleanObj(
      {
        ...rest,
        link,
        github,
        image,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        order_index: maxOrder + 1,
      },
      PROJECT_FIELDS,
    );

    const { data: insertedData, error } = await supabase
      .from("projects")
      .insert(data)
      .select();
    if (handleOperationError(error, "Proje Ekleme")) return;

    if (insertedData && insertedData[0] && additional_images) {
      const newProjectId = insertedData[0].id;
      const imageUrls = additional_images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

      if (imageUrls.length > 0) {
        const inserts = imageUrls.map((url, i) => ({
          project_id: newProjectId,
          image_url: url,
          order_index: i,
        }));
        const { error: imgError } = await supabase
          .from("project_images")
          .insert(inserts);
        if (handleOperationError(imgError, "Proje Görselleri Ekleme")) return;
      }
    }

    setWorkForm({
      title: "",
      description: "",
      link: "",
      github: "",
      image: "",
      tags: "",
      additional_images: "",
      linked_experience_id: "",
      linked_education_id: "",
      linked_skill_category_ids: [],
      linked_language_id: "",
      linked_activity_id: "",
      linked_certification_id: "",
      title_tr: "",
      description_tr: "",
      title_de: "",
      description_de: "",
      title_es: "",
      description_es: "",
    });
    setIsAddingWork(false);
    await refreshWorks();
    toast.success("Proje başarıyla eklendi");
  };

  const handleEditWork = (work: Project) => {
    setEditingWorkId(work.id);
    setEditWorkForm({
      title: work.title || "",
      description: work.description || "",
      link: work.link || "",
      github: work.github || "",
      image: work.image || "",
      tags: Array.isArray(work.tags) ? work.tags.join(", ") : work.tags || "",
      additional_images: work.additional_images || "",
      linked_experience_id: work.linked_experience_id || "",
      linked_education_id: work.linked_education_id || "",
      linked_skill_category_ids: work.linked_skill_category_ids || [],
      linked_language_id: work.linked_language_id || "",
      linked_activity_id: work.linked_activity_id || "",
      linked_certification_id: work.linked_certification_id || "",
      title_tr: work.title_tr || "",
      description_tr: work.description_tr || "",
      title_de: work.title_de || "",
      description_de: work.description_de || "",
      title_es: work.title_es || "",
      description_es: work.description_es || "",
    });
    setIsAddingWork(false);
  };

  const handleSaveEditWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingWorkId) return;
    const { link, github, image, tags, additional_images, ...rest } =
      editWorkForm;
    const data = cleanObj(
      {
        ...rest,
        link,
        github,
        image,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      PROJECT_FIELDS,
    );
    const { error: updateError, data: updateData } = await supabase
      .from("projects")
      .update(data)
      .eq("id", editingWorkId)
      .select();
    if (
      handleOperationError(
        updateError ||
          (!updateData || updateData.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Proje Güncelleme",
      )
    )
      return;

    // Manage additional images
    const { error: delImgError } = await supabase
      .from("project_images")
      .delete()
      .eq("project_id", editingWorkId);
    if (handleOperationError(delImgError, "Proje Görselleri Silme")) return;
    if (additional_images) {
      const imageUrls = additional_images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      if (imageUrls.length > 0) {
        const inserts = imageUrls.map((url, i) => ({
          project_id: editingWorkId,
          image_url: url,
          order_index: i,
        }));
        const { error: insImgError } = await supabase
          .from("project_images")
          .insert(inserts);
        if (handleOperationError(insImgError, "Proje Görselleri Ekleme"))
          return;
      }
    }

    setEditingWorkId(null);
    await refreshWorks();
    toast.success("Proje başarıyla güncellendi");
  };

  const handleDeleteWork = async (id: string) => {
    if (!supabase) return;
    const { error, data } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Proje Silme",
      )
    )
      return;
    if (editingWorkId === id) setEditingWorkId(null);
    await refreshWorks();
    toast.success("Proje başarıyla silindi");
  };

  const handleMoveWork = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = works.findIndex((w) => w.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= works.length) return;

    const newWorks = [...works];
    const temp = newWorks[idx];
    newWorks[idx] = newWorks[swapIdx];
    newWorks[swapIdx] = temp;
    setWorks(newWorks);

    await Promise.all(
      newWorks.map((w, i) =>
        supabase!.from("projects").update({ order_index: i }).eq("id", w.id),
      ),
    );
    await refreshWorks();
  };

  // ── Blog CRUD ──
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const date =
      blogForm.date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    const maxOrder = blogs.reduce(
      (max, b) => Math.max(max, b.order_index ?? 0),
      -1,
    );
    const { additional_images, ...restForm } = blogForm;
    const data = cleanObj(
      { ...restForm, date, order_index: maxOrder + 1 },
      BLOG_FIELDS,
    );
    const { data: insertedData, error } = await supabase
      .from("blogs")
      .insert(data)
      .select();
    if (handleOperationError(error, "Blog Yazısı Ekleme")) return;

    // Insert additional images
    if (insertedData && insertedData[0] && additional_images) {
      const newBlogId = insertedData[0].id;
      const imageUrls = additional_images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

      if (imageUrls.length > 0) {
        const inserts = imageUrls.map((url, i) => ({
          blog_id: newBlogId,
          image_url: url,
          order_index: i,
        }));
        const { error: imgError } = await supabase
          .from("blog_images")
          .insert(inserts);
        if (imgError) {
          console.error("Blog görselleri eklenirken hata:", imgError);
          toast.error(
            "Blog yazısı eklendi ancak görseller eklenemedi. Hata: " +
              imgError.message,
          );
        }
      }
    }

    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      date: "",
      read_time: "",
      image_url: "",
      is_published: false,
      additional_images: "",
      linked_project_id: "",
      linked_experience_id: "",
      linked_education_id: "",
      linked_skill_category_ids: [],
      linked_language_id: "",
      linked_activity_id: "",
      linked_certification_id: "",
      title_tr: "",
      excerpt_tr: "",
      content_tr: "",
      title_de: "",
      excerpt_de: "",
      content_de: "",
      title_es: "",
      excerpt_es: "",
      content_es: "",
    });
    setIsAddingBlog(false);
    await refreshBlogs();
    toast.success("Blog yazısı başarıyla eklendi");
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlogId(blog.id);
    setEditBlogForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      date: blog.date || "",
      read_time: blog.read_time || "",
      image_url: blog.image_url || "",
      is_published: blog.is_published ?? false,
      additional_images: blog.additional_images || "",
      linked_project_id: blog.linked_project_id || "",
      linked_experience_id: blog.linked_experience_id || "",
      linked_education_id: blog.linked_education_id || "",
      linked_skill_category_ids: blog.linked_skill_category_ids || [],
      linked_language_id: blog.linked_language_id || "",
      linked_activity_id: blog.linked_activity_id || "",
      linked_certification_id: blog.linked_certification_id || "",
      title_tr: blog.title_tr || "",
      excerpt_tr: blog.excerpt_tr || "",
      content_tr: blog.content_tr || "",
      title_de: blog.title_de || "",
      excerpt_de: blog.excerpt_de || "",
      content_de: blog.content_de || "",
      title_es: blog.title_es || "",
      excerpt_es: blog.excerpt_es || "",
      content_es: blog.content_es || "",
    });
    setIsAddingBlog(false);
  };

  const handleSaveEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editingBlogId) return;
    const { additional_images, ...restForm } = editBlogForm;
    const data = cleanObj(restForm, BLOG_FIELDS);
    const { error, data: updateData } = await supabase
      .from("blogs")
      .update(data)
      .eq("id", editingBlogId)
      .select();
    if (
      handleOperationError(
        error ||
          (!updateData || updateData.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Blog Yazısı Güncelleme",
      )
    )
      return;

    // Manage additional images
    const { error: delImgError } = await supabase
      .from("blog_images")
      .delete()
      .eq("blog_id", editingBlogId);
    if (delImgError) {
      console.error("Blog görselleri silinirken hata:", delImgError);
    }

    if (additional_images) {
      const imageUrls = additional_images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      if (imageUrls.length > 0) {
        const inserts = imageUrls.map((url, i) => ({
          blog_id: editingBlogId,
          image_url: url,
          order_index: i,
        }));
        const { error: insImgError } = await supabase
          .from("blog_images")
          .insert(inserts);
        if (insImgError) {
          console.error("Blog görselleri eklenirken hata:", insImgError);
          toast.error(
            "Blog yazısı güncellendi ancak görseller eklenemedi. Hata: " +
              insImgError.message,
          );
        }
      }
    }

    setEditingBlogId(null);
    await refreshBlogs();
    toast.success("Blog yazısı başarıyla güncellendi");
  };

  const handleDeleteBlog = async (id: string) => {
    if (!supabase) return;
    const { error, data } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id)
      .select();
    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Blog Yazısı Silme",
      )
    )
      return;
    if (editingBlogId === id) setEditingBlogId(null);
    await refreshBlogs();
    toast.success("Blog yazısı başarıyla silindi");
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    if (type === "work") {
      await handleDeleteWork(id);
    } else {
      await handleDeleteBlog(id);
    }
    setDeleteConfirm(null);
  };

  const handleMoveBlog = async (id: string, direction: "up" | "down") => {
    if (!supabase) return;
    const idx = blogs.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= blogs.length) return;

    // Optimistic UI: swap items in array
    const newBlogs = [...blogs];
    const temp = newBlogs[idx];
    newBlogs[idx] = newBlogs[swapIdx];
    newBlogs[swapIdx] = temp;
    setBlogs(newBlogs);

    // Bulk re-index to fix any duplicate order_index values
    await Promise.all(
      newBlogs.map((b, i) =>
        supabase!.from("blogs").update({ order_index: i }).eq("id", b.id),
      ),
    );
    await refreshBlogs();
  };

  // Toggle blog publish status
  const handleToggleBlogPublish = async (blog: Blog) => {
    if (!supabase) return;

    const newStatus = !blog.is_published;
    const { error } = await supabase
      .from("blogs")
      .update({ is_published: newStatus })
      .eq("id", blog.id);

    if (error) {
      console.error("Error toggling blog publish status:", error);
      toast.error("Durum değiştirilirken hata oluştu");
      return;
    }

    // Optimistic update
    setBlogs(
      blogs.map((b) =>
        b.id === blog.id ? { ...b, is_published: newStatus } : b,
      ),
    );

    toast.success(
      newStatus ? "Blog yayınlandı" : "Blog taslak olarak kaydedildi",
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying session...</p>
      </div>
    );
  }

  return (
    <AdminLayout
      userEmail={user?.email}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as Tab)}
      onSignOut={handleSignOut}
    >
      {activeTab === "dashboard" && (
        <AdminDashboard
          userEmail={user?.email}
          works={works}
          blogs={blogs}
          skillCategories={skillCategories}
          onTabChange={(tab) => setActiveTab(tab as Tab)}
          onAddWork={() => {
            setActiveTab("works");
            setIsAddingWork(true);
            setEditingWorkId(null);
          }}
          onAddBlog={() => {
            setActiveTab("blog");
            setIsAddingBlog(true);
            setEditingBlogId(null);
          }}
        />
      )}

      {activeTab !== "dashboard" && (
        <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm min-h-[400px]">
          {/* ───── WORKS TAB ───── */}
              {activeTab === "works" && (
                <div className="space-y-6">
                  {/* Add Work Form */}
                  {isAddingWork && (
                    <WorkForm
                      mode="add"
                      form={workForm}
                      onChange={(updates) =>
                        setWorkForm({ ...workForm, ...updates })
                      }
                      onSubmit={handleAddWork}
                      onCancel={() => {
                        setIsAddingWork(false);
                      }}
                      experiences={experiences}
                      educations={educations}
                      skillCategories={skillCategories}
                      languages={languages}
                      activities={activities}
                      certifications={certifications}
                    />
                  )}

                  {/* Edit Work Form */}
                  {editingWorkId && (
                    <WorkForm
                      mode="edit"
                      form={editWorkForm}
                      onChange={(updates) =>
                        setEditWorkForm({ ...editWorkForm, ...updates })
                      }
                      onSubmit={handleSaveEditWork}
                      onCancel={() => {
                        setEditingWorkId(null);
                      }}
                      experiences={experiences}
                      educations={educations}
                      skillCategories={skillCategories}
                      languages={languages}
                      activities={activities}
                      certifications={certifications}
                    />
                  )}

                  {/* Work Items */}
                  <AdminListView
                    title="Works Overview"
                    description="Manage your portfolio projects"
                    addButtonLabel="Add Project"
                    isAdding={isAddingWork}
                    onAddToggle={() => {
                      setIsAddingWork(!isAddingWork);
                      setEditingWorkId(null);
                    }}
                    searchPlaceholder="Search projects..."
                    filterFn={setWorkSearch}
                  >
                    <AdminListContainer
                      items={works}
                      filterKey="title"
                      searchQuery={workSearch}
                      emptyState={{
                        title: "No projects found",
                        description: "Add your first project to showcase it.",
                        icon: <FolderKanban className="h-8 w-8 opacity-50" />,
                      }}
                      renderItem={(work: any, idx: number) => (
                        <AdminListItem
                          key={work.id}
                          index={idx}
                          title={work.title}
                          subtitle={work.description}
                          image={work.image}
                          fallbackIcon={<FolderKanban className="h-4 w-4" />}
                          isFirst={idx === 0}
                          isLast={idx === works.length - 1}
                          isEditing={editingWorkId === work.id}
                          onMoveUp={() => handleMoveWork(work.id, "up")}
                          onMoveDown={() => handleMoveWork(work.id, "down")}
                          onEdit={() => handleEditWork(work)}
                          onDelete={() =>
                            setDeleteConfirm({ type: "work", id: work.id })
                          }
                          badges={[
                            work.title_tr && { label: "TR" },
                            work.title_de && { label: "DE" },
                            work.title_es && { label: "ES" },
                          ].filter(Boolean)}
                        />
                      )}
                    />
                  </AdminListView>
                </div>
              )}

              {/* ───── BLOG TAB ───── */}
              {activeTab === "blog" && (
                <div className="space-y-6">
                  {/* Add Blog Form */}
                  {isAddingBlog && (
                    <BlogForm
                      mode="add"
                      form={blogForm}
                      onChange={(updates) =>
                        setBlogForm({ ...blogForm, ...updates })
                      }
                      onSubmit={handleAddBlog}
                      onCancel={() => {
                        setIsAddingBlog(false);
                      }}
                      works={works}
                      experiences={experiences}
                      educations={educations}
                      skillCategories={skillCategories}
                      languages={languages}
                      activities={activities}
                      certifications={certifications}
                    />
                  )}

                  {/* Edit Blog Form */}
                  {editingBlogId && (
                    <BlogForm
                      mode="edit"
                      form={editBlogForm}
                      onChange={(updates) =>
                        setEditBlogForm({ ...editBlogForm, ...updates })
                      }
                      onSubmit={handleSaveEditBlog}
                      onCancel={() => {
                        setEditingBlogId(null);
                      }}
                      works={works}
                      experiences={experiences}
                      educations={educations}
                      skillCategories={skillCategories}
                      languages={languages}
                      activities={activities}
                      certifications={certifications}
                    />
                  )}

                  {/* Blog Items */}
                  <AdminListView
                    title="Blog Posts"
                    description="Manage your blog posts"
                    addButtonLabel="New Post"
                    isAdding={isAddingBlog}
                    onAddToggle={() => {
                      setIsAddingBlog(!isAddingBlog);
                      setEditingBlogId(null);
                    }}
                    searchPlaceholder="Search posts..."
                    filterFn={setBlogSearch}
                  >
                    <AdminListContainer
                      items={blogs}
                      filterKey="title"
                      searchQuery={blogSearch}
                      emptyState={{
                        title: "No blog posts found",
                        description: "Start writing your first blog post.",
                        icon: <PenTool className="h-8 w-8 opacity-50" />,
                      }}
                      renderItem={(blog: any, idx: number) => (
                        <AdminListItem
                          key={blog.id}
                          index={idx}
                          title={blog.title}
                          subtitle={`${blog.date || "—"} · ${blog.read_time || "—"}`}
                          image={blog.image_url}
                          fallbackIcon={<PenTool className="h-4 w-4" />}
                          isFirst={idx === 0}
                          isLast={idx === blogs.length - 1}
                          isEditing={editingBlogId === blog.id}
                          onMoveUp={() => handleMoveBlog(blog.id, "up")}
                          onMoveDown={() => handleMoveBlog(blog.id, "down")}
                          onEdit={() => handleEditBlog(blog)}
                          onDelete={() =>
                            setDeleteConfirm({ type: "blog", id: blog.id })
                          }
                          badges={[
                            blog.is_published
                              ? { label: "Published", variant: "success" }
                              : { label: "Draft", variant: "warning" },
                            blog.title_tr && { label: "TR" },
                            blog.title_de && { label: "DE" },
                            blog.title_es && { label: "ES" },
                          ].filter((b): b is AdminListItemBadge => !!b)}
                          actions={
                            <button
                              onClick={() => handleToggleBlogPublish(blog)}
                              className={cn(
                                "rounded-md p-2 transition-colors",
                                blog.is_published
                                  ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                              title={
                                blog.is_published
                                  ? "Yayında - Gizle"
                                  : "Taslak - Yayınla"
                              }
                            >
                              {blog.is_published ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </button>
                          }
                        />
                      )}
                    />
                  </AdminListView>
                </div>
              )}

              {/* ───── ABOUT ME TAB ───── */}
              {activeTab === "about" && <AdminAboutTab />}

              {/* ───── SKILLS TAB ───── */}
              {activeTab === "skills" && <AdminSkillsTab />}

              {/* ───── EXPERIENCE TAB ───── */}
              {activeTab === "experience" && (
                <AdminCrudTab
                  title="Experience"
                  tableName="experiences"
                  displayField="title"
                  subtitleField="company"
                  fields={[
                    {
                      key: "title",
                      label: "Job Title",
                      required: true,
                      placeholder: "Software Engineer",
                      translatable: true,
                    },
                    {
                      key: "company",
                      label: "Company",
                      required: true,
                      placeholder: "Google",
                    },
                    {
                      key: "location",
                      label: "Location",
                      placeholder: "Istanbul, Turkey",
                    },
                    {
                      key: "start_date",
                      label: "Start Date",
                      type: "month_year",
                      placeholder: "Sep 2023",
                    },
                    {
                      key: "end_date",
                      label: "End Date",
                      type: "month_year",
                      placeholder: "Present",
                    },
                    {
                      key: "is_current",
                      label: "Current Job",
                      type: "checkbox",
                      placeholder: "Currently working here",
                    },
                    {
                      key: "logo_url",
                      label: "Logo URL",
                      placeholder: "https://...",
                    },
                    {
                      key: "description",
                      label: "Description",
                      type: "textarea",
                      placeholder: "What you did...",
                      translatable: true,
                    },
                    {
                      key: "roles",
                      label: "Positions",
                      type: "role_list",
                      placeholder: "Add positions within this company",
                    },
                  ]}
                />
              )}

              {/* ───── EDUCATION TAB ───── */}
              {activeTab === "education" && (
                <AdminCrudTab
                  title="Education"
                  tableName="educations"
                  displayField="university"
                  subtitleField="degree"
                  fields={[
                    {
                      key: "university",
                      label: "University",
                      required: true,
                      placeholder: "MIT",
                      translatable: true,
                    },
                    {
                      key: "degree",
                      label: "Degree",
                      placeholder: "Bachelor of Science",
                      translatable: true,
                    },
                    {
                      key: "major",
                      label: "Major",
                      placeholder: "Computer Science",
                      translatable: true,
                    },
                    {
                      key: "location",
                      label: "Location",
                      placeholder: "Cambridge, MA",
                      translatable: true,
                    },
                    {
                      key: "start_date",
                      label: "Start Date",
                      type: "month_year",
                      placeholder: "2020",
                    },
                    {
                      key: "end_date",
                      label: "End Date",
                      type: "month_year",
                      placeholder: "2024",
                    },
                    {
                      key: "is_current",
                      label: "Currently Studying",
                      type: "checkbox",
                      placeholder: "Currently studying here",
                    },
                    {
                      key: "gpa",
                      label: "GPA / GANO",
                      placeholder: "3.50 / 4.00",
                    },
                    {
                      key: "logo_url",
                      label: "Logo URL",
                      placeholder: "https://...",
                    },
                  ]}
                />
              )}
              {/* ───── LAYOUT CFG TAB ───── */}
              {activeTab === "section_layout" && <AdminLayoutTab />}

              {/* ───── LANGUAGES TAB ───── */}
              {activeTab === "languages" && (
                <AdminCrudTab
                  title="Languages"
                  tableName="languages"
                  displayField="name"
                  subtitleField="level"
                  fields={[
                    {
                      key: "name",
                      label: "Language",
                      required: true,
                      placeholder: "English",
                      translatable: true,
                    },
                    {
                      key: "level",
                      label: "Level",
                      type: "select",
                      placeholder: "Select Proficiency",
                      options: [
                        { label: "Native", value: "Native" },
                        { label: "A1 - Beginner", value: "A1" },
                        { label: "A2 - Elementary", value: "A2" },
                        { label: "B1 - Intermediate", value: "B1" },
                        { label: "B2 - Upper Intermediate", value: "B2" },
                        { label: "C1 - Advanced", value: "C1" },
                        { label: "C2 - Proficient", value: "C2" },
                      ],
                    },
                  ]}
                />
              )}

              {/* ───── ACTIVITIES TAB ───── */}
              {activeTab === "activities" && (
                <AdminCrudTab
                  title="Leadership & Activities"
                  tableName="activities"
                  displayField="organization"
                  subtitleField="role"
                  fields={[
                    {
                      key: "organization",
                      label: "Organization",
                      required: true,
                      placeholder: "Google Developer Student Club",
                      translatable: true,
                    },
                    {
                      key: "role",
                      label: "Role",
                      required: true,
                      placeholder: "Lead",
                      translatable: true,
                    },
                    {
                      key: "start_date",
                      label: "Start Date",
                      type: "month_year",
                      placeholder: "2023",
                    },
                    {
                      key: "end_date",
                      label: "End Date",
                      type: "month_year",
                      placeholder: "Present",
                    },
                    {
                      key: "is_current",
                      label: "Ongoing",
                      type: "checkbox",
                      placeholder: "Currently active",
                    },
                    {
                      key: "logo_url",
                      label: "Logo URL",
                      placeholder: "https://...",
                    },
                    {
                      key: "link_url",
                      label: "Link",
                      placeholder: "https://...",
                    },
                    {
                      key: "description",
                      label: "Description",
                      type: "textarea",
                      placeholder: "What you did...",
                      translatable: true,
                    },
                    {
                      key: "roles",
                      label: "Positions",
                      type: "role_list",
                      placeholder: "Add positions within this organization",
                    },
                  ]}
                />
              )}

              {/* ───── CERTIFICATIONS TAB ───── */}
              {activeTab === "certifications" && (
                <AdminCrudTab
                  title="Certifications"
                  tableName="certifications"
                  displayField="name"
                  subtitleField="issuer"
                  fields={[
                    {
                      key: "name",
                      label: "Certificate Name",
                      required: true,
                      placeholder: "AWS Solutions Architect",
                      translatable: true,
                    },
                    {
                      key: "issuer",
                      label: "Issuer",
                      required: true,
                      placeholder: "Amazon Web Services",
                    },
                    {
                      key: "issue_date",
                      label: "Issue Date",
                      placeholder: "Jan 2024",
                    },
                    {
                      key: "icon_url",
                      label: "Icon URL",
                      placeholder: "https://...",
                    },
                    {
                      key: "link_url",
                      label: "Certificate Link",
                      placeholder: "https://...",
                    },
                    {
                      key: "skills",
                      label: "Related Skill Categories",
                      type: "multi_select",
                      options: skillCategories.map((s) => ({
                        label: s.title,
                        value: s.id,
                      })),
                      junctionTable: "certification_skills",
                      junctionForeignKey: "certification_id",
                      junctionOtherKey: "skill_category_id",
                    },
                  ]}
                />
              )}

              {/* ───── SOCIAL LINKS TAB ───── */}
              {activeTab === "social" && <AdminSocialLinksTab />}

              {/* ───── CONTACT EMAILS TAB ───── */}
              {activeTab === "contact_emails" && <AdminContactEmailsTab />}

              {/* Easter Eggs Tab */}
              {activeTab === "easter_eggs" && (
                <div className="space-y-8">
                  <AdminCrudTab
                    title="Easter Eggs"
                    tableName="easter_eggs"
                    displayField="caption"
                    subtitleField="image_url"
                    fields={[
                      {
                        key: "image_url",
                        label: "Image URL",
                        required: true,
                        placeholder: "https://i.ibb.co/...",
                      },
                      {
                        key: "caption",
                        label: "Caption",
                        placeholder: "Romantic caption for the photo...",
                      },
                      {
                        key: "is_active",
                        label: "Active",
                        type: "checkbox",
                        placeholder: "Show in gallery",
                      },
                    ]}
                  />
                  <AdminEasterEggConfigTab />
                </div>
              )}

              {/* ───── SETTINGS TAB ───── */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-4">
                    Profile Settings
                  </h2>
                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        Admin Email
                      </label>
                      <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                        {user?.email || "Unknown"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        User ID
                      </label>
                      <div className="rounded-lg bg-muted px-3 py-2 text-xs font-mono break-all">
                        {user?.id || "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteConfirm?.type === "work"
            ? "Delete Project?"
            : "Delete Blog Post?"
        }
        description={
          deleteConfirm?.type === "work"
            ? "This project will be permanently removed. This action cannot be undone."
            : "This blog post will be permanently removed. This action cannot be undone."
        }
        confirmText="Delete"
        confirmVariant="destructive"
      />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            border: "1px solid #333333",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow:
              "0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
    </AdminLayout>
  );
}
