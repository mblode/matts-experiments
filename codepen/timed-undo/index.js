import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Undo2 } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
const CountdownTimer = ({
  initialSeconds,
  intervalSeconds = 1,
  onFinish = () => void 0
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((seconds2) => {
        if (seconds2 === 0) {
          onFinish();
          clearInterval(timer);
          return seconds2;
        }
        return seconds2 - 1;
      });
    }, intervalSeconds * 1e3);
    return () => clearInterval(timer);
  }, [intervalSeconds, onFinish]);
  const secondsString = `${seconds}`;
  const digits = buildKeyedCharacters(secondsString);
  return /* @__PURE__ */ React.createElement("div", { className: "w-10 rounded-full bg-red-500 py-1 text-white" }, /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, mode: "popLayout" }, digits.map(({ char: digit, key, order }) => {
    return /* @__PURE__ */ React.createElement(
      motion.span,
      {
        animate: { y: 0, scale: 1, filter: "blur(0px)", opacity: 1 },
        className: "inline-block",
        exit: { y: 10, scale: 0.8, filter: "blur(3px)", opacity: 0 },
        initial: { y: -10, scale: 0.8, filter: "blur(3px)", opacity: 0 },
        key,
        transition: {
          delay: order * 0.1,
          type: "spring",
          bounce: 0.3,
          stiffness: 180,
          damping: 15
        }
      },
      digit
    );
  })));
};
const DELETE_STATUS = {
  INITIAL: "initial",
  IN_PROGRESS: "in-progress",
  CANCELLED: "cancelled",
  DELETED: "deleted"
};
const StaggeredText = ({
  text,
  initialAnimationEnabled = true
}) => {
  const characters = buildKeyedCharacters(text);
  return (
    // This position:relative is intentional. It prevents the text from layout shift
    // The layout prop here ensures that text doesn't stretch too much
    /* @__PURE__ */ React.createElement(motion.div, { layout: true, style: { position: "relative" } }, /* @__PURE__ */ React.createElement(AnimatePresence, { initial: initialAnimationEnabled, mode: "popLayout" }, characters.map(({ char, key, order }) => {
      if (char === " ") {
        return /* @__PURE__ */ React.createElement("span", { key }, "\xA0");
      }
      return /* @__PURE__ */ React.createElement(
        motion.span,
        {
          animate: { y: 0, filter: "blur(0px)", opacity: 1, scale: 1 },
          className: "inline-block",
          exit: { y: -12, filter: "blur(4px)", opacity: 0, scale: 0.8 },
          initial: {
            y: 12,
            filter: "blur(4px)",
            opacity: 0,
            scale: 0.8
          },
          key,
          transition: {
            delay: order * 0.01
          }
        },
        char
      );
    })))
  );
};
const buildKeyedCharacters = (value) => {
  const counts = /* @__PURE__ */ new Map();
  let order = 0;
  return Array.from(value).map((char) => {
    const nextCount = (counts.get(char) ?? 0) + 1;
    counts.set(char, nextCount);
    const entry = { char, key: `${char}-${nextCount}`, order };
    order += 1;
    return entry;
  });
};
const TimedUndoBlock = () => {
  const [status, setStatus] = useState(DELETE_STATUS.INITIAL);
  const hasStatusChanged = status !== DELETE_STATUS.INITIAL;
  const isDeleting = status === DELETE_STATUS.IN_PROGRESS;
  const isDeleted = status === DELETE_STATUS.DELETED;
  const onTimerEnd = () => {
    setStatus(DELETE_STATUS.DELETED);
  };
  return /* @__PURE__ */ React.createElement(
    AnimatePresence,
    {
      initial: false,
      onExitComplete: () => setTimeout(() => setStatus(DELETE_STATUS.INITIAL), 200)
    },
    isDeleted ? null : /* @__PURE__ */ React.createElement(
      motion.button,
      {
        animate: {
          backgroundColor: isDeleting ? "#fef2f2" : "#ef4444",
          color: isDeleting ? "#ef4444" : "#fff"
        },
        className: clsx(
          "flex h-14 cursor-pointer items-center gap-2 rounded-full py-2",
          isDeleting ? "px-3" : "px-6"
        ),
        disabled: isDeleted,
        exit: { opacity: 0, filter: "blur(4px)" },
        initial: {
          color: "#fff"
        },
        layout: true,
        onClick: () => {
          setStatus((prevStatus) => {
            if (prevStatus === DELETE_STATUS.INITIAL || prevStatus === DELETE_STATUS.CANCELLED) {
              return DELETE_STATUS.IN_PROGRESS;
            }
            return DELETE_STATUS.CANCELLED;
          });
        },
        style: {
          // needed to make sure the layout transition doesn't skew border radius
          borderRadius: "9999px"
        },
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 1
        },
        whileTap: { scale: 0.8 }
      },
      isDeleting && /* @__PURE__ */ React.createElement(
        motion.span,
        {
          animate: { opacity: 1, filter: "blur(0px)" },
          "aria-label": "Undo delete account",
          className: "rounded-full bg-red-500 p-1.5 text-white",
          exit: {
            opacity: 0,
            filter: "blur(4px)"
          },
          initial: { opacity: 0, filter: "blur(4px)" },
          transition: { duration: 0.5 }
        },
        /* @__PURE__ */ React.createElement(Undo2, { className: "h-5 w-5 stroke-[2.5px]" })
      ),
      /* @__PURE__ */ React.createElement(motion.div, null, /* @__PURE__ */ React.createElement(
        StaggeredText,
        {
          initialAnimationEnabled: hasStatusChanged,
          text: isDeleting ? "Cancel Deletion" : "Delete Account"
        }
      )),
      isDeleting && /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { opacity: 1, filter: "blur(0px)" },
          exit: {
            opacity: 0,
            filter: "blur(4px)"
          },
          initial: { opacity: 0, filter: "blur(4px)" },
          transition: { duration: 0.5 }
        },
        /* @__PURE__ */ React.createElement(CountdownTimer, { initialSeconds: 10, onFinish: onTimerEnd })
      )
    )
  );
};
function App() {
  return /* @__PURE__ */ React.createElement(TimedUndoBlock, null);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
