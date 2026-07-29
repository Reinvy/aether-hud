import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="sys-label mb-2 block text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "input-recessed w-full px-4 py-2.5 text-sm font-body",
            "placeholder:text-text-muted placeholder:opacity-40",
            error && "border-hud-danger",
            className
          )}
          {...props}
        />
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
