import { useEffect, useState } from "react";

interface FontConfig {
  family: string;
  weights?: string[];
  style?: string;
}

interface FontStatus {
  loaded: boolean;
  error: boolean;
}

const isSystemFont = (family: string) =>
  family.toLowerCase() === "helvetica neue";

const buildFontMap = (fontConfigs: FontConfig[]) => {
  const fontMap = new Map<string, Set<string>>();

  for (const config of fontConfigs) {
    const { family, weights = [], style = "" } = config;

    if (!family || isSystemFont(family)) {
      continue;
    }

    const fontVariants = fontMap.get(family) ?? new Set<string>();

    if (weights.length === 0) {
      const variant = style ? `${style},400` : "400";
      fontVariants.add(variant);
      fontMap.set(family, fontVariants);
      continue;
    }

    for (const weight of weights) {
      if (weight && weight.trim() !== "") {
        const variant = style ? `${style},${weight}` : weight;
        fontVariants.add(variant);
      }
    }

    fontMap.set(family, fontVariants);
  }

  return fontMap;
};

const buildFontUrl = (family: string, variants: Set<string>) => {
  const variantsArray = [...variants];
  const hasItalic = variantsArray.some((variant) => variant.includes("italic"));
  const hasWeight = variantsArray.some(
    (variant) => !variant.includes("italic") || variant.includes(",")
  );

  if (hasItalic && hasWeight) {
    const axisParams: string[] = [];
    for (const variant of variants) {
      if (variant.includes("italic")) {
        const weight = variant.includes(",") ? variant.split(",")[1] : "400";
        axisParams.push(`1,${weight}`);
      } else {
        axisParams.push(`0,${variant}`);
      }
    }
    axisParams.sort((a, b) => {
      const weightA = Number.parseInt(a.split(",")[1], 10);
      const weightB = Number.parseInt(b.split(",")[1], 10);
      const italicA = Number.parseInt(a.split(",")[0], 10);
      const italicB = Number.parseInt(b.split(",")[0], 10);
      return weightA - weightB || italicA - italicB;
    });
    return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:ital,wght@${axisParams.join(";")}&display=swap`;
  }

  if (hasItalic) {
    return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:ital@1&display=swap`;
  }

  const sortedWeights = variantsArray.sort(
    (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  );
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${sortedWeights.join(";")}&display=swap`;
};

export const useGoogleFonts = (fontConfigs: FontConfig[]): FontStatus => {
  const [status, setStatus] = useState<FontStatus>({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    const fontMap = buildFontMap(fontConfigs);

    // No fonts to load
    if (fontMap.size === 0) {
      setStatus({ loaded: true, error: false });
      return;
    }

    // Create link elements for each unique font family
    const links: HTMLLinkElement[] = [];
    let pendingLoads = fontMap.size;
    let hasError = false;
    const updateStatus = () => {
      if (pendingLoads === 0) {
        setStatus({ loaded: true, error: hasError });
      }
    };

    for (const [family, variants] of fontMap) {
      const url = buildFontUrl(family, variants);

      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href="${url}"]`);
      if (existingLink) {
        pendingLoads -= 1;
        updateStatus();
        continue;
      }

      const link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";

      link.onload = () => {
        pendingLoads -= 1;
        updateStatus();
      };

      link.onerror = () => {
        hasError = true;
        pendingLoads -= 1;
        updateStatus();
      };

      document.head.appendChild(link);
      links.push(link);
    }

    // If no links were added, all fonts were already loaded
    if (links.length === 0) {
      setStatus({ loaded: true, error: hasError });
    }

    // Cleanup function
    return () => {
      for (const link of links) {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      }
    };
  }, [fontConfigs]);

  return status;
};
