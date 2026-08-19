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
            className="sys-label mb-2 block text-[#1E1208] dark:text-platinum-200 font-bold tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "input-recessed rounded-xl w-full resize-y px-4 py-2.5 text-sm font-body font-medium",
            "text-[#1E1208] dark:text-platinum-50 placeholder:text-[#5E412A]/60 dark:placeholder:text-text-muted/60",
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
