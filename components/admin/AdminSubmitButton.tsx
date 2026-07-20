"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

type AdminSubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> & {
  idleText: string;
  loading?: boolean;
  loadingText?: string;
  pendingText: string;
};

export default function AdminSubmitButton({
  className = "",
  disabled,
  idleText,
  loading = false,
  loadingText,
  pendingText,
  ...props
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isPending = pending || loading;
  const isDisabled = disabled || isPending;

  return (
    <button
      {...props}
      type="submit"
      disabled={isDisabled}
      aria-busy={isPending}
      className={`inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      {isPending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
          <span>{loadingText || pendingText}</span>
        </>
      ) : (
        idleText
      )}
    </button>
  );
}
