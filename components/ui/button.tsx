import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export const secondaryNavbarClassName =
  "hover:bg-gray-200 active:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 dark:active:bg-gray-700";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-sans text-base font-bold transition-[color,background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-gray-700 active:bg-gray-800 dark:hover:bg-gray-100 dark:active:bg-gray-200",
        secondary:
          "border border-gray-200 text-foreground hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:active:bg-gray-700",
        muted:
          "border border-gray-100 bg-gray-100 text-foreground hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:active:border-gray-600 dark:active:bg-gray-600",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700",
        input:
          "border border-input bg-input text-base font-normal! text-foreground focus:border-ring focus:outline-hidden focus:border-ring focus:ring-2 focus:ring-ring/15 focus:ring-offset-1 focus:ring-offset-background",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive:
          "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 dark:active:bg-red-300",
        destructiveSecondary:
          "border border-red-200 text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900 dark:active:bg-red-800",
        success:
          "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 dark:active:bg-green-300",
        successSecondary:
          "border border-green-200 text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900 dark:active:bg-green-800",
        warning:
          "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:active:bg-yellow-300",
        warningSecondary:
          "border border-yellow-200 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900 dark:active:bg-yellow-800",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-300",
        infoSecondary:
          "border border-blue-200 text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900 dark:active:bg-blue-800",
        blockPrimary:
          "shadow-page-primary-button border-page-primary-button bg-page-primary-button-background font-page-body! font-page-primary-button-weight text-page-primary-button-text backdrop-blur-page-primary-button hover:opacity-80",
        blockSecondary:
          "bg-page-secondary-button-background shadow-page-secondary-button border-page-secondary-button font-page-body! font-page-secondary-button-weight text-page-secondary-button-text backdrop-blur-page-secondary-button hover:opacity-80",
      },
      size: {
        lg: "h-12 px-6 py-3 rounded-md",
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-4 py-2 rounded-md text-sm",
        xs: "h-[30px] px-2 rounded-md text-xs",
        icon: "size-9",
        block: "rounded-page-widget-block h-12 shrink-0 px-4 py-2 text-base",
        blockSm: "rounded-page-widget-block h-8 shrink-0 px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, asChild = false, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      const { children, ...restProps } = props;

      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            "cursor-wait",
          )}
          ref={ref}
          disabled={true}
          {...restProps}
        >
          <span
            data-testid="button-is-loading-children"
            className="invisible opacity-0"
          >
            {children}
          </span>

          <span
            className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            data-testid="button-is-loading"
          >
            <Spinner size={20} strokeWidth={4} />
          </span>
        </button>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...(props as any)}
      />
    );
  },
);
Button.displayName = "Button";

const ButtonDiv = ({
  className,
  variant,
  size,
  loading,
  children,
  style,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: This div is used as a button replacement when loading state needs to be handled
    // biome-ignore lint/a11y/useKeyWithClickEvents: This is a specialized button div component for loading states
    <div
      className={cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled || loading,
      })}
      style={style}
      onClick={loading ? undefined : (onClick as any)}
    >
      {loading ? (
        <span
          data-testid="button-is-loading-children"
          className="invisible opacity-0"
        >
          {children}
        </span>
      ) : (
        children
      )}

      {loading && (
        <span
          className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
          data-testid="button-is-loading"
        >
          <Spinner size={20} strokeWidth={4} />
        </span>
      )}
    </div>
  );
};

export { Button, buttonVariants, ButtonDiv };
