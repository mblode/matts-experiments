// CodePen packages: @radix-ui/react-label@^2.1.8, @radix-ui/react-separator@^1.1.8, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^0.562.0, motion@^12.23.26, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import * as React from "react";
import { ComponentProps, forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode, useEffect, useMemo, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Root as LabelRoot } from "@radix-ui/react-label";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Root as SeparatorRoot } from "@radix-ui/react-separator";
import { CircleXIcon, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createRoot } from "react-dom/client";

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

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorRoot>) {
  return (
    <SeparatorRoot
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      data-slot="field-set"
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      data-slot="field-group"
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"fieldset"> & VariantProps<typeof fieldVariants>) {
  return (
    <fieldset
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="field"
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      data-slot="field-content"
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-normal text-muted-foreground text-sm leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      data-content={!!children}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error) => {
          const message = error?.message;
          if (!message) {
            return null;
          }
          return <li key={message}>{message}</li>;
        })}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      className={cn("font-normal text-destructive text-sm", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  );
}

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

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  showStrength?: boolean;
}

function getPasswordStrength(password: string): {
  bars: number;
  label: string;
  barColor: string;
  textColor: string;
} {
  const length = password.length;

  if (length === 0) {
    return {
      bars: 0,
      label: "Password strength",
      barColor: "bg-gray-300",
      textColor: "text-muted-foreground",
    };
  }

  if (length >= 1 && length <= 4) {
    return {
      bars: 1,
      label: "Weak password",
      barColor: "bg-red-500",
      textColor: "text-red-700",
    };
  }

  if (length >= 5 && length <= 9) {
    return {
      bars: 2,
      label: "Moderate password",
      barColor: "bg-orange-500",
      textColor: "text-orange-700",
    };
  }

  return {
    bars: 3,
    label: "Strong password",
    barColor: "bg-green-500",
    textColor: "text-green-700",
  };
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");
    const [strength, setStrength] = useState({
      bars: 0,
      label: "Password strength",
      barColor: "bg-gray-300",
      textColor: "text-muted-foreground",
    });

    // Calculate strength based on internal value when showStrength is enabled
    useEffect(() => {
      if (showStrength) {
        setStrength(getPasswordStrength(internalValue));
      }
    }, [internalValue, showStrength]);

    // Wrap onChange to track internal value for strength calculation
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (showStrength) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            className={cn("pr-10", className)}
            data-1p-ignore
            onChange={handleChange}
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            {...props}
          />
          <button
            className="absolute top-0 right-0 flex h-full cursor-pointer items-center pr-3 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            type="button"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {showStrength && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Vertical bar chart */}
              <div className="flex items-end gap-0.5">
                {[
                  { bar: 1, height: "h-[4px]" },
                  { bar: 2, height: "h-[8px]" },
                  { bar: 3, height: "h-[12px]" },
                ].map(({ bar, height }) => {
                  const getBarColor = () => {
                    if (bar > strength.bars) {
                      return "rgb(209 213 219)";
                    }
                    if (strength.barColor === "bg-red-500") {
                      return "rgb(239 68 68)";
                    }
                    if (strength.barColor === "bg-orange-500") {
                      return "rgb(249 115 22)";
                    }
                    if (strength.barColor === "bg-green-500") {
                      return "rgb(34 197 94)";
                    }
                    return "rgb(209 213 219)";
                  };

                  return (
                    <motion.div
                      animate={{
                        backgroundColor: getBarColor(),
                      }}
                      className={cn("w-1 rounded-sm", height)}
                      key={bar}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 55,
                      }}
                    />
                  );
                })}
              </div>

              {/* Strength label with staggered animation */}
              <div className={cn("font-medium text-sm", strength.textColor)}>
                <AnimatePresence initial={false} mode="popLayout">
                  <span className="inline-flex" key={strength.label}>
                    {strength.label.split("").map((letter, index) => (
                      <motion.span
                        animate={{
                          opacity: 1,
                          filter: "blur(0px)",
                          transition: {
                            type: "spring",
                            stiffness: 350,
                            damping: 55,
                            delay: index * 0.015,
                          },
                        }}
                        className="inline-block"
                        exit={{
                          opacity: 0,
                          filter: "blur(2px)",
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 55,
                          },
                        }}
                        initial={{
                          opacity: 0,
                          filter: "blur(2px)",
                        }}
                        key={index + letter + strength.label}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </motion.span>
                    ))}
                  </span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

const PasswordStrengthBlock = () => {
  const [password, setPassword] = useState("");

  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <PasswordInput
        autoComplete="new-password"
        id="password"
        onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
        showStrength
        value={password}
      />
    </Field>
  );
};

function App() {
  return (
    <PasswordStrengthBlock />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
