export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-xs font-medium text-rose-400">
      {children}
    </p>
  );
}