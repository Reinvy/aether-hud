import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  /** Icon or element rendered on the left side of the input */
  prefix?: ReactNode;
  /** Icon or element rendered on the right side of the input */
  suffix?: ReactNode;
  /**
   * Allow pointer events on the suffix content (e.g. a clickable eye
   * toggle). Decorative icons stay `pointer-events-none` by default so
   * clicks pass through to the input.
   */
  suffixInteractive?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, prefix, suffix, suffixInteractive = false, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="sys-label mb-2 block text-leather-muted dark:text-text-muted font-bold"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-leather-muted dark:text-text-muted">
              {prefix}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "input-recessed chamfered-xs w-full px-4 py-2.5 text-sm font-body transition-all duration-300",
              "placeholder:text-leather-muted placeholder:opacity-40",
              prefix && "pl-10",
              suffix && "pr-10",
              error && "border-hud-danger",
              className
            )}
            {...props}
          />
          {suffix && (
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center pr-3 text-leather-muted dark:text-text-muted",
                !suffixInteractive && "pointer-events-none"
              )}
            >
              {suffix}
            </div>
          )}
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
Input.displayName = "Input";

export { Input };
