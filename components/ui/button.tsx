import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--cr-teal] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[--cr-teal] text-white shadow-[0_12px_26px_rgba(13,148,136,0.22)] hover:bg-[--cr-teal-dark]",
        outline: "border border-[--cr-border] bg-white text-[--cr-text] hover:border-[--cr-teal]",
        ghost: "text-[--cr-teal] hover:underline underline-offset-4",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
