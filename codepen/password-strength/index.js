import * as React from "react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { Root as LabelRoot } from "@radix-ui/react-label";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Root as SeparatorRoot } from "@radix-ui/react-separator";
import { CircleXIcon, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createRoot } from "react-dom/client";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getSvgPathFromStroke(stroke) {
  if (!stroke.length) {
    return "";
  }
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}
const imageLoader = ({
  src,
  width,
  quality
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
  cropH
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
function Label({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    LabelRoot,
    {
      className: cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      ),
      "data-slot": "label",
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    SeparatorRoot,
    {
      className: cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className
      ),
      "data-slot": "separator",
      decorative,
      orientation,
      ...props
    }
  );
}
function FieldSet({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    "fieldset",
    {
      className: cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      ),
      "data-slot": "field-set",
      ...props
    }
  );
}
function FieldLegend({
  className,
  variant = "legend",
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "legend",
    {
      className: cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      ),
      "data-slot": "field-legend",
      "data-variant": variant,
      ...props
    }
  );
}
function FieldGroup({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      ),
      "data-slot": "field-group",
      ...props
    }
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
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ],
        responsive: [
          "@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function Field({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "fieldset",
    {
      className: cn(fieldVariants({ orientation }), className),
      "data-orientation": orientation,
      "data-slot": "field",
      ...props
    }
  );
}
function FieldContent({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      ),
      "data-slot": "field-content",
      ...props
    }
  );
}
function FieldLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    Label,
    {
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      "data-slot": "field-label",
      ...props
    }
  );
}
function FieldTitle({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      ),
      "data-slot": "field-label",
      ...props
    }
  );
}
function FieldDescription({ className, ...props }) {
  return /* @__PURE__ */ React.createElement(
    "p",
    {
      className: cn(
        "font-normal text-muted-foreground text-sm leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      "data-slot": "field-description",
      ...props
    }
  );
}
function FieldSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      ),
      "data-content": !!children,
      "data-slot": "field-separator",
      ...props
    },
    /* @__PURE__ */ React.createElement(Separator, { className: "absolute inset-0 top-1/2" }),
    children && /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "relative mx-auto block w-fit bg-background px-2 text-muted-foreground",
        "data-slot": "field-separator-content"
      },
      children
    )
  );
}
function FieldError({
  className,
  children,
  errors,
  ...props
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values()
    ];
    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }
    return /* @__PURE__ */ React.createElement("ul", { className: "ml-4 flex list-disc flex-col gap-1" }, uniqueErrors.map((error) => {
      const message = error?.message;
      if (!message) {
        return null;
      }
      return /* @__PURE__ */ React.createElement("li", { key: message }, message);
    }));
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn("font-normal text-destructive text-sm", className),
      "data-slot": "field-error",
      role: "alert",
      ...props
    },
    content
  );
}
const Input = forwardRef(
  ({
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
  }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "label",
      {
        className: cn("relative w-full", {
          "input-group": !!leftAddon || !!rightAddon
        })
      },
      leftAddon && /* @__PURE__ */ React.createElement("span", { className: "shrink-0 cursor-pointer" }, leftAddon),
      leftControl && /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 flex h-full flex-row place-items-center items-center justify-center" }, leftControl),
      /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          className: cn(
            "input flex h-[48px] w-full rounded-[4px] border border-input bg-input px-3 py-[12px] font-normal font-sans text-foreground text-sm leading-snug transition-colors placeholder:text-placeholder-foreground hover:border-input-hover focus:border-ring focus:bg-card focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-destructive-foreground": hasError,
              "pr-9": clearable && !!props.value,
              "hover:border-input! focus:border-input!": props.readOnly
            },
            className
          ),
          ref,
          ...props
        }
      ), clearable && !!props.value && /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 flex flex-row gap-1 pr-3" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          "aria-label": "clear input",
          className: cn(
            "flex h-[48px] cursor-pointer items-center justify-center p-0! text-muted-foreground",
            clearClassName
          ),
          onClick: () => onClear?.(),
          tabIndex: -1,
          type: "button"
        },
        /* @__PURE__ */ React.createElement(CircleXIcon, { className: "size-5 text-muted-foreground/50" })
      ))),
      rightControl && /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 flex h-full flex-row place-items-center items-center justify-center" }, rightControl),
      rightAddon && /* @__PURE__ */ React.createElement("span", { className: "shrink-0 cursor-pointer" }, rightAddon)
    );
  }
);
Input.displayName = "Input";
function getPasswordStrength(password) {
  const length = password.length;
  if (length === 0) {
    return {
      bars: 0,
      label: "Password strength",
      barColor: "bg-gray-300",
      textColor: "text-muted-foreground"
    };
  }
  if (length >= 1 && length <= 4) {
    return {
      bars: 1,
      label: "Weak password",
      barColor: "bg-red-500",
      textColor: "text-red-700"
    };
  }
  if (length >= 5 && length <= 9) {
    return {
      bars: 2,
      label: "Moderate password",
      barColor: "bg-orange-500",
      textColor: "text-orange-700"
    };
  }
  return {
    bars: 3,
    label: "Strong password",
    barColor: "bg-green-500",
    textColor: "text-green-700"
  };
}
const PasswordInput = forwardRef(
  ({ className, showStrength = false, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");
    const [strength, setStrength] = useState({
      bars: 0,
      label: "Password strength",
      barColor: "bg-gray-300",
      textColor: "text-muted-foreground"
    });
    useEffect(() => {
      if (showStrength) {
        setStrength(getPasswordStrength(internalValue));
      }
    }, [internalValue, showStrength]);
    const handleChange = (e) => {
      if (showStrength) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        className: cn("pr-10", className),
        "data-1p-ignore": true,
        onChange: handleChange,
        ref,
        type: showPassword ? "text" : "password",
        value,
        ...props
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "absolute top-0 right-0 flex h-full cursor-pointer items-center pr-3 text-muted-foreground hover:text-foreground",
        onClick: () => setShowPassword(!showPassword),
        tabIndex: -1,
        type: "button"
      },
      showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { className: "size-4" }) : /* @__PURE__ */ React.createElement(Eye, { className: "size-4" })
    )), showStrength && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-end gap-0.5" }, [
      { bar: 1, height: "h-[4px]" },
      { bar: 2, height: "h-[8px]" },
      { bar: 3, height: "h-[12px]" }
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
      return /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: {
            backgroundColor: getBarColor()
          },
          className: cn("w-1 rounded-sm", height),
          key: bar,
          transition: {
            type: "spring",
            stiffness: 350,
            damping: 55
          }
        }
      );
    })), /* @__PURE__ */ React.createElement("div", { className: cn("font-medium text-sm", strength.textColor) }, /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "popLayout" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex", key: strength.label }, strength.label.split("").map((letter, index) => /* @__PURE__ */ React.createElement(
      motion.span,
      {
        animate: {
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 350,
            damping: 55,
            delay: index * 0.015
          }
        },
        className: "inline-block",
        exit: {
          opacity: 0,
          filter: "blur(2px)",
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 55
          }
        },
        initial: {
          opacity: 0,
          filter: "blur(2px)"
        },
        key: index + letter + strength.label
      },
      letter === " " ? "\xA0" : letter
    ))))))));
  }
);
PasswordInput.displayName = "PasswordInput";
const PasswordStrengthBlock = () => {
  const [password, setPassword] = useState("");
  return /* @__PURE__ */ React.createElement(Field, null, /* @__PURE__ */ React.createElement(FieldLabel, { htmlFor: "password" }, "Password"), /* @__PURE__ */ React.createElement(
    PasswordInput,
    {
      autoComplete: "new-password",
      id: "password",
      onInput: (e) => setPassword(e.target.value),
      showStrength: true,
      value: password
    }
  ));
};
function App() {
  return /* @__PURE__ */ React.createElement(PasswordStrengthBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
