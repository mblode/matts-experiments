"use client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { motion } from "motion/react";
import { useState } from "react";

const sidebar = {
  closed: {
    opacity: 0,
    x: -200,
  },
  open: {
    opacity: 1,
    x: -20,
  },
};

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="mx-auto max-w-4xl">
        <Header id="tailwind-motion" />

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 fixed top-0 right-0 z-10"
        >
          {isOpen ? "Close" : "Open"}
        </Button>

        <motion.div
          variants={sidebar}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="w-[150px] h-screen bg-muted absolute top-0 left-0 p-4 pl-[36px]"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Tailwind Motion</h2>
            <p className="text-muted-foreground">
              Tailwind Motion is a library that allows you to create smooth and
              interactive animations using Tailwind CSS.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
