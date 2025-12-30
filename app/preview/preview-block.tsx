"use client";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";

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
      initial={false}
      layout="position"
      transition={springConfig}
    >
      <motion.div
        animate={{
          height: isExpanded ? 400 : 120,
          backgroundColor: isExpanded ? "#ffffff" : "#f3f4f6",
        }}
        className="relative cursor-pointer overflow-hidden border border-border"
        initial={false}
        onClick={onToggle}
        style={{
          borderRadius: 16,
          transformOrigin: "center top",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
        transition={{
          height: { duration: 0.5, ease: smoothEasing },
          backgroundColor: { duration: 0.5, ease: smoothEasing },
          scale: { duration: 0.15, ease: "easeOut" },
        }}
        whileHover={isExpanded ? { scale: 1 } : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Content wrapper */}
        <motion.div
          className="h-full p-4"
          initial={false}
          layout="position"
          style={{
            display: "flex",
            flexDirection: isExpanded ? "column" : "row",
            justifyContent: isExpanded ? "center" : "flex-start",
            alignItems: isExpanded ? "center" : "center",
          }}
          transition={springConfig}
        >
          {/* Image */}
          <motion.img
            alt={`Rabbit ${id}`}
            animate={{
              width: isExpanded ? "100%" : 86,
              height: isExpanded ? "auto" : 86,
            }}
            className="select-none object-cover"
            initial={false}
            layout="position"
            src="https://placehold.co/500x500"
            style={{
              borderRadius: isExpanded ? 24 : 12,
              aspectRatio: isExpanded ? "1/1" : undefined,
              order: isExpanded ? 2 : 1,
              maxWidth: isExpanded ? 280 : 86,
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "translate3d(0, 0, 0)",
            }}
            transition={{
              width: { duration: 0.5, ease: smoothEasing },
              height: { duration: 0.5, ease: smoothEasing },
            }}
          />

          {/* Text */}
          <motion.h1
            animate={{
              fontSize: isExpanded ? "1.5rem" : "1.125rem",
              marginLeft: isExpanded ? 0 : 16,
              marginBottom: isExpanded ? 16 : 0,
            }}
            className="select-none whitespace-nowrap font-semibold"
            initial={false}
            layout="position"
            style={{
              order: isExpanded ? 1 : 2,
              textAlign: isExpanded ? "center" : "left",
            }}
            transition={{
              fontSize: { duration: 0.5, ease: smoothEasing },
              marginLeft: { duration: 0.5, ease: smoothEasing },
              marginBottom: { duration: 0.5, ease: smoothEasing },
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
        className="flex flex-col items-center gap-3"
        initial={false}
        layout="position"
        transition={springConfig}
      >
        {rabbitIds.map((id) => (
          <Card
            id={id}
            isExpanded={expandedCard === id}
            key={id}
            onToggle={() => handleToggle(id)}
          />
        ))}
      </motion.div>
    </LayoutGroup>
  );
};
