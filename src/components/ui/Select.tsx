import clsx from "clsx";

export function Select({
  error,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full text-sm border rounded-xl px-3 py-2.5 focus:outline-none transition-colors bg-surface-muted",
        error
          ? "border-red-400 focus:border-red-500"
          : "border-surface-border focus:border-brand-500",
        className,
      )}
    >
      {children}
    </select>
  );
}
