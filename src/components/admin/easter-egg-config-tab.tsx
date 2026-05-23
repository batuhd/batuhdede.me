"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useAdminError } from "@/context/admin-error-context";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

interface ConfigData {
  id: string;
  secret_code: string;
  display_title: string;
  display_subtitle: string;
  footer_text: string;
}

export function AdminEasterEggConfigTab() {
  const { handleOperationError } = useAdminError();
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("easter_egg_config")
      .select("*")
      .limit(1)
      .single();
    if (data) setConfig(data as ConfigData);
    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !config) return;
    setSaving(true);

    const { error, data } = await supabase
      .from("easter_egg_config")
      .update({
        secret_code: config.secret_code,
        display_title: config.display_title,
        display_subtitle: config.display_subtitle,
        footer_text: config.footer_text,
      })
      .eq("id", config.id)
      .select();

    if (
      handleOperationError(
        error ||
          (!data || data.length === 0
            ? { code: "42501", message: "Yetkisiz işlem" }
            : null),
        "Easter Egg Config Güncelleme",
      )
    ) {
      setSaving(false);
      return;
    }

    toast.success("Gizli şifre ve mesajlar güncellendi");
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!config)
    return (
      <div className="text-center py-12 text-muted-foreground">
        Config bulunamadı. Lütfen Supabase'de easter_egg_config tablosunu
        kontrol edin.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Easter Egg Ayarları
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gizli şifre, başlık ve mesajları buradan yönetin. Şifre kodda hiçbir
            yerde görünmez.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            Gizli Şifre
            <span className="text-[10px] text-rose-500 font-semibold">
              (Güvenlik için gizli tutun)
            </span>
          </label>
          <input
            type="password"
            value={config.secret_code}
            onChange={(e) =>
              setConfig({ ...config, secret_code: e.target.value })
            }
            className={inputClass}
            placeholder="fatma03"
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Kullanıcı bu şifreyi klavyede yazınca easter egg açılır. Kodda
            hiçbir yerde görünmez.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Başlık (Modal)
          </label>
          <input
            value={config.display_title}
            onChange={(e) =>
              setConfig({ ...config, display_title: e.target.value })
            }
            className={inputClass}
            placeholder="Fatma💙"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Alt Başlık
          </label>
          <input
            value={config.display_subtitle}
            onChange={(e) =>
              setConfig({ ...config, display_subtitle: e.target.value })
            }
            className={inputClass}
            placeholder="💙"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Footer Mesajı
          </label>
          <input
            value={config.footer_text}
            onChange={(e) =>
              setConfig({ ...config, footer_text: e.target.value })
            }
            className={inputClass}
            placeholder="💙"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              "flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
              saving && "opacity-70 cursor-not-allowed",
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
