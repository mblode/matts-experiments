// CodePen packages: @radix-ui/react-label@^2.1.8, @radix-ui/react-slot@^1.2.4, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^0.562.0, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { motion, useInView } from "motion/react";
import * as React from "react";
import { ComponentProps, ReactNode, forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Root as LabelRoot } from "@radix-ui/react-label";
import { CheckIcon, CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { createRoot } from "react-dom/client";

interface Props {
  size?: number;
  strokeWidth?: number;
}

const Spinner = ({ size = 48, strokeWidth = 2 }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        aria-label="Loading spinner"
        height={size}
        role="img"
        stroke="currentColor"
        viewBox="0 0 40 40"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          fillRule="evenodd"
          strokeWidth={strokeWidth}
          transform="translate(2 2)"
        >
          <circle cx={18} cy={18} r={18} strokeOpacity={0.3} />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              dur="1s"
              from="0 18 18"
              repeatCount="indefinite"
              to="360 18 18"
              type="rotate"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );

  d.push("Z");
  return d.join(" ");
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const unsplashLoader = ({
  src,
  width,
  quality,
  blur,
  cropX,
  cropY,
  cropW,
  cropH,
}: {
  src: string;
  width: number;
  quality?: number;
  blur?: number;
  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
}) => {
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }
  if (blur) {
    params.set("blur", blur.toString());
  }
  if (cropX) {
    params.set("rect", `${cropX},${cropY},${cropW},${cropH}`);
  }

  return `${src}?${params.toString()}`;
};

const secondaryNavbarClassName =
  "hover:bg-gray-200 active:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 dark:active:bg-gray-700";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-bold font-sans text-base transition-[color,background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-gray-700 active:bg-gray-800 dark:active:bg-gray-200 dark:hover:bg-gray-100",
        secondary:
          "border border-gray-200 text-foreground hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:active:bg-gray-700 dark:hover:bg-gray-700",
        muted:
          "border border-gray-100 bg-gray-100 text-foreground hover:border-gray-200 hover:bg-gray-200 active:border-gray-300 active:bg-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:active:border-gray-600 dark:active:bg-gray-600 dark:hover:border-gray-700 dark:hover:bg-gray-700",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:active:bg-gray-700 dark:hover:bg-gray-800",
        input:
          "border border-input bg-input font-normal! text-base text-foreground focus:border-ring focus:border-ring focus:outline-hidden focus:ring-2 focus:ring-ring/15 focus:ring-offset-1 focus:ring-offset-background",
        link: "border border-transparent text-primary underline-offset-4 hover:underline",
        destructive:
          "border-red-600 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-500 dark:active:bg-red-300 dark:hover:bg-red-400",
        destructiveSecondary:
          "border border-red-200 text-red-600 hover:bg-red-100 active:bg-red-200 dark:border-red-700 dark:text-red-300 dark:active:bg-red-800 dark:hover:bg-red-900",
        success:
          "border-green-600 bg-green-500 text-white hover:bg-green-600 active:bg-green-700 dark:bg-green-500 dark:active:bg-green-300 dark:hover:bg-green-400",
        successSecondary:
          "border border-green-200 text-green-600 hover:bg-green-100 active:bg-green-200 dark:border-green-700 dark:text-green-300 dark:active:bg-green-800 dark:hover:bg-green-900",
        warning:
          "border-yellow-600 bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-500 dark:active:bg-yellow-300 dark:hover:bg-yellow-400",
        warningSecondary:
          "border border-yellow-200 text-yellow-600 hover:bg-yellow-100 active:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-300 dark:active:bg-yellow-800 dark:hover:bg-yellow-900",
        info: "border-blue-600 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-300 dark:hover:bg-blue-400",
        infoSecondary:
          "border border-blue-200 text-blue-600 hover:bg-blue-100 active:bg-blue-200 dark:border-blue-700 dark:text-blue-300 dark:active:bg-blue-800 dark:hover:bg-blue-900",
        blockPrimary:
          "border-page-primary-button bg-page-primary-button-background font-page-body! font-page-primary-button-weight text-page-primary-button-text shadow-page-primary-button backdrop-blur-page-primary-button hover:opacity-80",
        blockSecondary:
          "border-page-secondary-button bg-page-secondary-button-background font-page-body! font-page-secondary-button-weight text-page-secondary-button-text shadow-page-secondary-button backdrop-blur-page-secondary-button hover:opacity-80",
      },
      size: {
        lg: "h-12 rounded px-6 py-3",
        default: "h-10 rounded px-4 py-2",
        sm: "h-9 rounded px-4 py-2 text-sm",
        xs: "h-[30px] rounded px-2 text-xs",
        icon: "size-9",
        block: "h-12 shrink-0 rounded-page-widget-block px-4 py-2 text-base",
        blockSm: "h-8 shrink-0 rounded-page-widget-block px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, asChild = false, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      const { children, ...restProps } = props;

      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            "cursor-wait"
          )}
          disabled={true}
          ref={ref}
          {...restProps}
        >
          <span
            className="invisible opacity-0"
            data-testid="button-is-loading-children"
          >
            {children}
          </span>

          <span
            className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
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
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
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
    <button
      className={cn("truncate", buttonVariants({ variant, size, className }), {
        "cursor-wait": loading,
        "pointer-events-none opacity-50": disabled || loading,
      })}
      disabled={disabled || loading}
      onClick={loading ? undefined : onClick}
      style={style}
      type="button"
    >
      {loading ? (
        <span
          className="invisible opacity-0"
          data-testid="button-is-loading-children"
        >
          {children}
        </span>
      ) : (
        children
      )}

      {loading && (
        <span
          className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
          data-testid="button-is-loading"
        >
          <Spinner size={20} strokeWidth={4} />
        </span>
      )}
    </button>
  );
};

function Label({ className, ...props }: ComponentProps<typeof LabelRoot>) {
  return (
    <LabelRoot
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}

const validationVariants = cva(
  "mt-2 flex flex-row items-center text-sm",
  {
    variants: {
      variant: {
        error: "text-destructive-foreground",
        warning: "text-warning-foreground",
        success: "text-success-foreground",
        loading: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

type Props = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof validationVariants>;

const Validation = ({ children, className, variant }: Props) => {
  return (
    <div className={cn(validationVariants({ variant, className }))}>
      {children}
      {variant === "error" && <TriangleAlertIcon className="ml-1 size-4" />}
      {variant === "success" && <CheckIcon className="ml-1 size-4" />}
      {variant === "warning" && <TriangleAlertIcon className="ml-1 size-4" />}
      {variant === "loading" && (
        <span className="ml-1">
          <Spinner size={16} />
        </span>
      )}
    </div>
  );
};

interface FormControlProps {
  name: string;
  label?: ReactNode;
  labelRight?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  warning?: ReactNode;
  loading?: ReactNode;
  caption?: ReactNode;
  controlLeft?: ReactNode;
  children: ReactNode;
  className?: string;
  validationPosition?: "left" | "right";
  validationClassName?: string;
  captionClassName?: string;
  labelClassName?: string;
}

const FormControl = ({
  label,
  labelRight,
  controlLeft,
  name,
  caption,
  error,
  loading,
  success,
  warning,
  children,
  className,
  validationPosition = "left",
  validationClassName,
  captionClassName,
  labelClassName,
}: FormControlProps) => {
  return (
    <div className={cn("mb-4 flex flex-col", className)}>
      {(label || labelRight) && (
        <div className="mb-2 flex items-center justify-between gap-1">
          <div>
            {label && (
              <Label
                className={cn("cursor-pointer", labelClassName)}
                htmlFor={name}
              >
                {label}
              </Label>
            )}
          </div>

          <div>{labelRight}</div>
        </div>
      )}

      {children}

      {caption && (
        <span
          className={cn("mt-1 text-muted-foreground text-sm", captionClassName)}
        >
          {caption}
        </span>
      )}

      {controlLeft && <div className="mt-1">{controlLeft}</div>}

      <div
        className={cn("flex flex-row", {
          "justify-end": validationPosition === "right",
          "justify-start": validationPosition === "left",
        })}
      >
        {success && (
          <Validation className={validationClassName} variant="success">
            {success}
          </Validation>
        )}
        {warning && (
          <Validation className={validationClassName} variant="warning">
            {warning}
          </Validation>
        )}
        {error && (
          <Validation className={validationClassName} variant="error">
            {error}
          </Validation>
        )}
        {loading && (
          <Validation className={validationClassName} variant="loading">
            {loading}
          </Validation>
        )}
      </div>
    </div>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  clearClassName?: string;
  leftAddon?: ReactNode | null;
  rightAddon?: ReactNode | null;
  leftControl?: ReactNode | null;
  rightControl?: ReactNode | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      clearClassName,
      hasError,
      clearable,
      onClear,
      leftAddon,
      rightAddon,
      leftControl,
      rightControl,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn("relative w-full", {
          "input-group": !!leftAddon || !!rightAddon,
        })}
      >
        {leftAddon && (
          <span className="shrink-0 cursor-pointer">{leftAddon}</span>
        )}

        {leftControl && (
          <div className="absolute top-0 left-0 flex h-full flex-row place-items-center items-center justify-center">
            {leftControl}
          </div>
        )}

        <div className="w-full">
          <input
            className={cn(
              "input flex h-[48px] w-full rounded-[4px] border border-input bg-input px-3 py-[12px] font-normal font-sans text-foreground text-sm leading-snug transition-colors placeholder:text-placeholder-foreground hover:border-input-hover focus:border-ring focus:bg-card focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              {
                "border-destructive-foreground": hasError,
                "pr-9": clearable && !!props.value,
                "hover:border-input! focus:border-input!": props.readOnly,
              },
              className
            )}
            ref={ref}
            {...props}
          />

          {clearable && !!props.value && (
            <div className="absolute top-0 right-0 flex flex-row gap-1 pr-3">
              <button
                aria-label="clear input"
                className={cn(
                  "flex h-[48px] cursor-pointer items-center justify-center p-0! text-muted-foreground",
                  clearClassName
                )}
                onClick={() => onClear?.()}
                tabIndex={-1}
                type="button"
              >
                <CircleXIcon className="size-5 text-muted-foreground/50" />
              </button>
            </div>
          )}
        </div>

        {rightControl && (
          <div className="absolute top-0 right-0 flex h-full flex-row place-items-center items-center justify-center">
            {rightControl}
          </div>
        )}

        {rightAddon && (
          <span className="shrink-0 cursor-pointer">{rightAddon}</span>
        )}
      </label>
    );
  }
);
Input.displayName = "Input";

interface Props {
  item: { id: number };
  index?: number;
}

const CardBlock = ({ item, index = 0 }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);

  const inputClassName =
    "bg-page-input-background text-page-input-text rounded-page-widget-block border-page-input-border shadow-page-input placeholder:text-page-input-placeholder! h-12! text-base";

  return (
    <motion.div
      animate={
        isInView
          ? {
              y: 0,
              scale: 1,
              opacity: 1,
            }
          : {
              y: 30,
              scale: 0.95,
              opacity: 0.3,
            }
      }
      className="ft-widget-wrapper size-full rounded-page-widget text-neutral-900"
      initial={{
        y: 30,
        scale: 0.95,
        opacity: 0.3,
      }}
      ref={ref}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
    >
      <div className="size-full rounded-page-widget border-page-widget bg-page-widget-background p-4 text-page-body-text shadow-page-widget backdrop-blur-page-widget">
        <div className="mb-1 shrink-0">
          <div className="page-heading line-clamp-2 grow text-left text-lg">
            This is the title {item.id}
          </div>
        </div>

        <div className="line-clamp-2 shrink-0 text-left">
          This is a description of the content.
        </div>

        <div className="mb-4">
          <div className="mb-2">
            <Label className="cursor-pointer" htmlFor="email">
              Email
            </Label>
          </div>

          <FormControl name="email">
            <Input
              className={inputClassName}
              name="email"
              placeholder="Email"
              type="email"
            />
          </FormControl>

          <div className="flex gap-2">
            <Button size="block" variant="blockPrimary">
              Primary
            </Button>

            <Button size="block" variant="blockSecondary">
              Secondary
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <CardBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
