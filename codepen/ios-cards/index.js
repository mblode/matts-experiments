import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { createRoot } from "react-dom/client";
const Image = ({ fill, style, ...props }) => {
  const mergedStyle = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style;
  return /* @__PURE__ */ React.createElement("img", { style: mergedStyle, ...props });
};
const items = [
  // Photo by ivan Torres on Unsplash
  {
    id: "c",
    category: "Pizza",
    title: "5 Food Apps Delivering the Best of Your City",
    pointOfInterest: 80,
    backgroundColor: "#814A0E",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop"
  },
  // Photo by Dennis Brendel on Unsplash
  {
    id: "f",
    category: "How to",
    title: "Arrange Your Apple Devices for the Gram",
    pointOfInterest: 120,
    backgroundColor: "#959684",
    imageUrl: "https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800&h=600&fit=crop"
  },
  // Photo by Alessandra Caretto on Unsplash
  {
    id: "a",
    category: "Pedal Power",
    title: "Map Apps for the Superior Mode of Transport",
    pointOfInterest: 260,
    backgroundColor: "#5DBCD2",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  // Photo by Taneli Lahtinen on Unsplash
  {
    id: "g",
    category: "Holidays",
    title: "Our Pick of Apps to Help You Escape From Apps",
    pointOfInterest: 200,
    backgroundColor: "#8F986D",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
  },
  // Photo by Simone Hutsch on Unsplash
  {
    id: "d",
    category: "Photography",
    title: "The Latest Ultra-Specific Photography Editing Apps",
    pointOfInterest: 150,
    backgroundColor: "#FA6779",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop"
  },
  // Photo by Siora Photography on Unsplash
  {
    id: "h",
    category: "They're all the same",
    title: "100 Cupcake Apps for the Cupcake Connoisseur",
    pointOfInterest: 60,
    backgroundColor: "#282F49",
    imageUrl: "https://images.unsplash.com/photo-1486427944299-bb1a5b25b9ec?w=800&h=600&fit=crop"
  },
  // Photo by Yerlin Matu on Unsplash
  {
    id: "e",
    category: "Cats",
    title: "Yes, They Are Sociopaths",
    pointOfInterest: 200,
    backgroundColor: "#AC7441",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop"
  },
  // Photo by Ali Abdul Rahman on Unsplash
  {
    id: "b",
    category: "Holidays",
    title: "Seriously the Only Escape is the Stratosphere",
    pointOfInterest: 260,
    backgroundColor: "#CC555B",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop"
  }
];
const openSpring = { type: "spring", stiffness: 200, damping: 30 };
function Item({ id, setSelectedId }) {
  const item = items.find((item2) => item2.id === id);
  if (!item) {
    return null;
  }
  const { category, title } = item;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { opacity: 1 },
      className: "pointer-events-auto fixed top-0 bottom-0 left-1/2 z-[1] w-full -translate-x-1/2 bg-black/80",
      exit: { opacity: 0 },
      initial: { opacity: 0 },
      onClick: () => setSelectedId(null),
      transition: { duration: 0.2, delay: 0.1 }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center p-4 sm:p-10" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "pointer-events-auto relative mx-auto h-auto max-h-[90vh] w-full max-w-[700px] overflow-hidden overflow-y-auto rounded-[20px] bg-ios-card-bg",
      layoutId: `card-container-${id}`
    },
    /* @__PURE__ */ React.createElement(
      motion.button,
      {
        animate: { opacity: 1 },
        className: "absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30",
        initial: { opacity: 0 },
        onClick: () => setSelectedId(null),
        transition: { delay: 0.2 }
      },
      /* @__PURE__ */ React.createElement(X, { className: "h-5 w-5 text-white" })
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "relative h-[250px] w-full overflow-hidden sm:h-[420px]",
        layoutId: `card-image-container-${id}`
      },
      /* @__PURE__ */ React.createElement(
        Image,
        {
          alt: title,
          className: "object-cover",
          fill: true,
          sizes: "(max-width: 640px) 100vw, 800px",
          src: item.imageUrl
        }
      )
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "absolute top-4 left-4 z-10 max-w-[300px] sm:top-[30px] sm:left-[30px]",
        layoutId: `title-container-${id}`
      },
      /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs uppercase sm:text-sm" }, category),
      /* @__PURE__ */ React.createElement("h2", { className: "my-1 font-semibold text-white text-xl sm:my-2 sm:text-2xl" }, title)
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        animate: { opacity: 1 },
        className: "px-4 pt-6 pb-6 sm:px-9 sm:pt-10 sm:pb-9",
        initial: { opacity: 0 },
        transition: { delay: 0.15, duration: 0.5 }
      },
      /* @__PURE__ */ React.createElement("p", { className: "text-[#9d9ca1] text-base leading-6 sm:text-xl sm:leading-7" }, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")
    )
  )));
}
const Card = ({
  id,
  title,
  category,
  backgroundColor: _backgroundColor,
  imageUrl,
  setSelectedId
}) => {
  return /* @__PURE__ */ React.createElement("li", { className: "flex h-[300px] cursor-pointer flex-col items-center justify-between rounded-xl transition-colors hover:bg-card/5 sm:h-[420px]" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "relative block h-full w-full cursor-pointer",
      onClick: () => setSelectedId(id),
      type: "button"
    },
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "relative h-full w-full overflow-hidden rounded-[20px] bg-ios-card-bg",
        layoutId: `card-container-${id}`
      },
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          className: "absolute top-0 left-0 h-full w-full overflow-hidden",
          layoutId: `card-image-container-${id}`
        },
        /* @__PURE__ */ React.createElement(
          Image,
          {
            alt: title,
            className: "object-cover",
            fill: true,
            sizes: "(max-width: 640px) 100vw, 600px",
            src: imageUrl
          }
        )
      ),
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          className: "absolute top-3 left-3 max-w-[250px] sm:top-4 sm:left-4 sm:max-w-[300px]",
          layoutId: `title-container-${id}`
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs uppercase sm:text-sm" }, category),
        /* @__PURE__ */ React.createElement("h2", { className: "my-1 font-semibold text-lg text-white sm:my-2 sm:text-xl" }, title)
      )
    )
  ));
};
const List = ({ setSelectedId }) => {
  return /* @__PURE__ */ React.createElement("ul", { className: "mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8" }, items.map((card, _index) => {
    return /* @__PURE__ */ React.createElement(Card, { key: card.id, ...card, setSelectedId });
  }));
};
const IosCardsBlock = () => {
  const [selectedId, setSelectedId] = useState(null);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(List, { setSelectedId }), /* @__PURE__ */ React.createElement(AnimatePresence, null, selectedId && /* @__PURE__ */ React.createElement(Item, { id: selectedId, key: "item", setSelectedId })));
};
function App() {
  return /* @__PURE__ */ React.createElement(IosCardsBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
