(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [4755],
  {
    31104: (e, t, s) => {
      Promise.resolve().then(s.bind(s, 66397));
    },
    66397: (e, t, s) => {
      "use strict";
      s.d(t, {
        DynamicIsland: () => j,
      });
      var n = s(51047),
        i = s(76847),
        l = s(7127),
        r = s(66400),
        a = s(4871),
        o = s(53217),
        c = s(79772);
      let d = (0, i.createContext)({
          state: "idle",
          setState: (e) => {},
        }),
        u = {
          type: "spring",
          bounce: 0.35,
        },
        x = () => (0, i.useContext)(d),
        h = (0, i.memo)(function (e) {
          let { baseLength: t, paused: s } = e,
            [r, a] = (0, i.useState)(!0);
          return (
            (0, i.useEffect)(() => {
              if (s) a(!1);
              else {
                let e = setTimeout(() => {
                  a(!0);
                }, 300);
                return () => clearTimeout(e);
              }
            }, [s]),
            (0, n.jsx)(l.P.div, {
              className:
                "col-span-1 mx-auto my-auto h-6 w-[1.25px] scale-125 rounded-full bg-gradient-to-t from-[#675470] to-[#395978]",
              animate: {
                height: s
                  ? 1
                  : r
                    ? (function (e, t, s) {
                        let n = [];
                        for (let e = 0; e < 5; e++)
                          n.push(
                            (Math.floor(Math.random() * Math.floor(24)) - 24) /
                              2 +
                              (s / 100) * 24,
                          );
                        return (n.push(n[0]), n);
                      })(24, 0, null != t ? t : 50)
                    : t / 5,
              },
              transition:
                s || !r
                  ? {
                      duration: 0.3,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 1.1,
                      ease: "easeInOut",
                      times: [0.2, 0.3, 0.5, 0.7, 1.1, 1.3, 1.7],
                      repeat: 1 / 0,
                    },
            })
          );
        });
      function p(e) {
        let { className: t, paused: s } = e,
          [a, o] = (0, i.useState)(0);
        (0, i.useEffect)(() => {
          let e = setInterval(() => {
            o((e) => (s ? e : 60 === e ? 0 : e + 1));
          }, 1e3);
          return () => {
            clearInterval(e);
          };
        }, [a, s]);
        let d = a.toString().padStart(2, "0").split("");
        return (0, n.jsxs)("div", {
          className: (0, c.x)(
            "relative overflow-hidden whitespace-nowrap",
            t || "",
          ),
          children: [
            "0:",
            (0, n.jsx)(r.N, {
              initial: !1,
              mode: "popLayout",
              children: d.map((e, t) =>
                (0, n.jsx)(
                  l.P.div,
                  {
                    className: "inline-block tabular-nums",
                    initial: {
                      y: "12px",
                      filter: "blur(2px)",
                      opacity: 0,
                    },
                    animate: {
                      y: "0",
                      filter: "blur(0px)",
                      opacity: 1,
                    },
                    exit: {
                      y: "-12px",
                      filter: "blur(2px)",
                      opacity: 0,
                    },
                    transition: u,
                    children: e,
                  },
                  e + t,
                ),
              ),
            }),
          ],
        });
      }
      function m(e) {
        let { initial: t, active: s, isActive: i } = e;
        return (0, n.jsx)(r.N, {
          initial: !1,
          mode: "wait",
          children: i
            ? (0, n.jsx)(
                l.P.div,
                {
                  initial: {
                    opacity: 0,
                    scale: 0.5,
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.5,
                  },
                  animate: {
                    opacity: 1,
                    scale: 1,
                  },
                  transition: {
                    duration: 0.1,
                    bounce: 0.4,
                  },
                  children: s,
                },
                "play",
              )
            : (0, n.jsx)(
                l.P.div,
                {
                  initial: {
                    opacity: 0,
                    scale: 0.5,
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.5,
                  },
                  animate: {
                    opacity: 1,
                    scale: 1,
                  },
                  transition: {
                    duration: 0.1,
                    bounce: 0.4,
                  },
                  children: t,
                },
                "pause",
              ),
        });
      }
      function f() {
        let { setState: e } = x(),
          [t, s] = (0, i.useState)(!1);
        return (0, n.jsxs)("div", {
          className: "flex w-full items-center gap-2 p-4 py-3",
          children: [
            (0, n.jsx)("button", {
              "aria-label": "Pause timer",
              onClick: () => s((e) => !e),
              className:
                "flex h-10 w-10 items-center justify-center rounded-full bg-[#5A3C07] transition-colors hover:bg-[#694608]",
              children: (0, n.jsx)(m, {
                initial: (0, n.jsx)("svg", {
                  viewBox: "0 0 10 13",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-4 w-4 fill-current text-[#FDB000]",
                  children: (0, n.jsx)("path", {
                    d: "M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z",
                  }),
                }),
                active: (0, n.jsx)("svg", {
                  viewBox: "0 0 12 14",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-4 w-4 fill-current text-[#FDB000]",
                  children: (0, n.jsx)("path", {
                    d: "M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z",
                  }),
                }),
                isActive: t,
              }),
            }),
            (0, n.jsx)("button", {
              "aria-label": "Exit",
              onClick: () => e("idle"),
              className:
                "mr-12 flex h-10 w-10 items-center justify-center rounded-full bg-[#3C3D3C] text-white transition-colors hover:bg-[#4A4B4A]",
              children: (0, n.jsx)("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "currentColor",
                className: "h-6 w-6",
                children: (0, n.jsx)("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M6 18L18 6M6 6l12 12",
                }),
              }),
            }),
            (0, n.jsxs)("div", {
              className: "flex items-baseline gap-1.5 text-[#FDB000]",
              children: [
                (0, n.jsx)("span", {
                  className: "text-sm font-semibold leading-none",
                  children: "Timer",
                }),
                (0, n.jsx)(p, {
                  paused: t,
                  className: "w-[64px] text-3xl font-light",
                }),
              ],
            }),
          ],
        });
      }
      function g() {
        return (0, n.jsx)("div", {
          className: "h-[28px]",
        });
      }
      function w() {
        let [e, t] = (0, i.useState)(!1),
          [s, r] = (0, i.useState)(!0);
        return (
          (0, i.useEffect)(() => {
            let e = setTimeout(
              () => {
                (r(!1), t((e) => !e));
              },
              s ? 1e3 : 2e3,
            );
            return () => clearTimeout(e);
          }, [e, s]),
          (0, n.jsxs)(l.P.div, {
            initial: {
              width: 128,
            },
            animate: {
              width: e ? 148 : 128,
            },
            transition: {
              type: "spring",
              bounce: 0.5,
            },
            className:
              "relative flex h-[28px]  items-center justify-between px-2.5",
            children: [
              (0, n.jsx)(l.P.div, {
                initial: {
                  width: 0,
                  opacity: 0,
                  filter: "blur(4px)",
                },
                animate: {
                  width: e ? 40 : 0,
                  opacity: e ? 1 : 0,
                  filter: e ? "blur(0px)" : "blur(4px)",
                },
                transition: u,
                className:
                  "absolute left-[5px] h-[18px]  w-12 cursor-pointer rounded-full bg-[#FD4F30]",
              }),
              (0, n.jsxs)("button", {
                className: "relative h-[12.75px] w-[11.25px]",
                onClick: () => t((e) => !e),
                children: [
                  (0, n.jsx)(l.P.svg, {
                    className: "absolute inset-0",
                    initial: !1,
                    animate: {
                      rotate: e
                        ? [0, -15, 5, -2, 0]
                        : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
                      x: e ? 8.5 : 0,
                    },
                    width: "11.25",
                    height: "12.75",
                    viewBox: "0 0 15 17",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: (0, n.jsx)("path", {
                      d: "M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125ZM7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453Z",
                      fill: "white",
                    }),
                  }),
                  (0, n.jsx)(l.P.div, {
                    className: "absolute inset-0",
                    animate: {
                      rotate: e
                        ? [0, -15, 5, -2, 0]
                        : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
                      x: e ? 8.5 : 0,
                    },
                    children: (0, n.jsx)(l.P.div, {
                      className:
                        "h-5 -translate-y-[5px] translate-x-[5.25px] rotate-[-40deg] overflow-hidden",
                      children: (0, n.jsx)(l.P.div, {
                        animate: {
                          height: e ? 16 : 0,
                        },
                        transition: {
                          ease: "easeInOut",
                          duration: e ? 0.125 : 0.05,
                          delay: e ? 0.15 : 0,
                        },
                        className: "w-fit rounded-full",
                        children: (0, n.jsx)("div", {
                          className:
                            "flex h-full w-[3px] items-center justify-center rounded-full bg-[#FD4F30]",
                          children: (0, n.jsx)("div", {
                            className:
                              "h-full w-[0.75px] rounded-full bg-white",
                          }),
                        }),
                      }),
                    }),
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                className: "relative flex w-[32px] items-center",
                children: [
                  (0, n.jsx)(l.P.span, {
                    animate: e
                      ? {
                          opacity: 0,
                          scale: 0.25,
                          filter: "blur(4px)",
                        }
                      : {},
                    className: "ml-auto text-xs font-medium text-white",
                    children: "Ring",
                  }),
                  (0, n.jsx)(l.P.span, {
                    animate: e
                      ? {
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0)",
                        }
                      : {
                          opacity: 0,
                          scale: 0.25,
                          filter: "blur(4px)",
                        },
                    className: "absolute text-xs font-medium text-[#FD4F30]",
                    children: "Silent",
                  }),
                ],
              }),
            ],
          })
        );
      }
      function b() {
        let [e, t] = (0, i.useState)(0),
          [s, r] = (0, i.useState)(!1);
        return (
          (0, i.useEffect)(() => {
            let e = setInterval(() => {
              t((e) => (s ? e : (214 === e && t(0), e + 1)));
            }, 1e3);
            return () => clearInterval(e);
          }, [s]),
          (0, n.jsxs)("div", {
            className: "w-[316px] p-[18px]",
            children: [
              (0, n.jsxs)("div", {
                className: "flex items-center gap-3",
                children: [
                  (0, n.jsx)(o.default, {
                    className: "rounded-lg",
                    alt: "Anniversary's album cover",
                    src: "/anniversary.jpg",
                    width: 52,
                    height: 52,
                  }),
                  (0, n.jsxs)("div", {
                    className: "flex flex-col gap-1 pr-12",
                    children: [
                      (0, n.jsx)("span", {
                        className:
                          "whitespace-nowrap text-sm font-medium leading-none text-white",
                        children: "Timeless Interlude",
                      }),
                      (0, n.jsx)("span", {
                        className:
                          "text-sm leading-none text-gray-400 dark:text-gray-1100",
                        children: "Bryson Tiller",
                      }),
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    className:
                      "grid h-full grid-cols-11 justify-center gap-[2px] bg-transparent",
                    children: [
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 50,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 60,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 70,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 90,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 80,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 90,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 70,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 60,
                      }),
                      (0, n.jsx)(h, {
                        paused: s,
                        baseLength: 50,
                      }),
                    ],
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                className: "mt-3 flex items-center gap-1",
                children: [
                  (0, n.jsx)("span", {
                    className:
                      "text-xs tabular-nums text-gray-400 transition-colors dark:text-gray-1100",
                    children: (function () {
                      let t = "0".concat(e % 60).slice(-2),
                        s = "".concat(Math.floor(e / 60)),
                        n = "0".concat(Number(s) % 60).slice(-2);
                      return "".concat(n, ":").concat(t);
                    })(),
                  }),
                  (0, n.jsx)("div", {
                    className:
                      "relative h-[3px] flex-grow overflow-hidden rounded-full bg-[#2C2C29] ",
                    children: (0, n.jsx)(l.P.div, {
                      initial: {
                        x: "-100%",
                      },
                      animate: {
                        x: "".concat((e / 214) * 100 - 99, "%"),
                      },
                      transition: {
                        duration: 1,
                        ease: "linear",
                      },
                      className:
                        "absolute bottom-0 left-0 top-0 w-full bg-gray-400 dark:bg-gray-1200",
                    }),
                  }),
                  (0, n.jsx)("span", {
                    className: (0, c.x)(
                      "text-xs tabular-nums text-gray-400 transition-colors dark:text-gray-1100",
                    ),
                    children: "3:34",
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                className: "mt-3 flex items-center justify-center gap-4 pb-1",
                children: [
                  (0, n.jsx)("button", {
                    children: (0, n.jsx)("svg", {
                      width: "22",
                      height: "13",
                      viewBox: "0 0 22 13",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: (0, n.jsx)("path", {
                        d: "M9.64844 12.2891C10.2578 12.2891 10.7734 11.8203 10.7734 10.9531V1.35156C10.7734 0.484375 10.2578 0.015625 9.64844 0.015625C9.32812 0.015625 9.07031 0.117188 8.75 0.304688L0.789062 4.99219C0.234375 5.32031 0 5.70312 0 6.14844C0 6.60156 0.234375 6.98438 0.789062 7.3125L8.75 12C9.0625 12.1875 9.32812 12.2891 9.64844 12.2891ZM20.3828 12.2891C20.9922 12.2891 21.5078 11.8203 21.5078 10.9531V1.35156C21.5078 0.484375 20.9922 0.015625 20.3828 0.015625C20.0625 0.015625 19.8047 0.117188 19.4844 0.304688L11.5234 4.99219C10.9688 5.32031 10.7344 5.70312 10.7344 6.14844C10.7344 6.60156 10.9688 6.98438 11.5234 7.3125L19.4844 12C19.7969 12.1875 20.0625 12.2891 20.3828 12.2891Z",
                        fill: "white",
                      }),
                    }),
                  }),
                  (0, n.jsx)("button", {
                    onClick: () => r((e) => !e),
                    children: (0, n.jsx)(m, {
                      initial: (0, n.jsx)("svg", {
                        viewBox: "0 0 10 13",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5 fill-current text-white",
                        children: (0, n.jsx)("path", {
                          d: "M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z",
                        }),
                      }),
                      active: (0, n.jsx)("svg", {
                        viewBox: "0 0 12 14",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5 fill-current text-white",
                        children: (0, n.jsx)("path", {
                          d: "M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z",
                        }),
                      }),
                      isActive: s,
                    }),
                  }),
                  (0, n.jsx)("button", {
                    children: (0, n.jsx)("svg", {
                      width: "22",
                      height: "13",
                      viewBox: "0 0 22 13",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: (0, n.jsx)("path", {
                        d: "M1.125 12.2891C1.44531 12.2891 1.71094 12.1875 2.02344 12L9.98438 7.3125C10.5391 6.98438 10.7812 6.60156 10.7812 6.14844C10.7812 5.70312 10.5391 5.32031 9.98438 4.99219L2.02344 0.304688C1.70312 0.117188 1.44531 0.015625 1.125 0.015625C0.515625 0.015625 0 0.484375 0 1.35156V10.9531C0 11.8203 0.515625 12.2891 1.125 12.2891ZM11.8594 12.2891C12.1797 12.2891 12.4453 12.1875 12.7578 12L20.7266 7.3125C21.2734 6.98438 21.5156 6.60156 21.5156 6.14844C21.5156 5.70312 21.2734 5.32031 20.7266 4.99219L12.7578 0.304688C12.4453 0.117188 12.1797 0.015625 11.8594 0.015625C11.25 0.015625 10.7344 0.484375 10.7344 1.35156V10.9531C10.7344 11.8203 11.25 12.2891 11.8594 12.2891Z",
                        fill: "white",
                      }),
                    }),
                  }),
                ],
              }),
            ],
          })
        );
      }
      let v = {
        "ring-mode-idle": {
          scale: 0.9,
          scaleX: 0.9,
        },
        "timer-ring-mode": {
          scale: 0.7,
          y: -7.5,
        },
        "ring-mode-timer": {
          scale: 1.4,
          y: 7.5,
        },
        "timer-listenning": {
          scaleY: 1.1,
          y: 7.5,
        },
        "listenning-ring-mode": {
          scale: 0.65,
          y: -32,
        },
        "ring-mode-listenning": {
          scale: 1.5,
          y: 12.5,
        },
        "timer-idle": {
          scale: 0.7,
          y: -7.5,
        },
        "listenning-timer": {
          scaleY: 0.9,
          y: -12,
        },
        "listenning-idle": {
          scale: 0.4,
          y: -36,
        },
      };
      function j() {
        let [e, t] = (0, i.useState)("idle"),
          [s, o] = (0, i.useState)(),
          [c, u] = (0, i.useState)(1),
          [x, h] = (0, i.useState)(28),
          p = (0, i.useRef)(null);
        function m() {
          switch (e) {
            case "timer":
              return (0, n.jsx)(f, {});
            case "listenning":
              return (0, n.jsx)(b, {});
            case "ring-mode":
              return (0, n.jsx)(w, {});
            default:
              return (0, n.jsx)(g, {});
          }
        }
        return (
          (0, i.useLayoutEffect)(() => {
            let e = p.current;
            if (e) {
              let t;
              let { height: s } = e.getBoundingClientRect(),
                n = Math.abs(s - x),
                i = n / 100;
              ((t = Math.min(
                Math.max((t = s < x ? 0.35 - 0.3 * i : 0.3 + 0.3 * i), 0.3),
                0.35,
              )),
                n < 20 && (t = 0.5),
                h(s),
                u(t));
            }
          }, [e]),
          (0, n.jsx)(d.Provider, {
            value: {
              state: e,
              setState: t,
            },
            children: (0, n.jsx)(a.Example, {
              actions: [
                {
                  label: "Idle",
                  onClick: () => {
                    (t("idle"), o(v["".concat(e, "-", "idle")]));
                  },
                },
                {
                  label: "Ring Mode",
                  onClick: () => {
                    (t("ring-mode"), o(v["".concat(e, "-", "ring-mode")]));
                  },
                },
                {
                  label: "Timer",
                  onClick: () => {
                    (t("timer"), o(v["".concat(e, "-", "timer")]));
                  },
                },
                {
                  label: "Listening",
                  onClick: () => {
                    (t("listenning"), o(v["".concat(e, "-", "listenning")]));
                  },
                },
              ],
              className: "h-[200px] items-start justify-center pb-32",
              children: (0, n.jsxs)("div", {
                className: "relative",
                children: [
                  (0, n.jsx)(l.P.div, {
                    layout: !0,
                    transition: {
                      type: "spring",
                      bounce: c,
                    },
                    style: {
                      borderRadius: "32px",
                    },
                    className:
                      "min-w-[100px] overflow-hidden rounded-full bg-black",
                    children: (0, n.jsx)(
                      l.P.div,
                      {
                        ref: p,
                        transition: {
                          type: "spring",
                          bounce: c,
                        },
                        initial: {
                          scale: 0.9,
                          opacity: 0,
                          filter: "blur(5px)",
                          originX: 0.5,
                          originY: 0.5,
                        },
                        animate: {
                          scale: 1,
                          opacity: 1,
                          filter: "blur(0px)",
                          originX: 0.5,
                          originY: 0.5,
                          transition: {
                            delay: 0.05,
                          },
                        },
                        children: m(),
                      },
                      e,
                    ),
                  }),
                  (0, n.jsx)("div", {
                    className:
                      "pointer-events-none absolute left-1/2 top-0 flex h-[200px] w-[300px] -translate-x-1/2 items-start justify-center",
                    children: (0, n.jsx)(r.N, {
                      mode: "popLayout",
                      custom: s,
                      children: (0, n.jsx)(
                        l.P.div,
                        {
                          initial: {
                            opacity: 0,
                          },
                          exit: "exit",
                          variants: C,
                          children: m(),
                        },
                        e + "second",
                      ),
                    }),
                  }),
                ],
              }),
            }),
          })
        );
      }
      let C = {
        exit: (e) => ({
          ...e,
          opacity: [1, 0],
          filter: "blur(5px)",
        }),
      };
    },
    4871: (e, t, s) => {
      "use strict";
      (s.r(t),
        s.d(t, {
          Example: () => a,
        }));
      var n = s(51047),
        i = s(79772),
        l = s(669),
        r = s(7127);
      function a(e) {
        let {
          actions: t,
          children: s,
          className: a,
          actionChildren: o,
          description: c,
          wrapperClassName: d,
          code: u,
          descriptionClassName: x,
          ...h
        } = e;
        return (0, n.jsxs)("div", {
          ...h,
          children: [
            (0, n.jsxs)("div", {
              className: (0, l.$)(
                "mobile-full-width relative mb-[35px] mt-8 rounded-xl border-b border-t border-gray-400 bg-white dark:bg-[#11110E] sm:border-l sm:border-r sm:border-none sm:shadow-sm sm:dark:shadow-inset-border",
                d,
              ),
              children: [
                (0, n.jsx)("div", {
                  className: (0, i.x)(
                    "flex w-full px-4 py-6 sm:rounded-xl",
                    a || "",
                  ),
                  children: s,
                }),
                t
                  ? (0, n.jsxs)("div", {
                      className:
                        "flex justify-center gap-2 overflow-hidden rounded-b-xl border-t border-gray-400 bg-[#FBFBF9] p-2 py-2.5 dark:border dark:border-[#22221F] dark:bg-[#161612]",
                      children: [
                        null == t
                          ? void 0
                          : t.map((e) =>
                              (0, n.jsx)(
                                r.P.button,
                                {
                                  className:
                                    "rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-1200 shadow-border outline-none transition-colors hover:bg-gray-200 focus-visible:shadow-focus-ring-button dark:bg-gray-100",
                                  whileHover: {
                                    scale: 1.02,
                                  },
                                  whileTap: {
                                    scale: 0.98,
                                  },
                                  onClick: () => e.onClick(),
                                  children: e.label,
                                },
                                e.label,
                              ),
                            ),
                        o,
                      ],
                    })
                  : null,
                u || null,
              ],
            }),
            c
              ? (0, n.jsx)("p", {
                  className: (0, l.$)(
                    "-mt-5 mb-8 text-center text-xs text-gray-1000",
                    x,
                  ),
                  dangerouslySetInnerHTML: {
                    __html: c,
                  },
                })
              : null,
          ],
        });
      }
    },
    79772: (e, t, s) => {
      "use strict";
      function n() {
        for (var e = arguments.length, t = Array(e), s = 0; s < e; s++)
          t[s] = arguments[s];
        return t.join(" ");
      }
      s.d(t, {
        x: () => n,
      });
    },
    669: (e, t, s) => {
      "use strict";
      function n() {
        for (var e, t, s = 0, n = "", i = arguments.length; s < i; s++)
          (e = arguments[s]) &&
            (t = (function e(t) {
              var s,
                n,
                i = "";
              if ("string" == typeof t || "number" == typeof t) i += t;
              else if ("object" == typeof t) {
                if (Array.isArray(t)) {
                  var l = t.length;
                  for (s = 0; s < l; s++)
                    t[s] && (n = e(t[s])) && (i && (i += " "), (i += n));
                } else for (n in t) t[n] && (i && (i += " "), (i += n));
              }
              return i;
            })(e)) &&
            (n && (n += " "), (n += t));
        return n;
      }
      s.d(t, {
        $: () => n,
        A: () => i,
      });
      let i = n;
    },
    66400: (e, t, s) => {
      "use strict";
      s.d(t, {
        N: () => g,
      });
      var n = s(51047),
        i = s(76847),
        l = s(50500),
        r = s(50364),
        a = s(51053),
        o = s(84498),
        c = s(31611);
      class d extends i.Component {
        getSnapshotBeforeUpdate(e) {
          let t = this.props.childRef.current;
          if (t && e.isPresent && !this.props.isPresent) {
            let e = t.offsetParent,
              s = (e instanceof HTMLElement && e.offsetWidth) || 0,
              n = this.props.sizeRef.current;
            ((n.height = t.offsetHeight || 0),
              (n.width = t.offsetWidth || 0),
              (n.top = t.offsetTop),
              (n.left = t.offsetLeft),
              (n.right = s - n.width - n.left));
          }
          return null;
        }
        componentDidUpdate() {}
        render() {
          return this.props.children;
        }
      }
      function u(e) {
        let { children: t, isPresent: s, anchorX: l } = e,
          r = (0, i.useId)(),
          a = (0, i.useRef)(null),
          o = (0, i.useRef)({
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            right: 0,
          }),
          { nonce: u } = (0, i.useContext)(c.Q);
        return (
          (0, i.useInsertionEffect)(() => {
            let { width: e, height: t, top: n, left: i, right: c } = o.current;
            if (s || !a.current || !e || !t) return;
            a.current.dataset.motionPopId = r;
            let d = document.createElement("style");
            return (
              u && (d.nonce = u),
              document.head.appendChild(d),
              d.sheet &&
                d.sheet.insertRule(
                  '\n          [data-motion-pop-id="'
                    .concat(
                      r,
                      '"] {\n            position: absolute !important;\n            width: ',
                    )
                    .concat(e, "px !important;\n            height: ")
                    .concat(t, "px !important;\n            ")
                    .concat(
                      "left" === l ? "left: ".concat(i) : "right: ".concat(c),
                      "px !important;\n            top: ",
                    )
                    .concat(n, "px !important;\n          }\n        "),
                ),
              () => {
                document.head.removeChild(d);
              }
            );
          }, [s]),
          (0, n.jsx)(d, {
            isPresent: s,
            childRef: a,
            sizeRef: o,
            children: i.cloneElement(t, {
              ref: a,
            }),
          })
        );
      }
      let x = (e) => {
        let {
            children: t,
            initial: s,
            isPresent: l,
            onExitComplete: a,
            custom: c,
            presenceAffectsLayout: d,
            mode: x,
            anchorX: p,
          } = e,
          m = (0, r.M)(h),
          f = (0, i.useId)(),
          g = !0,
          w = (0, i.useMemo)(
            () => (
              (g = !1),
              {
                id: f,
                initial: s,
                isPresent: l,
                custom: c,
                onExitComplete: (e) => {
                  for (let t of (m.set(e, !0), m.values())) if (!t) return;
                  a && a();
                },
                register: (e) => (m.set(e, !1), () => m.delete(e)),
              }
            ),
            [l, m, a],
          );
        return (
          d &&
            g &&
            (w = {
              ...w,
            }),
          (0, i.useMemo)(() => {
            m.forEach((e, t) => m.set(t, !1));
          }, [l]),
          i.useEffect(() => {
            l || m.size || !a || a();
          }, [l]),
          "popLayout" === x &&
            (t = (0, n.jsx)(u, {
              isPresent: l,
              anchorX: p,
              children: t,
            })),
          (0, n.jsx)(o.t.Provider, {
            value: w,
            children: t,
          })
        );
      };
      function h() {
        return new Map();
      }
      var p = s(55781);
      let m = (e) => e.key || "";
      function f(e) {
        let t = [];
        return (
          i.Children.forEach(e, (e) => {
            (0, i.isValidElement)(e) && t.push(e);
          }),
          t
        );
      }
      let g = (e) => {
        let {
            children: t,
            custom: s,
            initial: o = !0,
            onExitComplete: c,
            presenceAffectsLayout: d = !0,
            mode: u = "sync",
            propagate: h = !1,
            anchorX: g = "left",
          } = e,
          [w, b] = (0, p.xQ)(h),
          v = (0, i.useMemo)(() => f(t), [t]),
          j = h && !w ? [] : v.map(m),
          C = (0, i.useRef)(!0),
          y = (0, i.useRef)(v),
          N = (0, r.M)(() => new Map()),
          [L, k] = (0, i.useState)(v),
          [M, P] = (0, i.useState)(v);
        (0, a.E)(() => {
          ((C.current = !1), (y.current = v));
          for (let e = 0; e < M.length; e++) {
            let t = m(M[e]);
            j.includes(t) ? N.delete(t) : !0 !== N.get(t) && N.set(t, !1);
          }
        }, [M, j.length, j.join("-")]);
        let E = [];
        if (v !== L) {
          let e = [...v];
          for (let t = 0; t < M.length; t++) {
            let s = M[t],
              n = m(s);
            j.includes(n) || (e.splice(t, 0, s), E.push(s));
          }
          return ("wait" === u && E.length && (e = E), P(f(e)), k(v), null);
        }
        let { forceRender: S } = (0, i.useContext)(l.L);
        return (0, n.jsx)(n.Fragment, {
          children: M.map((e) => {
            let t = m(e),
              i = (!h || !!w) && (v === M || j.includes(t));
            return (0, n.jsx)(
              x,
              {
                isPresent: i,
                initial: (!C.current || !!o) && void 0,
                custom: s,
                presenceAffectsLayout: d,
                mode: u,
                onExitComplete: i
                  ? void 0
                  : () => {
                      if (!N.has(t)) return;
                      N.set(t, !0);
                      let e = !0;
                      (N.forEach((t) => {
                        t || (e = !1);
                      }),
                        e &&
                          (null == S || S(),
                          P(y.current),
                          h && (null == b || b()),
                          c && c()));
                    },
                anchorX: g,
                children: e,
              },
              t,
            );
          }),
        });
      };
    },
  },
  (e) => {
    var t = (t) => e((e.s = t));
    (e.O(0, [7127, 3217, 5721, 9059, 7358], () => t(31104)), (_N_E = e.O()));
  },
]);
