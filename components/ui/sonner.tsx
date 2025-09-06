"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!shadow-none !rounded-full [&[data-type='error']]:!bg-[#FFE4E3] [&[data-type='error']]:!text-[#FF403F] [&[data-type='success']]:!bg-[#DBF4DE] [&[data-type='success']]:!text-[#35C759] [&[data-type='loading']]:!bg-[#E5F3FF] [&[data-type='loading']]:!text-[#4EAFFF]",
          icon: "!mt-0 !self-center [&[data-type='error']_svg]:!text-[#FF403F] [&[data-type='success']_svg]:!text-[#35C759] [&[data-type='loading']_svg]:!text-[#4EAFFF]",
        },
      }}
      icons={{
        error: (
          <div className="relative inline-flex items-center justify-center w-5 h-5 animate-[wobble_0.5s_ease-in-out_0.3s]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9" fill="#FF403F" />
              <text
                x="10"
                y="14"
                fontSize="11"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                !
              </text>
            </svg>
          </div>
        ),
        success: (
          <div className="relative inline-flex items-center justify-center w-5 h-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="9" fill="#35C759" />
              <path
                d="M6 10L9 13L14 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ),
        loading: (
          <div className="relative inline-flex items-center justify-center w-5 h-5">
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="7"
                stroke="#4EAFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="8"
              />
            </svg>
          </div>
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }
