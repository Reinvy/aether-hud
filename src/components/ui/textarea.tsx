import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "input-recessed chamfered-xs w-full resize-y px-4 py-2.5 text-sm font-body",
            "placeholder:text-leather-muted placeholder:opacity-40",
            "min-h-[80px]",
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
Textarea.displayName = "Textarea";

export { Textarea };
