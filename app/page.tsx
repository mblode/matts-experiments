"use client";
import { ThemeBackground } from "@/components/theme/theme-background";
import { ThemeFont } from "@/components/theme/theme-font";
import { ThemeStyle } from "@/components/theme/theme-style";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { themes } from "@/lib/themes";
import { CardBlock } from "@/components/block/card-block";
import { FaqBlock } from "@/components/block/faq-block";
import { SheetBlock } from "@/components/block/sheet-block";
import { AlbumBlock } from "@/components/block/album-block";
import TabsBlock from "@/components/block/tabs-block";
import { PromiseBlock } from "@/components/block/promise-block";
import { IosCardsBlock } from "@/components/block/ios-cards-block";
import { DynamicIslandBlock } from "@/components/block/dynamic-island-block";

export default function Home() {
  const [themeContent, setThemeContent] = useState<any>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomIndex];
    setThemeContent(JSON.parse(randomTheme?.content));
  }, [themes]);

  const handleShuffleClick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomTheme = themes[randomIndex];
    setThemeContent(JSON.parse(randomTheme?.content));
  }, [themes]);

  return (
    <>
      <ThemeBackground content={themeContent} />
      <ThemeStyle content={themeContent} />
      <ThemeFont content={themeContent} />

      <div className="relative flex h-full flex-col">
        <div className="relative z-1 w-full font-page-body font-page-body-weight text-page-text">
          <div className="relative z-30 mx-auto w-full max-w-[480px]">
            <div className="px-4">
              <Button onClick={handleShuffleClick}>Shuffle theme</Button>

              <h1 className="min-w-0 font-page-heading-weight font-page-heading text-4xl tracking-tight leading-[1.2] w-full">
                Title
              </h1>

              <p className="text-fluid-lg font-page-body font-page-body-weight break-words">
                Eu veniam aliquip anim duis aute ullamco cillum laborum eu amet
                id duis anim excepteur. Exercitation occaecat qui adipisicing
                excepteur consequat est. Labore minim labore sit ullamco ad
                laboris sit. Mollit amet aliquip irure anim pariatur occaecat
                nulla dolor reprehenderit voluptate mollit. Sit veniam deserunt
                et.
              </p>
            </div>

            <div className="p-4">
              <FaqBlock />
              <SheetBlock />
              <AlbumBlock />
              <TabsBlock />
              <PromiseBlock />
              <IosCardsBlock />
              <DynamicIslandBlock />
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
