"use client";

import { ChevronUp, ChevronDown, GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminListItemBadge {
  label: string;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

interface AdminListItemProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  fallbackIcon?: React.ReactNode;
  badges?: AdminListItemBadge[];
  index?: number;
  isFirst?: boolean;
  isLast?: boolean;
  isEditing?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminListItem({
  title,
  subtitle,
  image,
  fallbackIcon,
  badges,
  index,
  isFirst = false,
  isLast = false,
  isEditing = false,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  actions,
  className,
}: AdminListItemProps) {
  const hasReorder = onMoveUp || onMoveDown;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 sm:gap-3 rounded-lg border p-2.5 sm:p-3 transition-colors",
        isEditing
          ? "border-primary/50 bg-primary/5"
          : "hover:bg-muted/30",
        className,
      )}
    >
      {/* Reorder Controls */}
      {hasReorder && (
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <GripVertical className="h-4 w-4 text-muted-foreground/30 mx-auto" />
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors"
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Image / Fallback */}
      {(image || fallbackIcon) && (
        <div className="flex-shrink-0">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {fallbackIcon}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
          {typeof index === "number" && (
            <span className="text-[10px] text-muted-foreground font-mono sm:text-xs">
              #{index + 1}
            </span>
          )}
          <h3 className="text-sm font-medium truncate">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {subtitle}
          </p>
        )}
        {badges && badges.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border",
                  badge.variant === "success" && "bg-green-500/10 text-green-600 border-green-500/20",
                  badge.variant === "warning" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                  badge.variant === "destructive" && "bg-destructive/10 text-destructive border-destructive/20",
                  badge.variant === "info" && "bg-primary/10 text-primary border-primary/20",
                  (!badge.variant || badge.variant === "default") && "bg-muted text-muted-foreground",
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {actions}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md p-2.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
