import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Velzon-inspired button component.
 *
 * Variants:
 *  default     — solid primary (green)
 *  secondary   — solid secondary gray
 *  success     — solid green (alias, same as default)
 *  info        — solid cyan/teal
 *  warning     — solid amber/yellow
 *  danger      — solid red (destructive)
 *  dark        — solid dark
 *  outline     — bordered button
 *  ghost       — transparent hover
 *  link        — text only with underline
 *  soft        — soft/subtle primary bg
 *  softDanger  — soft red bg
 *  softWarning — soft amber bg
 *  softInfo    — soft blue/cyan bg
 *  destructive — kept for backward-compat (maps to danger style)
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[0.25rem] border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // ── Solid Buttons (Velzon style) ─────────────────────────────
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 focus-visible:ring-primary/40",
        secondary:
          "bg-[#405189] text-white shadow-sm hover:shadow-md hover:bg-[#364577] focus-visible:ring-[#405189]/40",
        success:
          "bg-[#0ab39c] text-white shadow-sm hover:shadow-md hover:bg-[#099682] focus-visible:ring-[#0ab39c]/40",
        info:
          "bg-[#299cdb] text-white shadow-sm hover:shadow-md hover:bg-[#2385ba] focus-visible:ring-[#299cdb]/40",
        warning:
          "bg-[#f7b84b] text-white shadow-sm hover:shadow-md hover:bg-[#e5a936] focus-visible:ring-[#f7b84b]/40",
        danger:
          "bg-[#f06548] text-white shadow-sm hover:shadow-md hover:bg-[#e04f34] focus-visible:ring-[#f06548]/40",
        dark:
          "bg-[#212529] text-white shadow-sm hover:shadow-md hover:bg-[#1a1e21] focus-visible:ring-[#212529]/40",

        // ── Outline / Ghost / Link (standard) ───────────────────────
        outline:
          "border-border bg-background text-foreground shadow-sm hover:bg-muted hover:shadow-md focus-visible:ring-primary/30 aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted/50",
        link:
          "text-primary underline-offset-4 hover:underline focus-visible:ring-0",

        // ── Soft / Subtle Buttons (Velzon style) ─────────────────────
        soft:
          "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/30",
        softDanger:
          "bg-[#f06548]/10 text-[#f06548] hover:bg-[#f06548]/20 focus-visible:ring-[#f06548]/30",
        softWarning:
          "bg-[#f7b84b]/10 text-[#c58c1c] hover:bg-[#f7b84b]/20 focus-visible:ring-[#f7b84b]/30",
        softInfo:
          "bg-[#299cdb]/10 text-[#299cdb] hover:bg-[#299cdb]/20 focus-visible:ring-[#299cdb]/30",
        softSuccess:
          "bg-[#0ab39c]/10 text-[#0ab39c] hover:bg-[#0ab39c]/20 focus-visible:ring-[#0ab39c]/30",

        // ── Backward-compat ──────────────────────────────────────────
        destructive:
          "bg-destructive text-white shadow-sm hover:shadow-md hover:bg-destructive/90 focus-visible:ring-destructive/40",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 px-2.5 text-xs rounded-[0.2rem] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-[0.8125rem] rounded-[0.2rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-5 text-sm",
        xl: "h-11 px-6 text-base",
        icon: "size-9",
        "icon-xs": "size-7 rounded-[0.2rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[0.2rem]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
