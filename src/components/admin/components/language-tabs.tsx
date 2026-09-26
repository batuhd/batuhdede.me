import { LANG_ORDER, LANG_LABELS, type Lang } from "../lib/languages";
import { Tabs, type TabItem } from "./ui/tabs";

interface LanguageTabsProps {
  value: Lang;
  onChange: (lang: Lang) => void;
  /** Her dil için eksik (boş) çeviri sayısı. */
  missingCounts?: Partial<Record<Lang, number>>;
}

/**
 * Dil sekmeleri — TR ilk sırada (ana dil), sonra EN, DE, ES.
 * Eksik çevirisi olan sekmelerde uyarı rozeti gösterir.
 */
export function LanguageTabs({ value, onChange, missingCounts }: LanguageTabsProps) {
  const items: TabItem<Lang>[] = LANG_ORDER.map((lang) => {
    const count = missingCounts?.[lang] ?? 0;
    return {
      value: lang,
      label: LANG_LABELS[lang],
      badge: count > 0 ? count : undefined,
      warning: lang !== "tr" && count > 0,
    };
  });
  return <Tabs items={items} value={value} onChange={onChange} label="Dil" />;
}