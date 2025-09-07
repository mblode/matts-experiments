import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  item: { id: number };
  index?: number;
};

export const CardBlock = ({ item, index = 0 }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);

  const inputClassName =
    "bg-page-input-background text-page-input-text rounded-page-widget-block border-page-input-border shadow-page-input placeholder:text-page-input-placeholder! h-12! text-base";

  return (
    <motion.div
      className="ft-widget-wrapper size-full rounded-page-widget text-neutral-900"
      ref={ref}
      initial={{
        y: 30,
        scale: 0.95,
        opacity: 0.3,
      }}
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
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
    >
      <div className="bg-page-widget-background shadow-page-widget border-page-widget size-full rounded-page-widget text-page-body-text backdrop-blur-page-widget p-4">
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
            <Label htmlFor="email" className="cursor-pointer">
              Email
            </Label>
          </div>

          <FormControl name="email">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className={inputClassName}
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
