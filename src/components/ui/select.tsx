import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  /** Options rendered inside the native <select>. */
  options: SelectOption[];
  error?: string;
}

/**
 * Select — reusable codex dropdown.
 *
 * Mirrors the `Input` component's API (codex-label + recessed field) so form
 * modals can use selects without hand-rolling the `.codex-input` markup
 * and a raw chevron. Gold inner glow on focus, hexagonal-free (codex-panel-radius
 * system), no rounded corners.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="codex-label mb-2 block text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              "codex-input w-full appearance-none px-4 py-2.5 pr-10 text-sm font-body",
              "cursor-pointer transition-all duration-300",
              error && "border-hud-danger",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-primary text-text-main">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Gold-tinted chevron indicator */}
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/60" />
        </div>
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-hud-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectOption };
