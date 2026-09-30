import { cn } from "@/lib/utils";

interface HttpCatProps {
  status: number;
  title?: string;
  className?: string;
}

export function HttpCat({ status, title, className }: HttpCatProps) {
  return (
    <img
      src={`https://http.cat/${status}.jpg`}
      alt={title ? `HTTP ${status} — ${title}` : `HTTP ${status}`}
      width={640}
      height={480}
      loading="eager"
      className={cn(
        "h-auto w-full max-w-md rounded-2xl border border-border shadow-lg",
        className,
      )}
    />
  );
}