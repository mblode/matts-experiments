"use client";
import { ThemeBackground } from "@/components/theme/theme-background";
import { ThemeFont } from "@/components/theme/theme-font";
import { ThemeStyle } from "@/components/theme/theme-style";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { themes } from "@/lib/themes";
import { CardBlock } from "@/components/block/card-block";
import { Header } from "@/components/ui/header";

export default function Page() {
  const [themeContent, setThemeContent] = useState<any>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomIndex];
    setThemeContent(JSON.parse(randomTheme?.content));
  }, []);

  const handleShuffleClick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomIndex];
    setThemeContent(JSON.parse(randomTheme?.content));
  }, []);

  return (
    <>
      <div className="p-8 bg-background">
        <div className="mx-auto max-w-4xl">
          <Header id="shuffle-theme" />
          <Button onClick={handleShuffleClick}>Shuffle theme</Button>
        </div>
      </div>

      <ThemeBackground content={themeContent} />
      <ThemeStyle content={themeContent} />
      <ThemeFont content={themeContent} />

      <div className="relative flex h-full flex-col">
        <div className="relative z-1 w-full font-page-body font-page-body-weight text-page-text">
          <div className="relative z-30 mx-auto w-full max-w-[480px]">
            <div className="p-4 gap-4 flex flex-col">
              {[
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 },
                { id: 5 },
                { id: 6 },
              ].map((item) => (
                <CardBlock key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
