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
            className="codex-label mb-2 block text-leather-dark dark:text-platinum-200 font-bold tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "codex-input rounded-xl w-full resize-y px-4 py-2.5 text-sm font-body font-medium",
            "text-leather-dark dark:text-platinum-50 placeholder:text-leather-muted/60 dark:placeholder:text-text-muted/60",
            "min-h-[80px]",
            error && "border-hud-danger",
            className
          )}
          {...props}
        />
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-hud-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
