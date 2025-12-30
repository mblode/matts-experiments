"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        error: (
          <div className="relative inline-flex h-5 w-5 animate-[wobble_0.5s_ease-in-out_0.3s] items-center justify-center">
            <svg
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" fill="#FF403F" r="9" />
              <text
                fill="white"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                x="10"
                y="14"
              >
                !
              </text>
            </svg>
          </div>
        ),
        success: (
          <div className="relative inline-flex h-5 w-5 items-center justify-center">
            <svg
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" fill="#35C759" r="9" />
              <path
                d="M6 10L9 13L14 7"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        ),
        loading: (
          <div className="relative mt-0.5 inline-flex h-5 w-5 items-center justify-center">
            <svg
              className="animate-spin"
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                stroke="#4EAFFF"
                strokeDasharray="32"
                strokeDashoffset="8"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast:
            "!shadow-none !border-none !rounded-full !text-base !font-semibold [&[data-type='error']]:!bg-[#FFE4E3] [&[data-type='error']]:!text-[#FF403F] [&[data-type='success']]:!bg-[#DBF4DE] [&[data-type='success']]:!text-[#35C759] [&[data-type='loading']]:!bg-[#E5F3FF] [&[data-type='loading']]:!text-[#4EAFFF]",
          icon: "!mt-0 !self-center [&[data-type='error']_svg]:!text-[#FF403F] [&[data-type='success']_svg]:!text-[#35C759] [&[data-type='loading']_svg]:!text-[#4EAFFF]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
