"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
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

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, showStrength = false, value, onChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [strength, setStrength] = React.useState({
    bars: 0,
    label: "Password strength",
    barColor: "bg-gray-300",
    textColor: "text-muted-foreground",
  });

  // Calculate strength based on internal value when showStrength is enabled
  React.useEffect(() => {
    if (showStrength) {
      setStrength(getPasswordStrength(internalValue));
    }
  }, [internalValue, showStrength]);

  // Wrap onChange to track internal value for strength calculation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrength) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer absolute right-0 top-0 flex h-full items-center pr-3 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
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
              ].map(({ bar, height }) => (
                <motion.div
                  key={bar}
                  className={cn("w-1 rounded-sm", height)}
                  animate={{
                    backgroundColor:
                      bar <= strength.bars
                        ? strength.barColor === "bg-red-500"
                          ? "rgb(239 68 68)"
                          : strength.barColor === "bg-orange-500"
                            ? "rgb(249 115 22)"
                            : strength.barColor === "bg-green-500"
                              ? "rgb(34 197 94)"
                              : "rgb(209 213 219)"
                        : "rgb(209 213 219)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 55,
                  }}
                />
              ))}
            </div>

            {/* Strength label with staggered animation */}
            <div className={cn("text-sm font-medium", strength.textColor)}>
              <AnimatePresence mode="popLayout" initial={false}>
                <span key={strength.label} className="inline-flex">
                  {strength.label.split("").map((letter, index) => (
                    <motion.span
                      key={index + letter + strength.label}
                      initial={{
                        opacity: 0,
                        filter: "blur(2px)",
                      }}
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
                      exit={{
                        opacity: 0,
                        filter: "blur(2px)",
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 55,
                        },
                      }}
                      className="inline-block"
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
});

PasswordInput.displayName = "PasswordInput";
