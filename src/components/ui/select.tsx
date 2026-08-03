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
 * Select — reusable HUD-styled dropdown.
 *
 * Mirrors the `Input` component's API (sys-label + recessed field) so form
 * modals can use selects without hand-rolling the `.input-recessed` markup
 * and a raw chevron. Gold inner glow on focus, hexagonal-free (chamfered
 * system), no rounded corners.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="sys-label mb-2 block text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              "input-recessed w-full appearance-none px-4 py-2.5 pr-10 text-sm font-body",
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
          {/* HUD chevron — gold-tinted, mirrors the diamond indicator language */}
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/60" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-mono text-hud-danger">
            [ERROR] // {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
export type { SelectOption };
