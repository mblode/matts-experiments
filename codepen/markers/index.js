import * as React from "react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createRoot } from "react-dom/client";
const styles = {
  "bookmark": "bookmark",
  "bookmarkShow": "bookmarkShow",
  "chapterIndicators": "chapterIndicators",
  "chaptermark": "chaptermark",
  "dot": "dot",
  "flash": "flash",
  "progress": "progress",
  "progressBar": "progressBar",
  "progressShow": "progressShow",
  "scope": "scope",
  "text": "text"
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getSvgPathFromStroke(stroke) {
  if (!stroke.length) {
    return "";
  }
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );
  d.push("Z");
  return d.join(" ");
}
const imageLoader = ({
  src,
  width,
  quality
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
  cropH
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
const SCROLL_THRESHOLD = 120;
function ProgressBar({ show, progress }) {
  return /* @__PURE__ */ React.createElement("div", { className: cn(styles.progress, show && styles.progressShow) }, /* @__PURE__ */ React.createElement("div", { className: styles.progressBar, style: { height: `${progress}vh` } }));
}
function ChapterIndicator({
  marker,
  show
}) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById(marker.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ React.createElement(
    "a",
    {
      className: cn(
        styles.bookmark,
        styles.chaptermark,
        show && styles.bookmarkShow
      ),
      href: `#${marker.id}`,
      onClick: handleClick,
      style: { top: `${marker.position}vh` }
    },
    /* @__PURE__ */ React.createElement("div", { className: styles.dot }),
    /* @__PURE__ */ React.createElement("div", { className: styles.text }, /* @__PURE__ */ React.createElement("span", null, marker.title))
  );
}
const sections = [
  {
    id: "introduction",
    title: "Lorem Ipsum Overview",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis semper sem, vitae facilisis metus bibendum eget. Sed faucibus metus ac tristique euismod, ac euismod lacus dapibus. Nunc laoreet, sapien id ultricies ultrices, urna nisl vehicula metus, ac iaculis sem ligula et mauris.

Aliquam erat volutpat. Aenean faucibus, arcu vitae sodales commodo, velit nibh varius arcu, non ultricies ipsum orci sit amet lacus. Phasellus ut augue fringilla, vulputate lectus ac, pharetra ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur interdum massa vitae volutpat pharetra.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent suscipit ex id magna fermentum, eget viverra metus luctus. Quisque malesuada dictum interdum, et lobortis arcu faucibus id. Cras vestibulum, leo in ultrices bibendum, massa nulla ultricies sapien, vitae porttitor mi nulla eget orci.

Nulla facilisi. Sed maximus, leo vitae iaculis ornare, dolor lorem pulvinar nibh, eu dapibus lacus leo at arcu. Integer aliquam est vel erat convallis, vitae porta est aliquam. Curabitur ac ipsum in odio viverra pellentesque sit amet vitae neque.`
  },
  {
    id: "why-ideas-matter",
    title: "Dolor Sit Amet",
    content: `Etiam efficitur, nunc in dapibus ultrices, ligula risus blandit arcu, vitae efficitur urna purus et purus. Integer scelerisque bibendum tincidunt. Proin elementum, mauris vitae sagittis ultrices, dui arcu auctor erat, a tempor dolor nisl id risus. Sed commodo, arcu nec euismod sodales, sem lorem posuere neque, sed facilisis mi enim at mi.

Phasellus euismod, lorem nec pharetra faucibus, arcu tortor tincidunt eros, vitae volutpat dui velit ut libero. Vivamus tincidunt velit turpis, eu posuere ligula dictum a. Sed gravida varius efficitur. Suspendisse eget consequat augue, sit amet blandit magna. Integer sodales neque id lacus pretium accumsan.

Mauris sit amet ex id orci imperdiet fermentum. Aliquam dapibus bibendum mauris, vel semper lectus facilisis id. Donec luctus justo vel justo blandit, sed volutpat lacus consectetur. Donec vitae mi non quam finibus suscipit et sed nisi.

Sed ultricies, urna at ornare euismod, risus libero porta lectus, nec cursus erat nisl nec risus. Pellentesque et justo lectus. Sed faucibus, nibh at maximus luctus, eros nibh rhoncus mi, vitae dignissim lorem nibh et velit.`
  },
  {
    id: "the-simple-argument",
    title: "Consequat Varius",
    content: `Curabitur eget sagittis urna. Nulla augue libero, cursus id purus vel, faucibus fringilla libero. Suspendisse potenti. Nullam quis malesuada urna, eget ultricies sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis dictum condimentum velit, id tempus tortor posuere id.

Donec sed felis a odio bibendum lobortis. Donec fermentum urna ante, id condimentum diam tincidunt vitae. Donec lacinia lacus vel consequat facilisis. Integer faucibus interdum porttitor. Maecenas pellentesque, enim ac volutpat varius, leo velit dignissim justo, sed vehicula eros elit sed urna.

Ut iaculis vulputate nisl, nec auctor erat vulputate ut. Sed nec sagittis nisl. Curabitur a laoreet eros. Nunc elementum mi a eros pellentesque, vitae finibus erat pulvinar. Nulla feugiat justo velit, vitae tincidunt eros volutpat in.

Vivamus viverra ipsum vel ipsum vehicula, vitae tempor nulla suscipit. Suspendisse at augue sed dui tempor tincidunt. Morbi quis fermentum nisl, vitae iaculis mi. Vivamus scelerisque, dui sed facilisis porttitor, nunc eros rhoncus arcu, id consequat lectus mi nec lectus.`
  },
  {
    id: "measuring-directly",
    title: "Measuring Lorem Directly",
    content: `Praesent et pharetra elit. Vestibulum ullamcorper vehicula eros, vitae molestie erat hendrerit at. Aenean tempus ipsum at varius dictum. In hac habitasse platea dictumst. Aliquam erat volutpat. Sed nec mi id tortor convallis ornare vel sed odio.

Donec dapibus malesuada sapien, vel interdum mauris tempus at. Suspendisse sollicitudin sem vitae nulla rhoncus, quis lacinia libero elementum. Vestibulum pretium risus non odio rhoncus tempor. Pellentesque vehicula, lacus id hendrerit auctor, libero metus malesuada erat, quis rhoncus sem dui id risus.

Integer sollicitudin posuere sapien, vel porttitor massa mattis sed. Integer euismod nisl at eros cursus gravida. Nunc fringilla sapien at velit iaculis auctor. Duis cursus tellus eget mi facilisis, ac auctor lacus cursus.

Nunc ornare, lacus et accumsan efficitur, mauris ipsum pulvinar nunc, quis dictum nisl turpis sed turpis. Donec tempor ultricies tortor sed lobortis. Suspendisse sit amet vulputate leo, sit amet posuere libero.`
  },
  {
    id: "the-fault-in-our-markets",
    title: "Habitant Tristique",
    content: `Suspendisse potenti. Vivamus tincidunt tellus et mattis dapibus. Mauris varius justo vitae commodo bibendum. Sed mattis ac dui sit amet malesuada. Donec eleifend diam ac magna malesuada, id commodo justo sodales. Proin pharetra turpis sit amet tortor sodales varius.

Vestibulum eget felis nulla. Sed scelerisque suscipit purus quis varius. Nulla facilisi. Vivamus sit amet malesuada velit. Nulla aliquam, justo id commodo semper, nibh sapien maximus neque, ac luctus mauris sapien sit amet est.

Integer id velit nec tortor aliquet facilisis. Aenean non massa quis augue ullamcorper faucibus. Integer euismod ante nec mi lobortis, in dictum lacus porta. Praesent cursus odio felis, eget congue diam aliquam ut.

Curabitur mollis mollis ipsum, vitae sollicitudin arcu cursus eget. Aliquam eget urna dui. Cras tempor elit ac lorem dictum, ac suscipit arcu vulputate. Donec sed diam eget velit imperdiet imperdiet.`
  },
  {
    id: "conclusion",
    title: "Consectetur Adipiscing",
    content: `Praesent dignissim lectus ut dolor fringilla, id dapibus mauris cursus. Quisque tempor eros id mi aliquam, nec auctor augue posuere. Donec aliquam sollicitudin dui, eget condimentum lacus tempor id. Donec efficitur justo vel vulputate auctor. Sed feugiat massa quis justo ullamcorper, id fringilla nisl posuere.

Ut molestie arcu sed massa condimentum, id interdum sapien eleifend. Donec sit amet quam vitae risus varius cursus vitae id erat. Nam vitae ligula malesuada, pharetra nibh in, ullamcorper ipsum. Fusce iaculis varius risus, non dictum ligula luctus id.

Suspendisse potenti. Sed sagittis nulla in nisl sollicitudin, ac rutrum augue fringilla. Donec id magna eget urna placerat pharetra. Sed vehicula mauris ut orci fermentum, id porttitor urna posuere. Etiam vel sodales enim, id feugiat neque.

> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent posuere, libero at consequat convallis, odio mauris tincidunt augue, non efficitur urna lectus a neque. Integer vitae dui cursus, placerat magna vel, lobortis velit.`
  }
];
const MarkersBlock = () => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapterMarkers, setChapterMarkers] = useState([]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShow(scrollTop > SCROLL_THRESHOLD);
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const pageHeight = docHeight - windowHeight;
      const progressValue = pageHeight > 0 ? 100 * scrollTop / pageHeight : 0;
      setProgress(progressValue);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const calculatePositions = () => {
      const markers = [];
      const docHeight = document.documentElement.scrollHeight;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          const position = absoluteTop / docHeight * 100;
          markers.push({
            id: section.id,
            title: section.title,
            position
          });
        }
      }
      setChapterMarkers(markers);
    };
    let rafId;
    requestAnimationFrame(() => {
      rafId = requestAnimationFrame(calculatePositions);
    });
    window.addEventListener("resize", calculatePositions);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", calculatePositions);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: cn("relative", styles.scope) }, /* @__PURE__ */ React.createElement(ProgressBar, { progress, show }), /* @__PURE__ */ React.createElement("div", { className: styles.chapterIndicators }, chapterMarkers.map((marker) => /* @__PURE__ */ React.createElement(ChapterIndicator, { key: marker.id, marker, show }))), /* @__PURE__ */ React.createElement("article", { className: "prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20" }, sections.map((section) => /* @__PURE__ */ React.createElement(
    "section",
    {
      "data-section-id": section.id,
      id: section.id,
      key: section.id
    },
    /* @__PURE__ */ React.createElement("h2", null, section.title),
    section.content.split("\n\n").map((paragraph) => {
      if (paragraph.startsWith("> ")) {
        return /* @__PURE__ */ React.createElement("blockquote", { key: paragraph.slice(0, 50) }, /* @__PURE__ */ React.createElement("p", null, paragraph.slice(2)));
      }
      return /* @__PURE__ */ React.createElement("p", { key: paragraph.slice(0, 50) }, paragraph);
    })
  ))));
};
function App() {
  return /* @__PURE__ */ React.createElement(MarkersBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
