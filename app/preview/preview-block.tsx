"use client";
import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

interface RabbitCardProps {
  id: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const smoothEasing: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

const Card = ({ id, isExpanded, onToggle }: RabbitCardProps) => {
  return (
    <motion.div
      className="w-full"
      layout="position"
      initial={false}
      transition={springConfig}
    >
      <motion.div
        className="relative rounded-2xl cursor-pointer overflow-hidden border border-border will-change-transform"
        onClick={onToggle}
        initial={false}
        animate={{
          height: isExpanded ? 400 : 120,
          backgroundColor: isExpanded ? "#ffffff" : "#f3f4f6",
        }}
        whileHover={!isExpanded ? { scale: 1.02 } : { scale: 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          height: { duration: 0.5, ease: smoothEasing },
          backgroundColor: { duration: 0.5, ease: smoothEasing },
          borderColor: { duration: 0.5, ease: smoothEasing },
          scale: { duration: 0.15, ease: "easeOut" },
        }}
        style={{
          transformOrigin: "center top",
        }}
      >
        {/* Content wrapper */}
        <motion.div
          className="p-4 h-full"
          layout="preserve-aspect"
          initial={false}
          transition={springConfig}
          style={{
            display: "flex",
            flexDirection: isExpanded ? "column" : "row",
            justifyContent: isExpanded ? "center" : "flex-start",
            alignItems: isExpanded ? "center" : "center",
          }}
        >
          {/* Image */}
          <motion.img
            src="https://placehold.co/500x500"
            alt={`Rabbit ${id}`}
            className="object-cover select-none"
            layout="preserve-aspect"
            initial={false}
            animate={{
              width: isExpanded ? "100%" : 86,
              height: isExpanded ? "auto" : 86,
              borderRadius: isExpanded ? 8 : 12,
            }}
            transition={{
              width: { duration: 0.5, ease: smoothEasing },
              height: { duration: 0.5, ease: smoothEasing },
              borderRadius: { duration: 0.5, ease: smoothEasing },
            }}
            style={{
              aspectRatio: isExpanded ? "1/1" : undefined,
              order: isExpanded ? 2 : 1,
              maxWidth: isExpanded ? 280 : 86,
            }}
          />

          {/* Text */}
          <motion.h1
            className="font-semibold whitespace-nowrap select-none"
            layout="preserve-aspect"
            initial={false}
            animate={{
              fontSize: isExpanded ? "1.5rem" : "1.125rem",
              marginLeft: isExpanded ? 0 : 16,
              marginBottom: isExpanded ? 16 : 0,
            }}
            transition={{
              fontSize: { duration: 0.5, ease: smoothEasing },
              marginLeft: { duration: 0.5, ease: smoothEasing },
              marginBottom: { duration: 0.5, ease: smoothEasing },
            }}
            style={{
              order: isExpanded ? 1 : 2,
              textAlign: isExpanded ? "center" : "left",
            }}
          >
            Rabbit #{id}
          </motion.h1>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const PreviewBlock = () => {
  const [expandedCard, setExpandedCard] = useState<number | undefined>();
  const rabbitIds = [1, 2, 3, 4, 5];

  const handleToggle = (id: number) => {
    setExpandedCard(expandedCard === id ? undefined : id);
  };

  return (
    <LayoutGroup>
      <motion.div
        className="flex flex-col gap-3 items-center"
        layout="position"
        initial={false}
        transition={springConfig}
      >
        {rabbitIds.map((id) => (
          <Card
            key={id}
            id={id}
            isExpanded={expandedCard === id}
            onToggle={() => handleToggle(id)}
          />
        ))}
      </motion.div>
    </LayoutGroup>
  );
};
