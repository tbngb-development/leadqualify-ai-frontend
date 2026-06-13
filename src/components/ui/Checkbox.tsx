import clsx from "clsx";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
          checked ? "bg-brand-500 border-brand-500" : "border-surface-border hover:border-brand-500"
        )}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  );
}