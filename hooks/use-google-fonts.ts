import { useEffect, useState } from "react";

type FontConfig = {
  family: string;
  weights?: string[];
  style?: string;
};

type FontStatus = {
  loaded: boolean;
  error: boolean;
};

export const useGoogleFonts = (fontConfigs: FontConfig[]): FontStatus => {
  const [status, setStatus] = useState<FontStatus>({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    // Create a map to deduplicate font families and collect their variants (weights + styles)
    const fontMap = new Map<string, Set<string>>();

    // Process all font configurations
    fontConfigs.forEach((config) => {
      const { family, weights = [], style = "" } = config;

      // Skip empty families or Helvetica Neue (which is system font)
      if (!family || family.toLowerCase() === "helvetica neue") {
        return;
      }

      if (!fontMap.has(family)) {
        fontMap.set(family, new Set<string>());
      }

      const fontVariants = fontMap.get(family)!;

      // If no weights specified, add default with the specified style
      if (weights.length === 0) {
        const variant = style ? `${style},400` : "400";
        fontVariants.add(variant);
        return;
      }

      // Add all combinations of weights and styles
      weights.forEach((weight) => {
        if (weight && weight.trim() !== "") {
          const variant = style ? `${style},${weight}` : weight;
          fontVariants.add(variant);
        }
      });
    });

    // No fonts to load
    if (fontMap.size === 0) {
      setStatus({ loaded: true, error: false });
      return;
    }

    // Create link elements for each unique font family
    const links: HTMLLinkElement[] = [];
    let pendingLoads = fontMap.size;
    let hasError = false;

    fontMap.forEach((variants, family) => {
      // Format the font URL based on variants
      let paramString = "";

      const variantsArray = [...variants];
      const hasItalic = variantsArray.some((v) => v.includes("italic"));
      const hasWeight = variantsArray.some(
        (v) => !v.includes("italic") || v.includes(","),
      );

      if (hasItalic && hasWeight) {
        // Handle combined weight and style (ital,wght@0,400;1,400;etc)
        const axisParams: string[] = [];
        variants.forEach((variant) => {
          if (variant.includes("italic")) {
            const weight = variant.includes(",")
              ? variant.split(",")[1]
              : "400";
            axisParams.push(`1,${weight}`);
          } else {
            axisParams.push(`0,${variant}`);
          }
        });
        // Sort axis params by weight (second part of each param)
        axisParams.sort((a, b) => {
          const weightA = parseInt(a.split(",")[1]);
          const weightB = parseInt(b.split(",")[1]);
          const italicA = parseInt(a.split(",")[0]);
          const italicB = parseInt(b.split(",")[0]);
          // Sort by weight first, then by italic flag
          return weightA - weightB || italicA - italicB;
        });
        paramString = `:ital,wght@${axisParams.join(";")}`;
      } else if (hasItalic) {
        // Only italic styles
        paramString = `:ital@1`;
      } else {
        // Only weights - sort numerically
        const sortedWeights = variantsArray.sort(
          (a, b) => parseInt(a) - parseInt(b),
        );
        paramString = `:wght@${sortedWeights.join(";")}`;
      }

      const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}${paramString}&display=swap`;

      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href="${url}"]`);
      if (existingLink) {
        pendingLoads--;
        if (pendingLoads === 0) {
          setStatus({ loaded: true, error: hasError });
        }
        return;
      }

      const link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";

      link.onload = () => {
        pendingLoads--;
        if (pendingLoads === 0) {
          setStatus({ loaded: true, error: hasError });
        }
      };

      link.onerror = () => {
        hasError = true;
        pendingLoads--;
        if (pendingLoads === 0) {
          setStatus({ loaded: true, error: true });
        }
      };

      document.head.appendChild(link);
      links.push(link);
    });

    // If no links were added, all fonts were already loaded
    if (links.length === 0) {
      setStatus({ loaded: true, error: false });
    }

    // Cleanup function
    return () => {
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [fontConfigs]);

  return status;
};
