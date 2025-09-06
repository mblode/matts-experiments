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
        opacity: 0.3 
      }}
      animate={isInView ? { 
        y: 0, 
        scale: 1, 
        opacity: 1 
      } : { 
        y: 30, 
        scale: 0.95, 
        opacity: 0.3 
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05
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

          <div className="relative w-full max-w-[400px] px-2 pointer-events-none z-[1]">
            <div
              className="grid gap-2 place-items-center"
              style={{
                gridTemplateColumns: "repeat(7, 1fr)",
                gridTemplateRows: "1fr",
              }}
            >
              <motion.div
                initial={{
                  gridColumnEnd: "span 5",
                  gridColumnStart: 2,
                  gridRowEnd: 2,
                  gridRowStart: 1,
                  scale: 1,
                  // scale: 0.8,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.8 }}
                className="z-[1] aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-red-500 rounded-page-widget-block transition-all hover:shadow-xl"
              />

              <motion.div
                initial={{
                  gridColumnEnd: "span 3",
                  gridColumnStart: 1,
                  gridRowEnd: 2,
                  gridRowStart: 1,
                  // translateX: "20%",
                  rotate: -4,
                  scale: 0.9,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.8 }}
                className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-blue-500 rounded-page-widget-block transition-all hover:shadow-xl"
              />

              <motion.div
                initial={{
                  gridColumnEnd: "span 3",
                  gridColumnStart: 5,
                  gridRowEnd: 2,
                  gridRowStart: 1,
                  // translateX: "20%",
                  rotate: 4,
                  scale: 0.9,
                }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.8 }}
                className="aspect-[9/16] max-w-[170px] w-full pointer-events-auto bg-green-500 rounded-page-widget-block transition-all hover:shadow-xl"
              />
            </div>
          </div>

          <Button size="block" variant="blockPrimary">
            Primary
          </Button>

          <Button size="block" variant="blockSecondary">
            Secondary
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
