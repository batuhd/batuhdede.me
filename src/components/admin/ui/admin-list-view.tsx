"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminButton } from "./admin-button";
import { AdminSearchInput } from "./admin-search-input";
import { AdminEmptyState } from "./admin-empty-state";

interface AdminListViewProps {
  title: string;
  description?: string;
  addButtonLabel: string;
  isAdding: boolean;
  onAddToggle: () => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
  filterFn?: (query: string) => void;
  className?: string;
}

export function AdminListView({
  title,
  description,
  addButtonLabel,
  isAdding,
  onAddToggle,
  searchPlaceholder = "Ara...",
  children,
  filterFn,
  className,
}: AdminListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    filterFn?.(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <AdminButton
          size="sm"
          leftIcon={
            <Plus
              className={cn(
                "h-4 w-4 transition-transform",
                isAdding && "rotate-45",
              )}
            />
          }
          onClick={onAddToggle}
        >
          {isAdding ? "Cancel" : addButtonLabel}
        </AdminButton>
      </div>

      {filterFn && (
        <AdminSearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          className="max-w-full sm:max-w-sm"
        />
      )}

      <div className="space-y-2">{children}</div>
    </div>
  );
}

interface AdminListContainerProps {
  items: unknown[];
  isAdding?: boolean;
  renderItem: (item: unknown, index: number) => React.ReactNode;
  filterKey?: string;
  searchQuery?: string;
  emptyState: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  };
}

export function AdminListContainer({
  items,
  isAdding = false,
  renderItem,
  filterKey,
  searchQuery,
  emptyState,
}: AdminListContainerProps) {
  const filteredItems = useMemo(() => {
    if (!searchQuery || !filterKey) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const record = item as Record<string, unknown>;
      const value = record[filterKey];
      return typeof value === "string" && value.toLowerCase().includes(query);
    });
  }, [items, filterKey, searchQuery]);

  if (filteredItems.length === 0 && !isAdding) {
    return (
      <AdminEmptyState
        title={emptyState.title}
        description={emptyState.description}
        icon={emptyState.icon}
        action={emptyState.action}
      />
    );
  }

  return (
    <div className="space-y-2">
      {filteredItems.map((item, index) => renderItem(item, index))}
    </div>
  );
}
