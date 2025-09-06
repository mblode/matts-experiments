"use client";
import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";

interface DateCardProps {
  day: number;
  isExpanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function DateCard({ day, isExpanded, onToggle, disabled }: DateCardProps) {
  return (
    <motion.div 
      className="w-64"
      layout
      initial={false}
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <div className="flex flex-col">
        {/* Main card container */}
        <motion.div
          className="relative rounded-2xl shadow-lg cursor-pointer overflow-hidden w-64 flex items-center justify-center"
          onClick={disabled ? undefined : onToggle}
          initial={false}
          animate={{
            height: isExpanded ? 160 : 64,
            backgroundColor: isExpanded ? "#001f3f" : "#ffffff",
            opacity: disabled ? 0.3 : 1,
          }}
          whileHover={!disabled && !isExpanded ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          transition={{
            height: { duration: 0.3, ease: "easeInOut" },
            backgroundColor: { duration: 0.4, ease: "easeInOut" },
            opacity: { duration: 0.2, ease: "easeInOut" },
            scale: { duration: 0.15 }
          }}
        >
          {/* Text with transform for position */}
          <motion.h1
            className="font-extrabold m-0 absolute"
            initial={false}
            animate={{
              fontSize: isExpanded ? "5rem" : "1.5rem",
              color: isExpanded ? "#ffffff" : "#001f3f",
              y: isExpanded ? 30 : 0,
            }}
            transition={{
              fontSize: { duration: 0.3, ease: "easeInOut" },
              color: { duration: 0.4, ease: "easeInOut" },
              y: { duration: 0.3, ease: "easeInOut" }
            }}
            style={{ 
              lineHeight: 1,
            }}
          >
            {day}
          </motion.h1>
        </motion.div>
        
        {/* Secondary info card */}
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0, marginTop: 0 }}
          animate={{
            height: isExpanded ? 48 : 0,
            marginTop: isExpanded ? 8 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut"
          }}
        >
          <motion.p
            className="bg-white text-black h-10 p-2 flex justify-center items-center w-64 rounded-xl shadow-md box-border cursor-pointer"
            onClick={onToggle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isExpanded ? 1 : 0,
              y: isExpanded ? 0 : -10
            }}
            transition={{ 
              duration: 0.2,
              delay: isExpanded ? 0.15 : 0
            }}
          >
            Day {day} - Today is clear
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export const ExpandBlock = () => {
  const [expandedDay, setExpandedDay] = useState<number | undefined>();
  const days = [25, 26, 27, 28, 29];

  const handleToggle = (day: number) => {
    setExpandedDay(expandedDay === day ? undefined : day);
  };

  return (
    <div className="font-sans p-8">
      <p className="mb-8 text-center">
        Click on any date to expand it. Click another date to switch.
      </p>
      <LayoutGroup>
        <motion.div 
          className="flex flex-col gap-4 items-center"
          layout
          initial={false}
        >
          {days.map((day) => (
            <DateCard
              key={day}
              day={day}
              isExpanded={expandedDay === day}
              disabled={expandedDay !== undefined && expandedDay !== day}
              onToggle={() => handleToggle(day)}
            />
          ))}
        </motion.div>
      </LayoutGroup>
    </div>
  );
};