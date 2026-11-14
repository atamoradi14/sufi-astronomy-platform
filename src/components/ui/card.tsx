import { LocalizedDigits } from "@/components/digits/DigitScript";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <LocalizedDigits>
      {
        <div
          className={cn(
            "min-w-0 rounded-xl border border-[var(--border)] bg-[var(--panel)]/90 text-[var(--parchment)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm",
            className,
          )}
          {...props}
        />
      }
    </LocalizedDigits>
  );
}
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <LocalizedDigits>
      {
        <div
          className={cn("flex flex-col gap-1.5 p-5 pb-3", className)}
          {...props}
        />
      }
    </LocalizedDigits>
  );
}
export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <LocalizedDigits>
      {
        <h3
          className={cn(
            "font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]",
            className,
          )}
          {...props}
        />
      }
    </LocalizedDigits>
  );
}
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <LocalizedDigits>
      {
        <p
          className={cn("text-sm text-[var(--muted)] leading-7", className)}
          {...props}
        />
      }
    </LocalizedDigits>
  );
}
export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <LocalizedDigits>
      {<div className={cn("p-5 pt-0", className)} {...props} />}
    </LocalizedDigits>
  );
}
