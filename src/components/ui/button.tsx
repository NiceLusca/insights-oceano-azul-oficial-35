
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border dark:border-blue-500 dark:text-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:border dark:border-red-700",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-blue-500 dark:text-blue-300 dark:hover:text-blue-200 dark:bg-blue-950/40 dark:hover:bg-blue-900/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-blue-800 dark:hover:bg-blue-700 dark:border dark:border-blue-600 dark:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-blue-900/30 dark:hover:text-blue-200",
        link: "text-primary underline-offset-4 hover:underline dark:text-blue-400 dark:hover:text-blue-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
