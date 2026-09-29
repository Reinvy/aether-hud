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
            className="codex-label mb-2 block text-leather-dark font-bold"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "codex-input w-full resize-y px-4 py-2.5 text-sm font-body font-medium",
            "text-leather-dark",
            "min-h-[80px]",
            error && "border-crimson-600/30",
            className
          )}
          {...props}
        />
        {error && (
          <p role="alert" className="mt-1.5 text-[11px] text-crimson-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
