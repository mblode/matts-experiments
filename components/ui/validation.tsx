import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export const validationVariants = cva(
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
  },
);

type Props = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof validationVariants>;

export const Validation = ({ children, className, variant }: Props) => {
  return (
    <div className={cn(validationVariants({ variant, className }))}>
      {children}
      {variant === "error" && <TriangleAlertIcon className="size-4 ml-1" />}
      {variant === "success" && <CheckIcon className="size-4 ml-1" />}
      {variant === "warning" && <TriangleAlertIcon className="size-4 ml-1" />}
      {variant === "loading" && (
        <span className="ml-1 ">
          <Spinner size={16} />
        </span>
      )}
    </div>
  );
};
