// CodePen packages: @beautiful-qr-code/react@^1.0.7, @radix-ui/react-label@^2.1.8, @radix-ui/react-separator@^1.1.8, class-variance-authority@^0.7.1, clsx@^2.1.1, culori@^4.0.2, lucide-react@^0.562.0, react-dom@19.2.3, react@19.2.3, tailwind-merge@^3.4.0

import { BeautifulQRCode, type BeautifulQRCodeRef } from "@beautiful-qr-code/react";
import { formatHex, oklch } from "culori";
import { Check, CircleXIcon, Download } from "lucide-react";
import * as React from "react";
import { ComponentProps, forwardRef, type InputHTMLAttributes, type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Root as LabelRoot } from "@radix-ui/react-label";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Root as SeparatorRoot } from "@radix-ui/react-separator";
import { createRoot } from "react-dom/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );

  d.push("Z");
  return d.join(" ");
}

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

const unsplashLoader = ({
  src,
  width,
  quality,
  blur,
  cropX,
  cropY,
  cropW,
  cropH,
}: {
  src: string;
  width: number;
  quality?: number;
  blur?: number;
  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
}) => {
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (quality) {
    params.set("q", quality.toString());
  }
  if (blur) {
    params.set("blur", blur.toString());
  }
  if (cropX) {
    params.set("rect", `${cropX},${cropY},${cropW},${cropH}`);
  }

  return `${src}?${params.toString()}`;
};

function Label({ className, ...props }: ComponentProps<typeof LabelRoot>) {
  return (
    <LabelRoot
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorRoot>) {
  return (
    <SeparatorRoot
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
        className
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      data-slot="field-set"
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      data-slot="field-group"
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"fieldset"> & VariantProps<typeof fieldVariants>) {
  return (
    <fieldset
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="field"
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      data-slot="field-content"
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-normal text-muted-foreground text-sm leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      data-content={!!children}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error) => {
          const message = error?.message;
          if (!message) {
            return null;
          }
          return <li key={message}>{message}</li>;
        })}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      className={cn("font-normal text-destructive text-sm", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  clearClassName?: string;
  leftAddon?: ReactNode | null;
  rightAddon?: ReactNode | null;
  leftControl?: ReactNode | null;
  rightControl?: ReactNode | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      clearClassName,
      hasError,
      clearable,
      onClear,
      leftAddon,
      rightAddon,
      leftControl,
      rightControl,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn("relative w-full", {
          "input-group": !!leftAddon || !!rightAddon,
        })}
      >
        {leftAddon && (
          <span className="shrink-0 cursor-pointer">{leftAddon}</span>
        )}

        {leftControl && (
          <div className="absolute top-0 left-0 flex h-full flex-row place-items-center items-center justify-center">
            {leftControl}
          </div>
        )}

        <div className="w-full">
          <input
            className={cn(
              "input flex h-[48px] w-full rounded-[4px] border border-input bg-input px-3 py-[12px] font-normal font-sans text-foreground text-sm leading-snug transition-colors placeholder:text-placeholder-foreground hover:border-input-hover focus:border-ring focus:bg-card focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              {
                "border-destructive-foreground": hasError,
                "pr-9": clearable && !!props.value,
                "hover:border-input! focus:border-input!": props.readOnly,
              },
              className
            )}
            ref={ref}
            {...props}
          />

          {clearable && !!props.value && (
            <div className="absolute top-0 right-0 flex flex-row gap-1 pr-3">
              <button
                aria-label="clear input"
                className={cn(
                  "flex h-[48px] cursor-pointer items-center justify-center p-0! text-muted-foreground",
                  clearClassName
                )}
                onClick={() => onClear?.()}
                tabIndex={-1}
                type="button"
              >
                <CircleXIcon className="size-5 text-muted-foreground/50" />
              </button>
            </div>
          )}
        </div>

        {rightControl && (
          <div className="absolute top-0 right-0 flex h-full flex-row place-items-center items-center justify-center">
            {rightControl}
          </div>
        )}

        {rightAddon && (
          <span className="shrink-0 cursor-pointer">{rightAddon}</span>
        )}
      </label>
    );
  }
);
Input.displayName = "Input";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Color {
  hue: number;
  saturation: number;
  lightness: number;
  oklch: string;
}

interface SaturationLevel {
  sat: number;
  lightness: number;
  hue: number;
}

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

const GRID_SIZE = 4;
const COLORS_PER_ROW = 4;
const CHROMATIC_COLORS = 16;
const HUE_STEP = 360 / CHROMATIC_COLORS;
const OKLCH_REGEX = /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/;

function formatOklch(
  lightness: number,
  chroma: number,
  hue: number
): string {
  return `oklch(${lightness} ${chroma} ${hue})`;
}

function createBackgroundColor(foregroundColor: string): string {
  const { l, c, h } = parseOklch(foregroundColor);

  // If foreground is light (>= 0.8), use a dark background
  if (l >= 0.8) {
    return formatOklch(0.15, c * 0.5, h); // Dark background with subtle hue
  }

  // If foreground is dark, use a light background
  return formatOklch(0.98, c * 0.3, h); // Light background with very subtle hue
}

// Generate color palette with OKLCH colors
const generateColorPalette = (saturation: number): Color[] => {
  const colors: Color[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < COLORS_PER_ROW; col++) {
      const hue = (row * COLORS_PER_ROW + col) * HUE_STEP;
      colors.push({
        hue,
        saturation,
        lightness: 0.65,
        oklch: `oklch(0.65 ${saturation} ${hue})`,
      });
    }
  }
  return colors;
};

// Generate saturation levels based on current hue
const generateSaturationLevels = (hue: number): SaturationLevel[] => [
  { sat: 0.25, lightness: 0.58, hue },
  { sat: 0.2, lightness: 0.6, hue },
  { sat: 0.15, lightness: 0.62, hue },
  { sat: 0.1, lightness: 0.65, hue },
  { sat: 0.05, lightness: 0.68, hue },
];

// Grayscale colors
const GRAYSCALE_LIGHTNESS_LEVELS = [0, 0.33, 0.66, 1.0] as const;

const generateGrayscaleRow = (): Color[] => {
  return GRAYSCALE_LIGHTNESS_LEVELS.map((lightness) => ({
    hue: 0,
    saturation: 0,
    lightness,
    oklch: `oklch(${lightness} 0 0)`,
  }));
};

// Helper to parse OKLCH string
const parseOklch = (
  oklchString: string
): { l: number; c: number; h: number } => {
  const match = oklchString.match(OKLCH_REGEX);
  if (!match) {
    return { l: 0.65, c: 0.2, h: 0 };
  }
  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
};

// Helper to convert OKLCH to hex for QR code
function oklchToHex(l: number, c: number, h: number): string {
  try {
    const color = oklch({ l, c, h, mode: "oklch" });
    return formatHex(color) || "#000000";
  } catch (error) {
    console.error("Error converting OKLCH to HEX:", error);
    return "#000000";
  }
}

function QRCodeBlock() {
  const [url, setUrl] = useState("https://example.com");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [rememberedSaturationIndex, setRememberedSaturationIndex] = useState(2); // Start at middle saturation
  const [radius, setRadius] = useState<0 | 0.5 | 1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref for QR code component to access download methods
  const qrRef = useRef<BeautifulQRCodeRef>(null);

  // Generate color palette based on remembered saturation index
  const selectedSaturation = useMemo(() => {
    // Get a reference hue from selected color index (use default if grayscale)
    const isGrayscale = selectedColorIndex >= CHROMATIC_COLORS;
    const tempHue = isGrayscale ? 0 : selectedColorIndex * HUE_STEP;
    const levels = generateSaturationLevels(tempHue);
    return levels[rememberedSaturationIndex].sat;
  }, [rememberedSaturationIndex, selectedColorIndex]);

  const colorPalette = useMemo(
    () => [
      ...generateColorPalette(selectedSaturation),
      ...generateGrayscaleRow(),
    ],
    [selectedSaturation]
  );

  const selectedColor = colorPalette[selectedColorIndex];

  // Get current color's OKLCH values from the dynamic palette
  const currentOklch = useMemo(() => {
    return selectedColor
      ? parseOklch(selectedColor.oklch)
      : { l: 0.65, c: 0.15, h: 0 };
  }, [selectedColor]);

  const saturationLevels = useMemo(
    () => generateSaturationLevels(currentOklch.h),
    [currentOklch.h]
  );

  const saturationIndex = rememberedSaturationIndex;

  // Safety check - don't render QR if color is undefined
  const hasValidColor = selectedColor?.oklch && selectedColor.oklch.length > 0;

  const handleColorSelect = useCallback((index: number) => {
    setSelectedColorIndex(index);
  }, []);

  const handleSaturationClick = useCallback(() => {
    const maxIndex = saturationLevels.length - 1;
    const isCycling = saturationIndex === maxIndex;

    // Only trigger animation when cycling from last to first
    if (isCycling) {
      setIsAnimating(true);
      // Reset animation flag after animation completes
      // Animation duration: 150ms + (4 bars * 150ms stagger) = 750ms total
      setTimeout(() => setIsAnimating(false), 750);
    }

    // Cycle through saturation levels, wrapping back to 0
    const nextIndex = isCycling ? 0 : saturationIndex + 1;

    // Update the remembered saturation index, which will trigger palette regeneration
    // The same selectedColorIndex will now point to a color with the new saturation
    setRememberedSaturationIndex(nextIndex);
  }, [saturationIndex, saturationLevels]);

  // Download handlers
  const handleDownloadPNG = useCallback(() => {
    qrRef.current?.download({ name: "qr-code", extension: "png" });
  }, []);

  const handleDownloadSVG = useCallback(() => {
    qrRef.current?.download({ name: "qr-code", extension: "svg" });
  }, []);

  // Ensure URL is valid for QR code rendering
  const validUrl = url.trim() || "https://example.com";

  // Convert OKLCH to hex for the QR code
  const qrColor = useMemo(() => {
    if (!hasValidColor) {
      return "#000000";
    }
    const { l, c, h } = parseOklch(selectedColor.oklch);
    return oklchToHex(l, c, h);
  }, [hasValidColor, selectedColor]);

  // Generate contrasting background color
  const backgroundColor = useMemo(() => {
    if (!hasValidColor) {
      return "#ffffff";
    }
    const bgOklch = createBackgroundColor(selectedColor.oklch);
    const { l, c, h } = parseOklch(bgOklch);
    return oklchToHex(l, c, h);
  }, [hasValidColor, selectedColor]);

  return (
    <div className="grid gap-1 p-1 lg:grid-cols-2">
      {/* Left: QR Preview */}
      <div
        className="relative flex items-center justify-center rounded-3xl p-12"
        style={{ background: backgroundColor }}
      >
        <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center lg:max-w-[300px]">
          {hasValidColor ? (
            <div>
              <BeautifulQRCode
                backgroundColor={backgroundColor}
                className="flex aspect-square w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                data={validUrl}
                foregroundColor={qrColor}
                hasLogo={!!imageUrl}
                logoUrl={imageUrl || undefined}
                padding={5}
                radius={radius}
                ref={qrRef}
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full max-w-sm items-center justify-center text-gray-400">
              Enter data to generate QR code
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center justify-center rounded-3xl bg-gray-100 px-4 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-[600px] space-y-1">
          {/* URL Input */}
          <Field
            className="min-h-14 gap-0 rounded-full bg-white"
            orientation="horizontal"
          >
            <FieldLabel className="min-w-[200px] cursor-pointer px-6 py-2">
              URL
            </FieldLabel>
            <Input
              className="h-14 rounded-full border-0 bg-transparent! focus-visible:ring-0"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              value={url}
            />
          </Field>

          {/* Image URL Input */}
          <Field
            className="min-h-14 gap-0 rounded-full bg-white"
            orientation="horizontal"
          >
            <FieldLabel className="min-w-[200px] cursor-pointer px-6 py-2">
              Image URL
            </FieldLabel>
            <Input
              className="h-14 rounded-full border-0 bg-transparent! focus-visible:ring-0"
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              value={imageUrl}
            />
          </Field>

          {/* Hue and Saturation Picker */}
          <div className="flex flex-row flex-wrap items-start justify-between gap-2 rounded-3xl bg-white p-2">
            <Label className="p-4">Hue and saturation</Label>

            <div className="flex size-full min-w-[276px] gap-2 sm:max-w-[276px]">
              {/* Color grid */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {[0, 1, 2, 3].map((row) => {
                  const selectedRow = Math.floor(selectedColorIndex / 4);
                  const selectedCol = selectedColorIndex % 4;
                  const isSelectedRow = row === selectedRow;
                  const rowHeight = isSelectedRow ? 72 : 36;

                  return (
                    <div
                      className="flex gap-2 transition-all duration-300 ease-out"
                      key={row}
                      style={{ height: rowHeight }}
                    >
                      {[0, 1, 2, 3].map((col) => {
                        const index = row * 4 + col;
                        const color = colorPalette[index];
                        const isSelected = selectedColorIndex === index;
                        const isSelectedCol = col === selectedCol;

                        const widthFraction = isSelectedCol ? 2 : 1;
                        const totalFractions = 5;
                        const widthPercent =
                          (widthFraction / totalFractions) * 100;

                        return (
                          <button
                            aria-label={`Hue ${color.hue}`}
                            className="relative cursor-pointer overflow-hidden transition-all duration-300 ease-out active:scale-95"
                            key={index}
                            onClick={() => handleColorSelect(index)}
                            style={{
                              backgroundColor: color.oklch,
                              borderRadius: 20,
                              border: "none",
                              height: "100%",
                              width: `${widthPercent}%`,
                            }}
                            type="button"
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check
                                  className="relative z-10 size-4 text-white"
                                  strokeWidth={4}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Grayscale row */}
                {(() => {
                  const selectedRow = Math.floor(
                    selectedColorIndex / COLORS_PER_ROW
                  );
                  const selectedCol = selectedColorIndex % COLORS_PER_ROW;
                  const grayscaleRow = GRID_SIZE;
                  const isSelectedRow = selectedRow === grayscaleRow;
                  const rowHeight = isSelectedRow ? 72 : 36;

                  return (
                    <div
                      className="flex gap-2 transition-all duration-300 ease-out"
                      style={{ height: rowHeight }}
                    >
                      {generateGrayscaleRow().map((color, col) => {
                        const grayscaleIndex = CHROMATIC_COLORS + col;
                        const isSelected =
                          selectedColorIndex === grayscaleIndex;
                        const isSelectedCol = col === selectedCol;

                        const widthFraction = isSelectedCol ? 2 : 1;
                        const totalFractions = 5;
                        const widthPercent =
                          (widthFraction / totalFractions) * 100;

                        const isWhite = color.lightness >= 0.95;
                        const boxShadow = isWhite
                          ? "inset 0 0 0 1px rgba(0, 0, 0, 0.1)"
                          : "none";

                        return (
                          <button
                            aria-label={`Grayscale ${Math.round(
                              color.lightness * 100
                            )}%`}
                            className="relative cursor-pointer overflow-hidden transition-all duration-300 ease-out active:scale-95"
                            key={grayscaleIndex}
                            onClick={() => handleColorSelect(grayscaleIndex)}
                            style={{
                              backgroundColor: color.oklch,
                              borderRadius: 20,
                              boxShadow,
                              height: "100%",
                              width: `${widthPercent}%`,
                            }}
                            type="button"
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check
                                  className={`relative z-10 size-4 ${
                                    color.lightness < 0.5
                                      ? "text-white"
                                      : "text-black"
                                  }`}
                                  strokeWidth={4}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Saturation selector */}
              <button
                aria-label="Cycle saturation levels"
                className="cursor-pointer bg-gray-100 p-2 transition-transform duration-200 ease-out active:scale-[0.97]"
                onClick={handleSaturationClick}
                style={{
                  borderRadius: 20,
                  width: 64,
                }}
                type="button"
              >
                <div className="flex h-full flex-col justify-end gap-2">
                  {saturationLevels.map((level, index) => {
                    if (index < saturationIndex) {
                      return null;
                    }

                    // Calculate stagger delay: top bar appears first, bottom bar last
                    const totalBars = saturationLevels.length - saturationIndex;
                    const distanceFromTop = index - saturationIndex;
                    const staggerDelay =
                      (totalBars - distanceFromTop - 1) * 150; // 150ms between each

                    const levelKey = `${level.hue}-${level.sat}-${level.lightness}`;

                    return (
                      <div
                        className="relative transition-transform duration-200 ease-out [@media(hover:hover)]:hover:scale-[1.03]"
                        key={levelKey}
                        style={{
                          backgroundColor: `oklch(${level.lightness} ${level.sat} ${level.hue})`,
                          borderRadius: 12,
                          height: 40,
                          border: "none",
                          transformOrigin: "bottom",
                          animation: isAnimating
                            ? `scaleIn 150ms cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}ms backwards`
                            : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </button>
            </div>
          </div>

          {/* Corner Radius */}
          <div className="flex min-h-14 w-full flex-row rounded-3xl bg-white">
            <Label className="min-w-[200px] py-4 pr-4 pl-6">Corners</Label>

            <div className="flex w-full flex-row items-center justify-end">
              {([0, 0.5, 1] as const).map((value) => {
                const SIZE = 40;
                const isSelected = radius === value;
                const isWhite =
                  hasValidColor && selectedColor.lightness >= 0.95;
                const boxShadow = isWhite
                  ? "inset 0 0 0 1px rgba(0, 0, 0, 0.1)"
                  : "none";
                const colorOklch = hasValidColor
                  ? selectedColor.oklch
                  : "oklch(0 0 0)";

                return (
                  <button
                    className="cursor-pointer py-2 pr-2"
                    key={value}
                    onClick={() => setRadius(value)}
                    type="button"
                  >
                    <div
                      className="relative cursor-pointer transition-transform duration-200 ease-out active:scale-95 [@media(hover:hover)]:hover:scale-105"
                      style={{
                        borderRadius: (value * SIZE) / 2,
                        background: colorOklch,
                        boxShadow,
                        width: SIZE,
                        height: SIZE,
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className={`relative z-10 size-4 ${
                              hasValidColor && selectedColor.lightness < 0.7
                                ? "text-white"
                                : "text-black"
                            }`}
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex min-h-14 w-full flex-row rounded-3xl bg-white">
            <Label className="min-w-[200px] py-4 pr-4 pl-6">Download</Label>

            <div className="flex w-full flex-row items-center justify-end gap-2 pr-2">
              <button
                aria-label="Download SVG"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 transition-all duration-200 ease-out active:scale-95 [@media(hover:hover)]:hover:bg-gray-200"
                onClick={handleDownloadSVG}
                type="button"
              >
                <Download className="size-4" />
                <span className="font-medium text-sm">SVG</span>
              </button>

              <button
                aria-label="Download PNG"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 transition-all duration-200 ease-out active:scale-95 [@media(hover:hover)]:hover:bg-gray-200"
                onClick={handleDownloadPNG}
                type="button"
              >
                <Download className="size-4" />
                <span className="font-medium text-sm">PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <formatOklch />
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);
