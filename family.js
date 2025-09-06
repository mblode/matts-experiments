(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [1833],
  {
    4871: (e, t, n) => {
      "use strict";
      (n.r(t),
        n.d(t, {
          Example: () => l,
        }));
      var r = n(51047),
        i = n(79772),
        o = n(669),
        s = n(7127);
      function l(e) {
        let {
          actions: t,
          children: n,
          className: l,
          actionChildren: a,
          description: c,
          wrapperClassName: u,
          code: d,
          descriptionClassName: h,
          ...f
        } = e;
        return (0, r.jsxs)("div", {
          ...f,
          children: [
            (0, r.jsxs)("div", {
              className: (0, o.$)(
                "mobile-full-width relative mb-[35px] mt-8 rounded-xl border-b border-t border-gray-400 bg-white dark:bg-[#11110E] sm:border-l sm:border-r sm:border-none sm:shadow-sm sm:dark:shadow-inset-border",
                u,
              ),
              children: [
                (0, r.jsx)("div", {
                  className: (0, i.x)(
                    "flex w-full px-4 py-6 sm:rounded-xl",
                    l || "",
                  ),
                  children: n,
                }),
                t
                  ? (0, r.jsxs)("div", {
                      className:
                        "flex justify-center gap-2 overflow-hidden rounded-b-xl border-t border-gray-400 bg-[#FBFBF9] p-2 py-2.5 dark:border dark:border-[#22221F] dark:bg-[#161612]",
                      children: [
                        null == t
                          ? void 0
                          : t.map((e) =>
                              (0, r.jsx)(
                                s.P.button,
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
                        a,
                      ],
                    })
                  : null,
                d || null,
              ],
            }),
            c
              ? (0, r.jsx)("p", {
                  className: (0, o.$)(
                    "-mt-5 mb-8 text-center text-xs text-gray-1000",
                    h,
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
    41833: (e, t, n) => {
      "use strict";
      let r;
      n.d(t, {
        Tray: () => K,
      });
      var i = n(51047),
        o = n(94215),
        s = n.n(o),
        l = n(93748),
        a = n(76847);
      let c = a.createContext({
          drawerRef: {
            current: null,
          },
          overlayRef: {
            current: null,
          },
          scaleBackground: () => {},
          onPress: () => {},
          onRelease: () => {},
          onDrag: () => {},
          onNestedDrag: () => {},
          onNestedOpenChange: () => {},
          onNestedRelease: () => {},
          openProp: void 0,
          dismissible: !1,
          isOpen: !1,
          keyboardIsOpen: {
            current: !1,
          },
          snapPointsOffset: null,
          snapPoints: null,
          modal: !1,
          shouldFade: !1,
          activeSnapPoint: null,
          onOpenChange: () => {},
          setActiveSnapPoint: () => {},
          visible: !1,
          closeDrawer: () => {},
          setVisible: () => {},
        }),
        u = () => a.useContext(c);
      n(88152);
      let d = a.useLayoutEffect;
      function h() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return function () {
          for (var e = arguments.length, n = Array(e), r = 0; r < e; r++)
            n[r] = arguments[r];
          for (let e of t) "function" == typeof e && e(...n);
        };
      }
      function f() {
        return (
          m(/^iPhone/) ||
          m(/^iPad/) ||
          (m(/^Mac/) && navigator.maxTouchPoints > 1)
        );
      }
      function m(e) {
        return null != window.navigator
          ? e.test(window.navigator.platform)
          : void 0;
      }
      let x = "undefined" != typeof document && window.visualViewport;
      function C(e) {
        let t = window.getComputedStyle(e);
        return /(auto|scroll)/.test(t.overflow + t.overflowX + t.overflowY);
      }
      function p(e) {
        for (C(e) && (e = e.parentElement); e && !C(e); ) e = e.parentElement;
        return e || document.scrollingElement || document.documentElement;
      }
      let g = new Set([
          "checkbox",
          "radio",
          "range",
          "color",
          "file",
          "image",
          "button",
          "submit",
          "reset",
        ]),
        w = 0;
      function v(e, t, n) {
        let r = e.style[t];
        return (
          (e.style[t] = n),
          () => {
            e.style[t] = r;
          }
        );
      }
      function b(e, t, n, r) {
        return (
          e.addEventListener(t, n, r),
          () => {
            e.removeEventListener(t, n, r);
          }
        );
      }
      function y(e) {
        let t = document.scrollingElement || document.documentElement;
        for (; e && e !== t; ) {
          let t = p(e);
          if (
            t !== document.documentElement &&
            t !== document.body &&
            t !== e
          ) {
            let n = t.getBoundingClientRect().top,
              r = e.getBoundingClientRect().top;
            e.getBoundingClientRect().bottom >
              t.getBoundingClientRect().bottom && (t.scrollTop += r - n);
          }
          e = t.parentElement;
        }
      }
      function j(e) {
        return (
          (e instanceof HTMLInputElement && !g.has(e.type)) ||
          e instanceof HTMLTextAreaElement ||
          (e instanceof HTMLElement && e.isContentEditable)
        );
      }
      function L() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return a.useCallback(
          (function () {
            for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return (e) =>
              t.forEach((t) => {
                "function" == typeof t ? t(e) : null != t && (t.current = e);
              });
          })(...t),
          t,
        );
      }
      let F = null,
        M = new WeakMap();
      function k(e, t) {
        let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (!e || !(e instanceof HTMLElement) || !t) return;
        let r = {};
        (Object.entries(t).forEach((t) => {
          let [n, i] = t;
          if (n.startsWith("--")) {
            e.style.setProperty(n, i);
            return;
          }
          ((r[n] = e.style[n]), (e.style[n] = i));
        }),
          n || M.set(e, r));
      }
      function A(e, t) {
        if (!e || !(e instanceof HTMLElement)) return;
        let n = M.get(e);
        n &&
          (t
            ? (e.style[t] = n[t])
            : Object.entries(n).forEach((t) => {
                let [n, r] = t;
                e.style[n] = r;
              }));
      }
      function E(e) {
        let t = window.getComputedStyle(e),
          n = t.transform || t.webkitTransform || t.mozTransform,
          r = n.match(/^matrix3d\((.+)\)$/);
        return r
          ? parseFloat(r[1].split(", ")[13])
          : (r = n.match(/^matrix\((.+)\)$/))
            ? parseFloat(r[1].split(", ")[5])
            : null;
      }
      let Z = {
        DURATION: 0.25,
        EASE: [0.165, 0.84, 0.44, 1],
      };
      function N(e) {
        let t = a.useRef(e);
        return (
          a.useEffect(() => {
            t.current = e;
          }),
          a.useMemo(
            () =>
              function () {
                for (
                  var e, n = arguments.length, r = Array(n), i = 0;
                  i < n;
                  i++
                )
                  r[i] = arguments[i];
                return null === (e = t.current) || void 0 === e
                  ? void 0
                  : e.call(t, ...r);
              },
            [],
          )
        );
      }
      let R = "vaul-dragging";
      function T(e) {
        var t;
        let {
            open: n,
            onOpenChange: o,
            children: s,
            shouldScaleBackground: u,
            onDrag: m,
            onRelease: C,
            snapPoints: g,
            nested: L,
            closeThreshold: M = 0.25,
            scrollLockTimeout: T = 100,
            dismissible: V = !0,
            fadeFromIndex: H = g && g.length - 1,
            activeSnapPoint: D,
            setActiveSnapPoint: S,
            fixed: W,
            modal: P = !0,
            onClose: O,
          } = e,
          [I = !1, B] = a.useState(!1),
          [z, U] = a.useState(!1),
          [Y, q] = a.useState(!1),
          [K, _] = a.useState(!1),
          [$, X] = a.useState(!1),
          [J, G] = a.useState(!1),
          Q = a.useRef(null),
          ee = a.useRef(null),
          et = a.useRef(null),
          en = a.useRef(null),
          er = a.useRef(null),
          ei = a.useRef(!1),
          eo = a.useRef(null),
          es = a.useRef(0),
          el = a.useRef(!1),
          ea = a.useRef(0),
          ec = a.useRef(null),
          eu = a.useRef(
            (null === (t = ec.current) || void 0 === t
              ? void 0
              : t.getBoundingClientRect().height) || 0,
          ),
          ed = a.useRef(0),
          eh = a.useCallback((e) => {
            g && e === ep.length - 1 && (ee.current = new Date());
          }, []),
          {
            activeSnapPoint: ef,
            activeSnapPointIndex: em,
            setActiveSnapPoint: ex,
            onRelease: eC,
            snapPointsOffset: ep,
            onDrag: eg,
            shouldFade: ew,
            getPercentageDragged: ev,
          } = (function (e) {
            let {
                activeSnapPointProp: t,
                setActiveSnapPointProp: n,
                snapPoints: r,
                drawerRef: i,
                overlayRef: o,
                fadeFromIndex: s,
                onSnapPointChange: l,
              } = e,
              [c, u] = (function (e) {
                let { prop: t, defaultProp: n, onChange: r = () => {} } = e,
                  [i, o] = (function (e) {
                    let { defaultProp: t, onChange: n } = e,
                      r = a.useState(t),
                      [i] = r,
                      o = a.useRef(i),
                      s = N(n);
                    return (
                      a.useEffect(() => {
                        o.current !== i && (s(i), (o.current = i));
                      }, [i, o, s]),
                      r
                    );
                  })({
                    defaultProp: n,
                    onChange: r,
                  }),
                  s = void 0 !== t,
                  l = s ? t : i,
                  c = N(r);
                return [
                  l,
                  a.useCallback(
                    (e) => {
                      if (s) {
                        let n = "function" == typeof e ? e(t) : e;
                        n !== t && c(n);
                      } else o(e);
                    },
                    [s, t, o, c],
                  ),
                ];
              })({
                prop: t,
                defaultProp: null == r ? void 0 : r[0],
                onChange: n,
              }),
              d = a.useMemo(
                () => c === (null == r ? void 0 : r[r.length - 1]),
                [r, c],
              ),
              h = (r && r.length > 0 && s && r[s] === c) || !r,
              f = a.useMemo(() => {
                var e;
                return null !==
                  (e = null == r ? void 0 : r.findIndex((e) => e === c)) &&
                  void 0 !== e
                  ? e
                  : null;
              }, [r, c]),
              m = a.useMemo(() => {
                var e;
                return null !==
                  (e =
                    null == r
                      ? void 0
                      : r.map((e) => {
                          let t = "string" == typeof e,
                            n = 0;
                          t && (n = parseInt(e, 10));
                          let r = t ? n : e * window.innerHeight;
                          return window.innerHeight - r;
                        })) && void 0 !== e
                  ? e
                  : [];
              }, [r]),
              x = a.useMemo(
                () => (null !== f ? (null == m ? void 0 : m[f]) : null),
                [m, f],
              ),
              C = a.useCallback(
                (e) => {
                  var t;
                  let n =
                    null !==
                      (t = null == m ? void 0 : m.findIndex((t) => t === e)) &&
                    void 0 !== t
                      ? t
                      : null;
                  (l(n),
                    k(i.current, {
                      transition: "transform "
                        .concat(Z.DURATION, "s cubic-bezier(")
                        .concat(Z.EASE.join(","), ")"),
                      transform: "translate3d(0, ".concat(e, "px, 0)"),
                    }),
                    m && n !== m.length - 1 && n !== s
                      ? k(o.current, {
                          transition: "opacity "
                            .concat(Z.DURATION, "s cubic-bezier(")
                            .concat(Z.EASE.join(","), ")"),
                          opacity: "0",
                        })
                      : k(o.current, {
                          transition: "opacity "
                            .concat(Z.DURATION, "s cubic-bezier(")
                            .concat(Z.EASE.join(","), ")"),
                          opacity: "1",
                        }),
                    u(null !== n ? (null == r ? void 0 : r[n]) : null));
                },
                [i.current, r, m, s, o, u],
              );
            return (
              a.useEffect(() => {
                if (t) {
                  var e;
                  let n =
                    null !==
                      (e = null == r ? void 0 : r.findIndex((e) => e === t)) &&
                    void 0 !== e
                      ? e
                      : null;
                  m && n && "number" == typeof m[n] && C(m[n]);
                }
              }, [t, r, m, C]),
              {
                isLastSnapPoint: d,
                activeSnapPoint: c,
                shouldFade: h,
                getPercentageDragged: function (e, t) {
                  if (!r || "number" != typeof f || !m || void 0 === s)
                    return null;
                  let n = f === s - 1;
                  if (f >= s && t) return 0;
                  if (n && !t) return 1;
                  if (!h && !n) return null;
                  let i = n ? f + 1 : f - 1,
                    o = e / Math.abs(n ? m[i] - m[i - 1] : m[i + 1] - m[i]);
                  return n ? 1 - o : o;
                },
                setActiveSnapPoint: u,
                activeSnapPointIndex: f,
                onRelease: function (e) {
                  let { draggedDistance: t, closeDrawer: n, velocity: i } = e;
                  if (void 0 === s) return;
                  let l = x - t,
                    a = f === s - 1,
                    c = 0 === f;
                  if (
                    (a &&
                      k(o.current, {
                        transition: "opacity "
                          .concat(Z.DURATION, "s cubic-bezier(")
                          .concat(Z.EASE.join(","), ")"),
                      }),
                    i > 2 && t < 0)
                  ) {
                    n();
                    return;
                  }
                  if (i > 2 && t > 0 && m && r) {
                    C(m[r.length - 1]);
                    return;
                  }
                  let u =
                    null == m
                      ? void 0
                      : m.reduce((e, t) =>
                          "number" != typeof e || "number" != typeof t
                            ? e
                            : Math.abs(t - l) < Math.abs(e - l)
                              ? t
                              : e,
                        );
                  if (i > 0.4 && Math.abs(t) < 0.4 * window.innerHeight) {
                    let e = t > 0 ? 1 : -1;
                    if (e > 0 && d) {
                      C(m[r.length - 1]);
                      return;
                    }
                    if ((c && e < 0 && n(), null === f)) return;
                    C(m[f + e]);
                    return;
                  }
                  C(u);
                },
                onDrag: function (e) {
                  let { draggedDistance: t } = e;
                  null !== x &&
                    k(i.current, {
                      transform: "translate3d(0, ".concat(x - t, "px, 0)"),
                    });
                },
                snapPointsOffset: m,
              }
            );
          })({
            snapPoints: g,
            activeSnapPointProp: D,
            setActiveSnapPointProp: S,
            drawerRef: ec,
            fadeFromIndex: H,
            overlayRef: Q,
            onSnapPointChange: eh,
          });
        !(function () {
          let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            { isDisabled: t } = e;
          d(() => {
            if (!t) {
              let e, t, n, i, o, s;
              return (
                1 == ++w &&
                  (r = f()
                    ? ((t = 0),
                      (n = window.pageXOffset),
                      (i = window.pageYOffset),
                      (o = h(
                        v(
                          document.documentElement,
                          "paddingRight",
                          "".concat(
                            window.innerWidth -
                              document.documentElement.clientWidth,
                            "px",
                          ),
                        ),
                        v(document.documentElement, "overflow", "hidden"),
                      )),
                      window.scrollTo(0, 0),
                      (s = h(
                        b(
                          document,
                          "touchstart",
                          (n) => {
                            ((e = p(n.target)) !== document.documentElement ||
                              e !== document.body) &&
                              (t = n.changedTouches[0].pageY);
                          },
                          {
                            passive: !1,
                            capture: !0,
                          },
                        ),
                        b(
                          document,
                          "touchmove",
                          (n) => {
                            if (
                              !e ||
                              e === document.documentElement ||
                              e === document.body
                            ) {
                              n.preventDefault();
                              return;
                            }
                            let r = n.changedTouches[0].pageY,
                              i = e.scrollTop,
                              o = e.scrollHeight - e.clientHeight;
                            0 !== o &&
                              (((i <= 0 && r > t) || (i >= o && r < t)) &&
                                n.preventDefault(),
                              (t = r));
                          },
                          {
                            passive: !1,
                            capture: !0,
                          },
                        ),
                        b(
                          document,
                          "touchend",
                          (e) => {
                            let t = e.target;
                            j(t) &&
                              t !== document.activeElement &&
                              (e.preventDefault(),
                              (t.style.transform = "translateY(-2000px)"),
                              t.focus(),
                              requestAnimationFrame(() => {
                                t.style.transform = "";
                              }));
                          },
                          {
                            passive: !1,
                            capture: !0,
                          },
                        ),
                        b(
                          document,
                          "focus",
                          (e) => {
                            let t = e.target;
                            j(t) &&
                              ((t.style.transform = "translateY(-2000px)"),
                              requestAnimationFrame(() => {
                                ((t.style.transform = ""),
                                  x &&
                                    (x.height < window.innerHeight
                                      ? requestAnimationFrame(() => {
                                          y(t);
                                        })
                                      : x.addEventListener(
                                          "resize",
                                          () => y(t),
                                          {
                                            once: !0,
                                          },
                                        )));
                              }));
                          },
                          !0,
                        ),
                        b(window, "scroll", () => {
                          window.scrollTo(0, 0);
                        }),
                      )),
                      () => {
                        (o(), s(), window.scrollTo(n, i));
                      })
                    : h(
                        v(
                          document.documentElement,
                          "paddingRight",
                          "".concat(
                            window.innerWidth -
                              document.documentElement.clientWidth,
                            "px",
                          ),
                        ),
                        v(document.documentElement, "overflow", "hidden"),
                      )),
                () => {
                  0 == --w && r();
                }
              );
            }
          }, [t]);
        })({
          isDisabled: !I || $ || !P || J || !z,
        });
        let { restorePositionSetting: eb } = (function (e) {
          let { isOpen: t, modal: n, nested: r, hasBeenOpened: i } = e,
            [o, s] = a.useState(window.location.href),
            l = a.useRef(0);
          function c() {
            if (null !== F) {
              let e = -parseInt(document.body.style.top, 10),
                t = -parseInt(document.body.style.left, 10);
              ((document.body.style.position = F.position),
                (document.body.style.top = F.top),
                (document.body.style.left = F.left),
                (document.body.style.height = F.height),
                (document.body.style.right = "unset"),
                requestAnimationFrame(() => {
                  if (o !== window.location.href) {
                    s(window.location.href);
                    return;
                  }
                  window.scrollTo(t, e);
                }),
                (F = null));
            }
          }
          return (
            a.useEffect(() => {
              function e() {
                l.current = window.scrollY;
              }
              return (
                e(),
                window.addEventListener("scroll", e),
                () => {
                  window.removeEventListener("scroll", e);
                }
              );
            }, []),
            a.useEffect(() => {
              r ||
                !i ||
                (t
                  ? ((function () {
                      if (null === F && t) {
                        F = {
                          position: document.body.style.position,
                          top: document.body.style.top,
                          left: document.body.style.left,
                          height: document.body.style.height,
                        };
                        let { scrollX: e, innerHeight: t } = window;
                        (document.body.style.setProperty(
                          "position",
                          "fixed",
                          "important",
                        ),
                          (document.body.style.top = "".concat(
                            -l.current,
                            "px",
                          )),
                          (document.body.style.left = "".concat(-e, "px")),
                          (document.body.style.right = "0px"),
                          (document.body.style.height = "auto"),
                          setTimeout(
                            () =>
                              requestAnimationFrame(() => {
                                let e = t - window.innerHeight;
                                e &&
                                  l.current >= t &&
                                  (document.body.style.top = "".concat(
                                    -(l.current + e),
                                    "px",
                                  ));
                              }),
                            300,
                          ));
                      }
                    })(),
                    n ||
                      setTimeout(() => {
                        c();
                      }, 500))
                  : c());
            }, [t, i, o]),
            {
              restorePositionSetting: c,
            }
          );
        })({
          isOpen: I,
          modal: P,
          nested: L,
          hasBeenOpened: z,
        });
        function ey() {
          return (window.innerWidth - 26) / window.innerWidth;
        }
        function ej(e, t) {
          var n;
          let r = e,
            i = new Date(),
            o =
              null === (n = window.getSelection()) || void 0 === n
                ? void 0
                : n.toString(),
            s = ec.current ? E(ec.current) : null;
          if (ee.current && i.getTime() - ee.current.getTime() < 500) return !1;
          if (s > 0) return !0;
          if (o && o.length > 0) return !1;
          if (
            (er.current && i.getTime() - er.current.getTime() < T && 0 === s) ||
            t
          )
            return ((er.current = new Date()), !1);
          for (; r; ) {
            if (r.scrollHeight > r.clientHeight) {
              if (0 !== r.scrollTop) return ((er.current = new Date()), !1);
              if ("dialog" === r.getAttribute("role")) break;
            }
            r = r.parentNode;
          }
          return !0;
        }
        function eL() {
          ec.current &&
            (null == O || O(),
            ec.current &&
              (k(ec.current, {
                transform: "translate3d(0, 110%, 0)",
                transition: "transform "
                  .concat(Z.DURATION, "s cubic-bezier(")
                  .concat(Z.EASE.join(","), ")"),
              }),
              k(Q.current, {
                opacity: "0",
                transition: "opacity "
                  .concat(Z.DURATION, "s cubic-bezier(")
                  .concat(Z.EASE.join(","), ")"),
              }),
              eM(!1)),
            setTimeout(() => {
              (q(!1), B(!1));
            }, 300),
            setTimeout(() => {
              g && ex(g[0]);
            }, 500));
        }
        function eF() {
          if (!ec.current) return;
          let e = document.querySelector("[vaul-drawer-wrapper]"),
            t = E(ec.current);
          (k(ec.current, {
            transform: "translate3d(0, 0, 0)",
            transition: "transform "
              .concat(Z.DURATION, "s cubic-bezier(")
              .concat(Z.EASE.join(","), ")"),
          }),
            k(Q.current, {
              transition: "opacity "
                .concat(Z.DURATION, "s cubic-bezier(")
                .concat(Z.EASE.join(","), ")"),
              opacity: "1",
            }),
            u &&
              t &&
              t > 0 &&
              I &&
              k(
                e,
                {
                  borderRadius: "".concat(8, "px"),
                  overflow: "hidden",
                  transform: "scale(".concat(
                    ey(),
                    ") translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)",
                  ),
                  transformOrigin: "top",
                  transitionProperty: "transform, border-radius",
                  transitionDuration: "".concat(Z.DURATION, "s"),
                  transitionTimingFunction: "cubic-bezier(".concat(
                    Z.EASE.join(","),
                    ")",
                  ),
                },
                !0,
              ));
        }
        function eM(e) {
          let t = document.querySelector("[vaul-drawer-wrapper]");
          t &&
            u &&
            (e
              ? (k(
                  document.body,
                  {
                    background: "black",
                  },
                  !0,
                ),
                k(t, {
                  borderRadius: "".concat(8, "px"),
                  overflow: "hidden",
                  transform: "scale(".concat(
                    ey(),
                    ") translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)",
                  ),
                  transformOrigin: "top",
                  transitionProperty: "transform, border-radius",
                  transitionDuration: "".concat(Z.DURATION, "s"),
                  transitionTimingFunction: "cubic-bezier(".concat(
                    Z.EASE.join(","),
                    ")",
                  ),
                }))
              : (A(t, "overflow"),
                A(t, "transform"),
                A(t, "borderRadius"),
                k(t, {
                  transitionProperty: "transform, border-radius",
                  transitionDuration: "".concat(Z.DURATION, "s"),
                  transitionTimingFunction: "cubic-bezier(".concat(
                    Z.EASE.join(","),
                    ")",
                  ),
                })));
        }
        return (
          a.useEffect(
            () => () => {
              (eM(!1), eb());
            },
            [],
          ),
          a.useEffect(() => {
            var e;
            function t() {
              if (ec.current && (j(document.activeElement) || el.current)) {
                var e;
                let t =
                    (null === (e = window.visualViewport) || void 0 === e
                      ? void 0
                      : e.height) || 0,
                  n = window.innerHeight - t,
                  r = ec.current.getBoundingClientRect().height || 0;
                ed.current || (ed.current = r);
                let i = ec.current.getBoundingClientRect().top;
                if (
                  (Math.abs(ea.current - n) > 60 && (el.current = !el.current),
                  g && g.length > 0 && ep && em && (n += ep[em] || 0),
                  (ea.current = n),
                  r > t || el.current)
                ) {
                  let e = ec.current.getBoundingClientRect().height,
                    r = e;
                  (e > t && (r = t - 26),
                    W
                      ? (ec.current.style.height = "".concat(
                          e - Math.max(n, 0),
                          "px",
                        ))
                      : (ec.current.style.height = "".concat(
                          Math.max(r, t - i),
                          "px",
                        )));
                } else ec.current.style.height = "".concat(ed.current, "px");
                g && g.length > 0 && !el.current
                  ? (ec.current.style.bottom = "0px")
                  : (ec.current.style.bottom = "".concat(Math.max(n, 0), "px"));
              }
            }
            return (
              null === (e = window.visualViewport) ||
                void 0 === e ||
                e.addEventListener("resize", t),
              () => {
                var e;
                return null === (e = window.visualViewport) || void 0 === e
                  ? void 0
                  : e.removeEventListener("resize", t);
              }
            );
          }, [em, g, ep]),
          a.useEffect(() => {
            if (!I && u) {
              let e = setTimeout(() => {
                A(document.body);
              }, 200);
              return () => clearTimeout(e);
            }
          }, [I, u]),
          a.useEffect(() => {
            n ? (B(!0), U(!0)) : eL();
          }, [n]),
          a.useEffect(() => {
            K && (null == o || o(I));
          }, [I]),
          a.useEffect(() => {
            _(!0);
          }, []),
          a.useEffect(() => {
            I && ((ee.current = new Date()), eM(!0));
          }, [I]),
          a.useEffect(() => {
            Y &&
              Y &&
              ec.current.querySelectorAll("*").forEach((e) => {
                (e.scrollHeight > e.clientHeight ||
                  e.scrollWidth > e.clientWidth) &&
                  e.classList.add("vaul-scrollable");
              });
          }, [Y]),
          (0, i.jsx)(l.bL, {
            modal: P,
            onOpenChange: (e) => {
              if (void 0 !== n) {
                null == o || o(e);
                return;
              }
              e ? (U(!0), B(e)) : eL();
            },
            open: I,
            children: (0, i.jsx)(c.Provider, {
              value: {
                visible: Y,
                activeSnapPoint: ef,
                snapPoints: g,
                setActiveSnapPoint: ex,
                drawerRef: ec,
                overlayRef: Q,
                scaleBackground: eM,
                onOpenChange: o,
                onPress: function (e) {
                  var t;
                  (V || g) &&
                    (!ec.current || ec.current.contains(e.target)) &&
                    ((eu.current =
                      (null === (t = ec.current) || void 0 === t
                        ? void 0
                        : t.getBoundingClientRect().height) || 0),
                    X(!0),
                    (et.current = new Date()),
                    f() &&
                      window.addEventListener(
                        "touchend",
                        () => (ei.current = !1),
                        {
                          once: !0,
                        },
                      ),
                    e.target.setPointerCapture(e.pointerId),
                    (es.current = e.screenY));
                },
                setVisible: q,
                onRelease: function (e) {
                  if (!$ || !ec.current) return;
                  (ei.current && j(e.target) && e.target.blur(),
                    ec.current.classList.remove(R),
                    (ei.current = !1),
                    X(!1),
                    (en.current = new Date()));
                  let t = E(ec.current);
                  if (
                    !ej(e.target, !1) ||
                    !t ||
                    Number.isNaN(t) ||
                    null === et.current
                  )
                    return;
                  let n = e.screenY,
                    r = en.current.getTime() - et.current.getTime(),
                    i = es.current - n,
                    o = Math.abs(i) / r;
                  if (
                    (o > 0.05 &&
                      (G(!0),
                      setTimeout(() => {
                        G(!1);
                      }, 200)),
                    g)
                  ) {
                    eC({
                      draggedDistance: i,
                      closeDrawer: eL,
                      velocity: o,
                    });
                    return;
                  }
                  if (i > 0) {
                    (eF(), null == C || C(e, !0));
                    return;
                  }
                  if (
                    o > 0.4 ||
                    t >=
                      Math.min(
                        ec.current.getBoundingClientRect().height || 0,
                        window.innerHeight,
                      ) *
                        M
                  ) {
                    (eL(), null == C || C(e, !1));
                    return;
                  }
                  (null == C || C(e, !0), eF());
                },
                onDrag: function (e) {
                  if ($) {
                    let t = es.current - e.screenY,
                      n = t > 0;
                    if (
                      (g && 0 === em && !V) ||
                      (!ei.current && !ej(e.target, n))
                    )
                      return;
                    if (
                      (ec.current.classList.add(R),
                      (ei.current = !0),
                      k(ec.current, {
                        transition: "none",
                      }),
                      k(Q.current, {
                        transition: "none",
                      }),
                      g &&
                        eg({
                          draggedDistance: t,
                        }),
                      t > 0 && !g)
                    ) {
                      let e = 8 * (Math.log(t + 1) - 2);
                      k(ec.current, {
                        transform: "translate3d(0, ".concat(
                          Math.min(-1 * e, 0),
                          "px, 0)",
                        ),
                      });
                      return;
                    }
                    let r = Math.abs(t),
                      i = document.querySelector("[vaul-drawer-wrapper]"),
                      o = r / eu.current,
                      s = ev(r, n);
                    null !== s && (o = s);
                    let l = 1 - o;
                    if (
                      ((ew || (H && em === H - 1)) &&
                        (null == m || m(e, o),
                        k(
                          Q.current,
                          {
                            opacity: "".concat(l),
                            transition: "none",
                          },
                          !0,
                        )),
                      i && Q.current && u)
                    ) {
                      let e = Math.min(ey() + o * (1 - ey()), 1),
                        t = 8 - 8 * o,
                        n = Math.max(0, 14 - 14 * o);
                      k(
                        i,
                        {
                          borderRadius: "".concat(t, "px"),
                          transform: "scale("
                            .concat(e, ") translate3d(0, ")
                            .concat(n, "px, 0)"),
                          transition: "none",
                        },
                        !0,
                      );
                    }
                    g ||
                      k(ec.current, {
                        transform: "translate3d(0, ".concat(r, "px, 0)"),
                      });
                  }
                },
                dismissible: V,
                isOpen: I,
                shouldFade: ew,
                closeDrawer: eL,
                onNestedDrag: function (e, t) {
                  if (t < 0) return;
                  let n = (window.innerWidth - 16) / window.innerWidth;
                  k(ec.current, {
                    transform: "scale("
                      .concat(n + t * (1 - n), ") translate3d(0, ")
                      .concat(-16 + 16 * t, "px, 0)"),
                    transition: "none",
                  });
                },
                onNestedOpenChange: function (e) {
                  let t = e ? (window.innerWidth - 16) / window.innerWidth : 1;
                  (eo.current && window.clearTimeout(eo.current),
                    k(ec.current, {
                      transition: "transform "
                        .concat(Z.DURATION, "s cubic-bezier(")
                        .concat(Z.EASE.join(","), ")"),
                      transform: "scale("
                        .concat(t, ") translate3d(0, ")
                        .concat(e ? -16 : 0, "px, 0)"),
                    }),
                    !e &&
                      ec.current &&
                      (eo.current = setTimeout(() => {
                        k(ec.current, {
                          transition: "none",
                          transform: "translate3d(0, ".concat(
                            E(ec.current),
                            "px, 0)",
                          ),
                        });
                      }, 500)));
                },
                onNestedRelease: function (e, t) {
                  let n = t ? (window.innerWidth - 16) / window.innerWidth : 1;
                  t &&
                    k(ec.current, {
                      transition: "transform "
                        .concat(Z.DURATION, "s cubic-bezier(")
                        .concat(Z.EASE.join(","), ")"),
                      transform: "scale("
                        .concat(n, ") translate3d(0, ")
                        .concat(t ? -16 : 0, "px, 0)"),
                    });
                },
                keyboardIsOpen: el,
                openProp: n,
                modal: P,
                snapPointsOffset: ep,
              },
              children: s,
            }),
          })
        );
      }
      let V = a.forwardRef(function (e, t) {
        let { children: n, ...r } = e,
          {
            overlayRef: o,
            snapPoints: s,
            onRelease: a,
            shouldFade: c,
            isOpen: d,
            visible: h,
          } = u(),
          f = L(t, o),
          m = s && s.length > 0;
        return (0, i.jsx)(l.hJ, {
          onMouseUp: a,
          ref: f,
          "vaul-drawer-visible": h ? "true" : "false",
          "vaul-overlay": "",
          "vaul-snap-points": d && m ? "true" : "false",
          "vaul-snap-points-overlay": d && c ? "true" : "false",
          ...r,
        });
      });
      V.displayName = "Drawer.Overlay";
      let H = a.forwardRef(function (e, t) {
        let {
            children: n,
            onOpenAutoFocus: r,
            onPointerDownOutside: o,
            onAnimationEnd: s,
            style: c,
            ...d
          } = e,
          {
            drawerRef: h,
            onPress: f,
            onRelease: m,
            onDrag: x,
            dismissible: C,
            keyboardIsOpen: p,
            snapPointsOffset: g,
            visible: w,
            closeDrawer: v,
            modal: b,
            openProp: y,
            onOpenChange: j,
            setVisible: F,
          } = u(),
          M = L(t, h);
        return (
          a.useEffect(() => {
            F(!0);
          }, []),
          (0, i.jsx)(l.UC, {
            onOpenAutoFocus: (e) => {
              r ? r(e) : (e.preventDefault(), h.current.focus());
            },
            onPointerDown: f,
            onPointerDownOutside: (e) => {
              if ((null == o || o(e), !b)) {
                e.preventDefault();
                return;
              }
              (p.current && (p.current = !1),
                e.preventDefault(),
                null == j || j(!1),
                C && void 0 === y && v());
            },
            onPointerMove: x,
            onPointerUp: m,
            ref: M,
            style:
              g && g.length > 0
                ? {
                    "--snap-point-height": "".concat(g[0], "px"),
                    ...c,
                  }
                : c,
            ...d,
            "vaul-drawer": "",
            "vaul-drawer-visible": w ? "true" : "false",
            children: n,
          })
        );
      });
      H.displayName = "Drawer.Content";
      let D = {
        Root: T,
        NestedRoot: function (e) {
          let { children: t, onDrag: n, onOpenChange: r, ...o } = e,
            {
              onNestedDrag: s,
              onNestedOpenChange: l,
              onNestedRelease: a,
            } = u();
          if (!s)
            throw Error("Drawer.NestedRoot must be placed in another drawer");
          return (0, i.jsx)(T, {
            nested: !0,
            onClose: () => {
              l(!1);
            },
            onDrag: (e, t) => {
              (s(e, t), null == n || n(e, t));
            },
            onOpenChange: (e) => {
              (e && l(e), null == r || r(e));
            },
            onRelease: a,
            ...o,
            children: t,
          });
        },
        Content: H,
        Overlay: V,
        Trigger: l.l9,
        Portal: l.ZL,
        Close: l.bm,
        Title: l.hE,
        Description: l.VY,
      };
      var S = n(7127),
        W = n(66400),
        P = n(23908),
        O = n(79772),
        I = n(4871);
      function B(e) {
        let { children: t, onClick: n } = e;
        return (0, i.jsx)("button", {
          className:
            "textLeft flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-[#F7F8F9] px-4 text-[17px] font-semibold text-[#222222] transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium",
          onClick: n,
          children: t,
        });
      }
      function z(e) {
        let { children: t, onClick: n, className: r } = e;
        return (0, i.jsx)("button", {
          className: (0, O.x)(
            "flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium",
            r,
          ),
          onClick: n,
          children: t,
        });
      }
      function U(e) {
        let { setView: t } = e;
        return (0, i.jsxs)("div", {
          children: [
            (0, i.jsxs)("div", {
              className: "px-2",
              children: [
                (0, i.jsxs)("header", {
                  className: "mt-[21px] border-b border-[#F5F5F5] pb-6",
                  children: [
                    (0, i.jsxs)("svg", {
                      width: "48",
                      height: "48",
                      viewBox: "0 0 48 48",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: [
                        (0, i.jsx)("path", {
                          d: "M16.4517 37C15.0283 36.9773 13.5916 36.9488 12.2178 36.9183C9.16956 36.8506 7.64544 36.8167 6.41564 36.1889C5.31269 35.6258 4.35358 34.6681 3.78881 33.566C3.15908 32.3372 3.12349 30.8373 3.0523 27.8376C3.02068 26.5048 3 25.1888 3 24.0259C3 22.8629 3.02068 21.5469 3.0523 20.2142C3.12349 17.2144 3.15908 15.7145 3.78881 14.4857C4.35358 13.3836 5.31269 12.4259 6.41564 11.8628C7.64544 11.235 9.16959 11.2011 12.2179 11.1334C15.4835 11.0609 19.1045 11 22.0566 11C25.6932 11 30.345 11.0924 34.0971 11.1852C35.0534 11.2088 35.5316 11.2206 35.9699 11.2967C38.4232 11.7225 40.436 13.7225 40.8775 16.173C40.9564 16.6107 40.9709 17.078 41 18.0126V18.0126V18.5916",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M10 24.0001H19",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M10 30H16",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M36.8607 32.1238C36.8607 34.2665 35.1086 36.0036 32.9472 36.0036C30.7859 36.0036 29.0337 34.2665 29.0337 32.1238C29.0337 29.981 30.7859 28.2439 32.9472 28.2439C35.1086 28.2439 36.8607 29.981 36.8607 32.1238Z",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M21.009 33.4638C20.6293 32.6114 20.6293 31.636 21.009 30.7836C23.0327 26.241 27.6168 23.0708 32.9478 23.0708C38.2788 23.0708 42.8629 26.2411 44.8866 30.7837C45.2664 31.6361 45.2664 32.6115 44.8866 33.4639C42.8629 38.0065 38.2788 41.1767 32.9478 41.1767C27.6168 41.1767 23.0327 38.0064 21.009 33.4638Z",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                      ],
                    }),
                    (0, i.jsx)("h2", {
                      className:
                        "mt-2.5 text-[22px] font-semibold text-[#222222] md:font-medium",
                      children: "Secret Recovery Phrase",
                    }),
                    (0, i.jsx)("p", {
                      className:
                        "mt-3 text-[17px] font-medium leading-[24px] text-[#999999] md:font-normal",
                      children:
                        "Your Secret Recovery Phrase is the key used to back up your wallet. Keep it secret at all times.",
                    }),
                  ],
                }),
                (0, i.jsxs)("ul", {
                  className: "mt-6 space-y-4",
                  children: [
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              fillRule: "evenodd",
                              clipRule: "evenodd",
                              d: "M3.08654 6.41197C3.13639 5.95634 3.5287 5.62685 3.98583 5.59345C6.79146 5.38847 9.00727 4.30249 11.0607 2.59943C11.4593 2.26879 12.0405 2.26879 12.4391 2.59944C14.4925 4.30249 16.7083 5.38846 19.5139 5.59345C19.9711 5.62685 20.3634 5.95638 20.4132 6.41203C20.4704 6.93468 20.4998 7.46586 20.4998 8.00402C20.4998 13.9495 17.4683 19.0446 12.4223 21.1815C11.9928 21.3634 11.507 21.3634 11.0775 21.1815C6.03148 19.0446 3 13.9495 3 8.00402C3 7.46584 3.02936 6.93464 3.08654 6.41197Z",
                              stroke: "#A5A5A5",
                              strokeWidth: "2",
                            }),
                            (0, i.jsx)("path", {
                              d: "M8.49097 11.7295L10.8281 14.0359L15.5023 9.4232",
                              stroke: "#A5A5A5",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }),
                          ],
                        }),
                        "Keep your Secret Phrase safe",
                      ],
                    }),
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              d: "M1.75 12L2.75 12L1.75 12ZM12 20.25L12 21.25L12 20.25ZM5.15863 20.1131L5.19061 19.1136L5.15863 20.1131ZM22.1376 7.15748L23.1369 7.11999L22.1376 7.15748ZM2.86171 16.805C2.80378 15.2613 2.75 13.4384 2.75 12L0.75 12C0.75 13.4772 0.804975 15.3306 0.863116 16.88L2.86171 16.805ZM2.75 12C2.75 10.5616 2.80378 8.73874 2.86171 7.19498L0.863117 7.11999C0.804975 8.66944 0.75 10.5228 0.75 12L2.75 12ZM5.19061 4.88636C7.25799 4.82021 9.93991 4.75 12 4.75L12 2.75C9.90598 2.75 7.1972 2.82114 5.12666 2.88738L5.19061 4.88636ZM12 4.75C14.0601 4.75 16.742 4.82021 18.8094 4.88636L18.8733 2.88738C16.8028 2.82114 14.094 2.75 12 2.75L12 4.75ZM21.1383 7.19498C21.1962 8.73874 21.25 10.5616 21.25 12L23.25 12C23.25 10.5228 23.195 8.66944 23.1369 7.11999L21.1383 7.19498ZM21.25 12C21.25 13.4384 21.1962 15.2613 21.1383 16.805L23.1369 16.88C23.195 15.3306 23.25 13.4772 23.25 12L21.25 12ZM18.8094 19.1136C16.742 19.1798 14.0601 19.25 12 19.25L12 21.25C14.094 21.25 16.8028 21.1789 18.8733 21.1126L18.8094 19.1136ZM12 19.25C9.93991 19.25 7.25799 19.1798 5.19061 19.1136L5.12666 21.1126C7.1972 21.1789 9.90598 21.25 12 21.25L12 19.25ZM2.86171 7.19498C2.90906 5.93324 3.92285 4.92692 5.19061 4.88636L5.12666 2.88738C2.81454 2.96136 0.950076 4.80253 0.863117 7.11999L2.86171 7.19498ZM0.863116 16.88C0.950076 19.1975 2.81454 21.0386 5.12666 21.1126L5.19061 19.1136C3.92285 19.0731 2.90906 18.0668 2.86171 16.805L0.863116 16.88ZM21.1383 16.805C21.0909 18.0668 20.0772 19.0731 18.8094 19.1136L18.8733 21.1126C21.1855 21.0386 23.0499 19.1975 23.1369 16.88L21.1383 16.805ZM18.8094 4.88636C20.0772 4.92692 21.0909 5.93324 21.1383 7.19498L23.1369 7.11999C23.0499 4.80253 21.1855 2.96136 18.8733 2.88738L18.8094 4.88636Z",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "5.49951",
                              y: "7.12207",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "5.49951",
                              y: "11.0234",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "5.49951",
                              y: "14.9248",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "12.6504",
                              y: "7.12207",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "12.6504",
                              y: "11.0234",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "12.6504",
                              y: "14.9248",
                              width: "5.85",
                              height: "1.95",
                              rx: "0.975",
                              fill: "#A5A5A5",
                            }),
                          ],
                        }),
                        "Don’t share it with anyone else",
                      ],
                    }),
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              d: "M12 2.99976C7.02944 2.99976 3 7.02919 3 11.9998C3 16.9703 7.02944 20.9998 12 20.9998C16.9706 20.9998 21 16.9703 21 11.9998C21 7.02919 16.9706 2.99976 12 2.99976Z",
                              stroke: "#A5A5A5",
                              strokeWidth: "2.2",
                            }),
                            (0, i.jsx)("path", {
                              d: "M5.63599 5.63602L18.3639 18.3639",
                              stroke: "#A5A5A5",
                              strokeWidth: "2.2",
                            }),
                          ],
                        }),
                        "If you lose it, we can’t recover it",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "mt-7 flex gap-4",
              children: [
                (0, i.jsx)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#F0F2F4] text-[#222222]",
                  children: "Cancel",
                }),
                (0, i.jsxs)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#4DAFFF] text-[#FFFFFF]",
                  children: [
                    (0, i.jsx)("svg", {
                      width: "20",
                      height: "19",
                      viewBox: "0 0 20 19",
                      fill: "none",
                      className: "mr-[-4px]",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: (0, i.jsx)("path", {
                        d: "M1.66382 6.44434C1.00513 6.44434 0.634033 6.07324 0.634033 5.396V3.16016C0.634033 1.11914 1.72876 0.0429688 3.77905 0.0429688H6.01489C6.69214 0.0429688 7.06323 0.404785 7.06323 1.07275C7.06323 1.74072 6.69214 2.11182 6.01489 2.11182H3.95532C3.13892 2.11182 2.70288 2.52002 2.70288 3.37354V5.396C2.70288 6.07324 2.34106 6.44434 1.66382 6.44434ZM18.1497 6.44434C17.4817 6.44434 17.1106 6.07324 17.1106 5.396V3.37354C17.1106 2.52002 16.6653 2.11182 15.8582 2.11182H13.7986C13.1213 2.11182 12.7502 1.74072 12.7502 1.07275C12.7502 0.404785 13.1213 0.0429688 13.7986 0.0429688H16.0344C18.094 0.0429688 19.1794 1.12842 19.1794 3.16016V5.396C19.1794 6.07324 18.8176 6.44434 18.1497 6.44434ZM9.16919 10.8696C8.67749 10.8696 8.37134 10.6099 8.37134 10.1738C8.37134 9.80273 8.65894 9.52441 9.03931 9.52441H9.29907C9.37329 9.52441 9.41968 9.47803 9.41968 9.39453V6.47217C9.41968 6.07324 9.68872 5.8042 10.0969 5.8042C10.4958 5.8042 10.7556 6.07324 10.7556 6.47217V9.3667C10.7556 10.3315 10.2268 10.8696 9.25269 10.8696H9.16919ZM6.46021 8.69873C5.99634 8.69873 5.65308 8.36475 5.65308 7.8916V6.62988C5.65308 6.15674 5.99634 5.81348 6.46021 5.81348C6.93335 5.81348 7.26733 6.15674 7.26733 6.62988V7.8916C7.26733 8.36475 6.93335 8.69873 6.46021 8.69873ZM13.3347 8.69873C12.8616 8.69873 12.5183 8.36475 12.5183 7.8916V6.62988C12.5183 6.15674 12.8616 5.81348 13.3347 5.81348C13.7986 5.81348 14.1326 6.15674 14.1326 6.62988V7.8916C14.1326 8.36475 13.7986 8.69873 13.3347 8.69873ZM9.86499 13.8848C8.68677 13.8848 7.50854 13.4209 6.77563 12.5767C6.64575 12.4189 6.59009 12.2705 6.59009 12.0942C6.59009 11.7139 6.87769 11.4263 7.25806 11.4263C7.48999 11.4263 7.62915 11.5376 7.79614 11.6953C8.31567 12.2241 9.10425 12.5581 9.86499 12.5581C10.6536 12.5581 11.4421 12.2056 11.9338 11.7046C12.1194 11.5005 12.2585 11.4263 12.4534 11.4263C12.8337 11.4263 13.1306 11.7139 13.1306 12.0942C13.1306 12.2983 13.0657 12.4653 12.9451 12.5859C12.1287 13.4023 10.9875 13.8848 9.86499 13.8848ZM3.77905 18.5884C1.72876 18.5884 0.634033 17.5029 0.634033 15.4712V13.2261C0.634033 12.5581 0.99585 12.187 1.66382 12.187C2.33179 12.187 2.70288 12.5581 2.70288 13.2261V15.2578C2.70288 16.1113 3.13892 16.5195 3.95532 16.5195H6.01489C6.69214 16.5195 7.06323 16.8906 7.06323 17.5493C7.06323 18.2173 6.69214 18.5884 6.01489 18.5884H3.77905ZM13.7986 18.5884C13.1213 18.5884 12.7502 18.2173 12.7502 17.5493C12.7502 16.8906 13.1213 16.5195 13.7986 16.5195H15.8582C16.6653 16.5195 17.1106 16.1113 17.1106 15.2578V13.2261C17.1106 12.5581 17.4724 12.187 18.1497 12.187C18.8083 12.187 19.1794 12.5581 19.1794 13.2261V15.4712C19.1794 17.5029 18.094 18.5884 16.0344 18.5884H13.7986Z",
                        fill: "white",
                      }),
                    }),
                    "Reveal",
                  ],
                }),
              ],
            }),
          ],
        });
      }
      function Y(e) {
        let { setView: t } = e;
        return (0, i.jsxs)("div", {
          children: [
            (0, i.jsxs)("div", {
              className: "px-2",
              children: [
                (0, i.jsxs)("header", {
                  className: "mt-[21px] border-b border-[#F5F5F5] pb-6",
                  children: [
                    (0, i.jsxs)("svg", {
                      width: "48",
                      height: "48",
                      viewBox: "0 0 48 48",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: [
                        (0, i.jsx)("path", {
                          d: "M16.4517 37C15.0283 36.9773 13.5916 36.9488 12.2178 36.9183C9.16956 36.8506 7.64544 36.8167 6.41564 36.1889C5.31269 35.6258 4.35358 34.6681 3.78881 33.566C3.15908 32.3372 3.12349 30.8373 3.0523 27.8376C3.02068 26.5048 3 25.1888 3 24.0259C3 22.8629 3.02068 21.5469 3.0523 20.2142C3.12349 17.2144 3.15908 15.7145 3.78881 14.4857C4.35358 13.3836 5.31269 12.4259 6.41564 11.8628C7.64544 11.235 9.16959 11.2011 12.2179 11.1334C15.4835 11.0609 19.1045 11 22.0566 11C25.6932 11 30.345 11.0924 34.0971 11.1852C35.0534 11.2088 35.5316 11.2206 35.9699 11.2967C38.4232 11.7225 40.436 13.7225 40.8775 16.173C40.9564 16.6107 40.9709 17.078 41 18.0126V18.0126V18.5916",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M10 24.0001H19",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M10 30H16",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M36.8607 32.1238C36.8607 34.2665 35.1086 36.0036 32.9472 36.0036C30.7859 36.0036 29.0337 34.2665 29.0337 32.1238C29.0337 29.981 30.7859 28.2439 32.9472 28.2439C35.1086 28.2439 36.8607 29.981 36.8607 32.1238Z",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M21.009 33.4638C20.6293 32.6114 20.6293 31.636 21.009 30.7836C23.0327 26.241 27.6168 23.0708 32.9478 23.0708C38.2788 23.0708 42.8629 26.2411 44.8866 30.7837C45.2664 31.6361 45.2664 32.6115 44.8866 33.4639C42.8629 38.0065 38.2788 41.1767 32.9478 41.1767C27.6168 41.1767 23.0327 38.0064 21.009 33.4638Z",
                          stroke: "#999999",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                      ],
                    }),
                    (0, i.jsx)("h2", {
                      className:
                        "mt-2.5 text-[22px] font-semibold text-[#222222] md:font-medium",
                      children: "Private Key",
                    }),
                    (0, i.jsx)("p", {
                      className:
                        "mt-3 text-[17px] font-medium leading-[24px] text-[#999999] md:font-normal",
                      children:
                        "Your Private Key is the key used to back up your wallet. Keep it secret and secure at all times.",
                    }),
                  ],
                }),
                (0, i.jsxs)("ul", {
                  className: "mt-6 space-y-4",
                  children: [
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              fillRule: "evenodd",
                              clipRule: "evenodd",
                              d: "M3.08654 6.41197C3.13639 5.95634 3.5287 5.62685 3.98583 5.59345C6.79146 5.38847 9.00727 4.30249 11.0607 2.59943C11.4593 2.26879 12.0405 2.26879 12.4391 2.59944C14.4925 4.30249 16.7083 5.38846 19.5139 5.59345C19.9711 5.62685 20.3634 5.95638 20.4132 6.41203C20.4704 6.93468 20.4998 7.46586 20.4998 8.00402C20.4998 13.9495 17.4683 19.0446 12.4223 21.1815C11.9928 21.3634 11.507 21.3634 11.0775 21.1815C6.03148 19.0446 3 13.9495 3 8.00402C3 7.46584 3.02936 6.93464 3.08654 6.41197Z",
                              stroke: "#A5A5A5",
                              strokeWidth: "2",
                            }),
                            (0, i.jsx)("path", {
                              d: "M8.49097 11.7295L10.8281 14.0359L15.5023 9.4232",
                              stroke: "#A5A5A5",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }),
                          ],
                        }),
                        "Keep your private key safe",
                      ],
                    }),
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              d: "M1.75 12L2.75 12L1.75 12ZM12 20.25L12 21.25L12 20.25ZM5.15863 20.1131L5.19061 19.1136L5.15863 20.1131ZM22.1376 7.15748L23.1369 7.11999L22.1376 7.15748ZM2.86171 16.805C2.80378 15.2613 2.75 13.4384 2.75 12L0.75 12C0.75 13.4772 0.804975 15.3306 0.863116 16.88L2.86171 16.805ZM2.75 12C2.75 10.5616 2.80378 8.73874 2.86171 7.19498L0.863117 7.11999C0.804975 8.66944 0.75 10.5228 0.75 12L2.75 12ZM5.19061 4.88636C7.25799 4.82021 9.93991 4.75 12 4.75L12 2.75C9.90598 2.75 7.1972 2.82114 5.12666 2.88738L5.19061 4.88636ZM12 4.75C14.0601 4.75 16.742 4.82021 18.8094 4.88636L18.8733 2.88738C16.8028 2.82114 14.094 2.75 12 2.75L12 4.75ZM21.1383 7.19498C21.1962 8.73874 21.25 10.5616 21.25 12L23.25 12C23.25 10.5228 23.195 8.66944 23.1369 7.11999L21.1383 7.19498ZM21.25 12C21.25 13.4384 21.1962 15.2613 21.1383 16.805L23.1369 16.88C23.195 15.3306 23.25 13.4772 23.25 12L21.25 12ZM18.8094 19.1136C16.742 19.1798 14.0601 19.25 12 19.25L12 21.25C14.094 21.25 16.8028 21.1789 18.8733 21.1126L18.8094 19.1136ZM12 19.25C9.93991 19.25 7.25799 19.1798 5.19061 19.1136L5.12666 21.1126C7.1972 21.1789 9.90598 21.25 12 21.25L12 19.25ZM2.86171 7.19498C2.90906 5.93324 3.92285 4.92692 5.19061 4.88636L5.12666 2.88738C2.81454 2.96136 0.950076 4.80253 0.863117 7.11999L2.86171 7.19498ZM0.863116 16.88C0.950076 19.1975 2.81454 21.0386 5.12666 21.1126L5.19061 19.1136C3.92285 19.0731 2.90906 18.0668 2.86171 16.805L0.863116 16.88ZM21.1383 16.805C21.0909 18.0668 20.0772 19.0731 18.8094 19.1136L18.8733 21.1126C21.1855 21.0386 23.0499 19.1975 23.1369 16.88L21.1383 16.805ZM18.8094 4.88636C20.0772 4.92692 21.0909 5.93324 21.1383 7.19498L23.1369 7.11999C23.0499 4.80253 21.1855 2.96136 18.8733 2.88738L18.8094 4.88636Z",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "5.5",
                              y: "10.75",
                              width: "12",
                              height: "2",
                              rx: "1",
                              fill: "#A5A5A5",
                            }),
                            (0, i.jsx)("rect", {
                              x: "5.5",
                              y: "14.75",
                              width: "9",
                              height: "2",
                              rx: "1",
                              fill: "#A5A5A5",
                            }),
                          ],
                        }),
                        "Don’t share it with anyone else",
                      ],
                    }),
                    (0, i.jsxs)("li", {
                      className:
                        "flex items-center gap-3 text-[15px] font-semibold text-[#999999] md:font-medium",
                      children: [
                        (0, i.jsxs)("svg", {
                          width: "24",
                          height: "24",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          xmlns: "http://www.w3.org/2000/svg",
                          children: [
                            (0, i.jsx)("path", {
                              d: "M12 2.99976C7.02944 2.99976 3 7.02919 3 11.9998C3 16.9703 7.02944 20.9998 12 20.9998C16.9706 20.9998 21 16.9703 21 11.9998C21 7.02919 16.9706 2.99976 12 2.99976Z",
                              stroke: "#A5A5A5",
                              strokeWidth: "2.2",
                            }),
                            (0, i.jsx)("path", {
                              d: "M5.63599 5.63602L18.3639 18.3639",
                              stroke: "#A5A5A5",
                              strokeWidth: "2.2",
                            }),
                          ],
                        }),
                        "If you lose it, we can’t recover it",
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "mt-7 flex gap-4",
              children: [
                (0, i.jsx)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#F0F2F4] text-[#222222]",
                  children: "Cancel",
                }),
                (0, i.jsxs)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#4DAFFF] text-[#FFFFFF]",
                  children: [
                    (0, i.jsx)("svg", {
                      width: "20",
                      height: "19",
                      viewBox: "0 0 20 19",
                      fill: "none",
                      className: "mr-[-4px]",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: (0, i.jsx)("path", {
                        d: "M1.66382 6.44434C1.00513 6.44434 0.634033 6.07324 0.634033 5.396V3.16016C0.634033 1.11914 1.72876 0.0429688 3.77905 0.0429688H6.01489C6.69214 0.0429688 7.06323 0.404785 7.06323 1.07275C7.06323 1.74072 6.69214 2.11182 6.01489 2.11182H3.95532C3.13892 2.11182 2.70288 2.52002 2.70288 3.37354V5.396C2.70288 6.07324 2.34106 6.44434 1.66382 6.44434ZM18.1497 6.44434C17.4817 6.44434 17.1106 6.07324 17.1106 5.396V3.37354C17.1106 2.52002 16.6653 2.11182 15.8582 2.11182H13.7986C13.1213 2.11182 12.7502 1.74072 12.7502 1.07275C12.7502 0.404785 13.1213 0.0429688 13.7986 0.0429688H16.0344C18.094 0.0429688 19.1794 1.12842 19.1794 3.16016V5.396C19.1794 6.07324 18.8176 6.44434 18.1497 6.44434ZM9.16919 10.8696C8.67749 10.8696 8.37134 10.6099 8.37134 10.1738C8.37134 9.80273 8.65894 9.52441 9.03931 9.52441H9.29907C9.37329 9.52441 9.41968 9.47803 9.41968 9.39453V6.47217C9.41968 6.07324 9.68872 5.8042 10.0969 5.8042C10.4958 5.8042 10.7556 6.07324 10.7556 6.47217V9.3667C10.7556 10.3315 10.2268 10.8696 9.25269 10.8696H9.16919ZM6.46021 8.69873C5.99634 8.69873 5.65308 8.36475 5.65308 7.8916V6.62988C5.65308 6.15674 5.99634 5.81348 6.46021 5.81348C6.93335 5.81348 7.26733 6.15674 7.26733 6.62988V7.8916C7.26733 8.36475 6.93335 8.69873 6.46021 8.69873ZM13.3347 8.69873C12.8616 8.69873 12.5183 8.36475 12.5183 7.8916V6.62988C12.5183 6.15674 12.8616 5.81348 13.3347 5.81348C13.7986 5.81348 14.1326 6.15674 14.1326 6.62988V7.8916C14.1326 8.36475 13.7986 8.69873 13.3347 8.69873ZM9.86499 13.8848C8.68677 13.8848 7.50854 13.4209 6.77563 12.5767C6.64575 12.4189 6.59009 12.2705 6.59009 12.0942C6.59009 11.7139 6.87769 11.4263 7.25806 11.4263C7.48999 11.4263 7.62915 11.5376 7.79614 11.6953C8.31567 12.2241 9.10425 12.5581 9.86499 12.5581C10.6536 12.5581 11.4421 12.2056 11.9338 11.7046C12.1194 11.5005 12.2585 11.4263 12.4534 11.4263C12.8337 11.4263 13.1306 11.7139 13.1306 12.0942C13.1306 12.2983 13.0657 12.4653 12.9451 12.5859C12.1287 13.4023 10.9875 13.8848 9.86499 13.8848ZM3.77905 18.5884C1.72876 18.5884 0.634033 17.5029 0.634033 15.4712V13.2261C0.634033 12.5581 0.99585 12.187 1.66382 12.187C2.33179 12.187 2.70288 12.5581 2.70288 13.2261V15.2578C2.70288 16.1113 3.13892 16.5195 3.95532 16.5195H6.01489C6.69214 16.5195 7.06323 16.8906 7.06323 17.5493C7.06323 18.2173 6.69214 18.5884 6.01489 18.5884H3.77905ZM13.7986 18.5884C13.1213 18.5884 12.7502 18.2173 12.7502 17.5493C12.7502 16.8906 13.1213 16.5195 13.7986 16.5195H15.8582C16.6653 16.5195 17.1106 16.1113 17.1106 15.2578V13.2261C17.1106 12.5581 17.4724 12.187 18.1497 12.187C18.8083 12.187 19.1794 12.5581 19.1794 13.2261V15.4712C19.1794 17.5029 18.094 18.5884 16.0344 18.5884H13.7986Z",
                        fill: "white",
                      }),
                    }),
                    "Reveal",
                  ],
                }),
              ],
            }),
          ],
        });
      }
      function q(e) {
        let { setView: t } = e;
        return (0, i.jsxs)("div", {
          children: [
            (0, i.jsxs)("div", {
              className: "px-2",
              children: [
                (0, i.jsxs)("header", {
                  className: "mt-[21px]",
                  children: [
                    (0, i.jsxs)("svg", {
                      width: "48",
                      height: "48",
                      viewBox: "0 0 48 48",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg",
                      children: [
                        (0, i.jsx)("path", {
                          d: "M22 43C32.4934 43 41 34.4934 41 24C41 13.5066 32.4934 5 22 5C11.5066 5 3 13.5066 3 24C3 34.4934 11.5066 43 22 43Z",
                          stroke: "#FF3F3F",
                          strokeWidth: "2.75",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                        (0, i.jsx)("path", {
                          d: "M23.55 26.5008L23.9334 14.9989C23.9698 13.9059 23.0936 13 22 13C20.9064 13 20.0302 13.9059 20.0666 14.9989L20.45 26.5008C20.4779 27.3367 21.1636 28 22 28C22.8364 28 23.5221 27.3367 23.55 26.5008Z",
                          fill: "#FF3F3F",
                        }),
                        (0, i.jsx)("circle", {
                          cx: "21.9866",
                          cy: "33.2991",
                          r: "1.9866",
                          fill: "#FF3F3F",
                        }),
                      ],
                    }),
                    (0, i.jsx)("h2", {
                      className:
                        "mt-2.5 text-[22px] font-semibold text-[#222222] md:font-medium",
                      children: "Are you sure?",
                    }),
                  ],
                }),
                (0, i.jsx)("p", {
                  className:
                    "mt-3 text-[17px] font-medium leading-[24px] text-[#999999] md:font-normal",
                  children:
                    "You haven’t backed up your wallet yet. If you remove it, you could lose access forever. We suggest tapping and backing up your wallet first with a valid recovery method.",
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "mt-7 flex gap-4",
              children: [
                (0, i.jsx)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#F0F2F4] text-[#222222]",
                  children: "Cancel",
                }),
                (0, i.jsx)(z, {
                  onClick: () => t("default"),
                  className: "bg-[#FF3F40] text-[#FFFFFF]",
                  children: "Continue",
                }),
              ],
            }),
          ],
        });
      }
      function K() {
        let [e, t] = (0, a.useState)(!1),
          [n, r] = (0, a.useState)("default"),
          [o, l] = (0, a.useState)(!1),
          [c, { height: u }] = (0, P.A)(),
          d = (0, a.useMemo)(() => {
            switch (n) {
              case "remove":
                return (0, i.jsx)(q, {
                  setView: r,
                });
              case "key":
                return (0, i.jsx)(Y, {
                  setView: r,
                });
              case "phrase":
                return (0, i.jsx)(U, {
                  setView: r,
                });
            }
          }, [n]);
        return (
          (0, a.useEffect)(() => {
            o ||
              setTimeout(() => {
                r("default");
              }, 300);
          }, [o]),
          (0, i.jsx)(I.Example, {
            className: "h-[264px] items-center justify-center",
            children: (0, i.jsxs)(D.Root, {
              open: o,
              onOpenChange: l,
              children: [
                (0, i.jsx)(D.Trigger, {
                  asChild: !0,
                  children: (0, i.jsx)("button", {
                    className:
                      "h-[44px] rounded-full bg-white px-6 py-2 font-semibold text-black shadow-sm outline-none transition-colors hover:bg-gray-200 focus-visible:shadow-focus-ring-button dark:border dark:border-[#1F1F1E] dark:bg-gray-100 dark:text-white dark:shadow-none dark:hover:bg-[#151514] dark:focus-visible:shadow-focus-ring-button md:font-medium",
                    children: "Try it out",
                  }),
                }),
                (0, i.jsxs)(D.Portal, {
                  children: [
                    (0, i.jsx)(D.Overlay, {
                      className: "fixed inset-0 bg-black/30",
                      style: {
                        zIndex: 0x2540be3ff,
                      },
                    }),
                    (0, i.jsx)(D.Content, {
                      asChild: !0,
                      children: (0, i.jsx)(S.P.div, {
                        initial: !1,
                        animate: {
                          height: "default" === n ? 290 : u,
                          transition: {
                            duration: 0.27,
                            ease: [0.25, 1, 0.5, 1],
                          },
                        },
                        className: (0, O.x)(
                          "fixed inset-x-4 bottom-4 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-[#FEFFFE] outline-none md:mx-auto md:w-full",
                          s().className,
                        ),
                        style: {
                          zIndex: 0x2540be3ff,
                        },
                        children: (0, i.jsxs)("div", {
                          ref: c,
                          className: "px-6 pb-6 pt-2.5",
                          children: [
                            (0, i.jsx)(D.Close, {
                              asChild: !0,
                              children: (0, i.jsx)(S.P.button, {
                                initial: !1,
                                animate: {
                                  top: "default" === n ? 28 : 32,
                                  right: "default" === n ? 28 : 32,
                                },
                                transition: {
                                  ease: [0.25, 1, 0.5, 1],
                                  duration: 0.27,
                                },
                                className:
                                  "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8F9] text-[#949595] transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-75",
                                children: (0, i.jsxs)("svg", {
                                  width: "12",
                                  height: "12",
                                  viewBox: "0 0 12 12",
                                  fill: "none",
                                  xmlns: "http://www.w3.org/2000/svg",
                                  children: [
                                    (0, i.jsx)("path", {
                                      d: "M10.4854 1.99998L2.00007 10.4853",
                                      stroke: "#999999",
                                      strokeWidth: "3",
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                    }),
                                    (0, i.jsx)("path", {
                                      d: "M10.4854 10.4844L2.00007 1.99908",
                                      stroke: "#999999",
                                      strokeWidth: "3",
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                    }),
                                  ],
                                }),
                              }),
                            }),
                            (0, i.jsx)(W.N, {
                              initial: !1,
                              mode: "popLayout",
                              custom: n,
                              children:
                                "default" !== n
                                  ? (0, i.jsx)(
                                      S.P.div,
                                      {
                                        initial: "hidden",
                                        animate: "visible",
                                        exit: "hidden",
                                        variants: _,
                                        transition: {
                                          ease: [0.26, 0.08, 0.25, 1],
                                          duration:
                                            "remove" === n ? 0.15 : 0.27,
                                        },
                                        children: d,
                                      },
                                      "reveal",
                                    )
                                  : (0, i.jsxs)(
                                      S.P.div,
                                      {
                                        initial: "hidden",
                                        animate: "visible",
                                        exit: "hidden",
                                        variants: _,
                                        transition: {
                                          ease: [0.26, 0.08, 0.25, 1],
                                          duration: 0.22,
                                        },
                                        children: [
                                          (0, i.jsx)("header", {
                                            className:
                                              "mb-4 flex h-[72px] items-center border-b border-[#F7F7F7] pl-2",
                                            children: (0, i.jsx)("h2", {
                                              className:
                                                "text-[19px] font-semibold text-[#222222] md:font-medium",
                                              children: "Options",
                                            }),
                                          }),
                                          (0, i.jsxs)("div", {
                                            className: "space-y-3",
                                            children: [
                                              (0, i.jsxs)(B, {
                                                onClick: () => {
                                                  r("key");
                                                },
                                                children: [
                                                  (0, i.jsxs)("svg", {
                                                    style: {
                                                      transform:
                                                        "translateY(-1px)",
                                                    },
                                                    width: "20",
                                                    height: "21",
                                                    viewBox: "0 0 20 21",
                                                    fill: "none",
                                                    xmlns:
                                                      "http://www.w3.org/2000/svg",
                                                    children: [
                                                      (0, i.jsx)("path", {
                                                        d: "M6.00024 9V6C6.00024 3.79086 7.79111 2 10.0002 2V2C12.2094 2 14.0002 3.79086 14.0002 6V9",
                                                        stroke: "#8F8F8F",
                                                        strokeWidth: "2.33319",
                                                      }),
                                                      (0, i.jsx)("path", {
                                                        d: "M6.68423 9H13.3163V7H6.68423V9ZM16.0002 11.684V16.316H18.0002V11.684H16.0002ZM13.3163 19H6.68423V21H13.3163V19ZM4.00024 16.316V11.684H2.00024V16.316H4.00024ZM6.68423 19C5.20191 19 4.00024 17.7983 4.00024 16.316H2.00024C2.00024 18.9029 4.09734 21 6.68423 21V19ZM16.0002 16.316C16.0002 17.7983 14.7986 19 13.3163 19V21C15.9032 21 18.0002 18.9029 18.0002 16.316H16.0002ZM13.3163 9C14.7986 9 16.0002 10.2017 16.0002 11.684H18.0002C18.0002 9.09709 15.9032 7 13.3163 7V9ZM6.68423 7C4.09734 7 2.00024 9.09709 2.00024 11.684H4.00024C4.00024 10.2017 5.20191 9 6.68423 9V7Z",
                                                        fill: "#8F8F8F",
                                                      }),
                                                    ],
                                                  }),
                                                  "View Private Key",
                                                ],
                                              }),
                                              (0, i.jsxs)(B, {
                                                onClick: () => {
                                                  r("phrase");
                                                },
                                                children: [
                                                  (0, i.jsxs)("svg", {
                                                    width: "24",
                                                    height: "20",
                                                    viewBox: "0 0 24 20",
                                                    fill: "none",
                                                    xmlns:
                                                      "http://www.w3.org/2000/svg",
                                                    children: [
                                                      (0, i.jsx)("path", {
                                                        d: "M1.75049 10L2.75049 10L1.75049 10ZM12.0005 18.25L12.0005 19.25L12.0005 18.25ZM5.15912 18.1131L5.1911 17.1136L5.15912 18.1131ZM22.1381 5.15748L23.1374 5.11999L22.1381 5.15748ZM2.8622 14.805C2.80427 13.2613 2.75049 11.4384 2.75049 10L0.750488 10C0.750488 11.4772 0.805463 13.3306 0.863604 14.88L2.8622 14.805ZM2.75049 10C2.75049 8.56162 2.80427 6.73874 2.8622 5.19498L0.863605 5.11999C0.805463 6.66944 0.750488 8.5228 0.750488 10L2.75049 10ZM5.1911 2.88636C7.25848 2.82021 9.9404 2.75 12.0005 2.75L12.0005 0.75C9.90647 0.75 7.19769 0.821136 5.12715 0.887381L5.1911 2.88636ZM12.0005 2.75C14.0606 2.75 16.7425 2.82021 18.8099 2.88636L18.8738 0.887382C16.8033 0.821136 14.0945 0.75 12.0005 0.75L12.0005 2.75ZM21.1388 5.19498C21.1967 6.73874 21.2505 8.56162 21.2505 10L23.2505 10C23.2505 8.5228 23.1955 6.66944 23.1374 5.11999L21.1388 5.19498ZM21.2505 10C21.2505 11.4384 21.1967 13.2613 21.1388 14.805L23.1374 14.88C23.1955 13.3306 23.2505 11.4772 23.2505 10L21.2505 10ZM18.8099 17.1136C16.7425 17.1798 14.0606 17.25 12.0005 17.25L12.0005 19.25C14.0945 19.25 16.8033 19.1789 18.8738 19.1126L18.8099 17.1136ZM12.0005 17.25C9.9404 17.25 7.25848 17.1798 5.1911 17.1136L5.12715 19.1126C7.19769 19.1789 9.90647 19.25 12.0005 19.25L12.0005 17.25ZM2.8622 5.19498C2.90954 3.93324 3.92334 2.92692 5.1911 2.88636L5.12715 0.887381C2.81502 0.961356 0.950565 2.80253 0.863605 5.11999L2.8622 5.19498ZM0.863604 14.88C0.950564 17.1975 2.81502 19.0386 5.12715 19.1126L5.1911 17.1136C3.92334 17.0731 2.90954 16.0668 2.8622 14.805L0.863604 14.88ZM21.1388 14.805C21.0914 16.0668 20.0776 17.0731 18.8099 17.1136L18.8738 19.1126C21.186 19.0386 23.0504 17.1975 23.1374 14.88L21.1388 14.805ZM18.8099 2.88636C20.0776 2.92692 21.0914 3.93324 21.1388 5.19498L23.1374 5.11999C23.0504 2.80253 21.186 0.961356 18.8738 0.887382L18.8099 2.88636Z",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "5.5",
                                                        y: "5.12207",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "5.5",
                                                        y: "9.02344",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "5.5",
                                                        y: "12.9248",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "12.6509",
                                                        y: "5.12207",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "12.6509",
                                                        y: "9.02344",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                      (0, i.jsx)("rect", {
                                                        x: "12.6509",
                                                        y: "12.9248",
                                                        width: "5.85",
                                                        height: "1.95",
                                                        rx: "0.975",
                                                        fill: "#8F8F8F",
                                                      }),
                                                    ],
                                                  }),
                                                  "View Recovery Phase",
                                                ],
                                              }),
                                              (0, i.jsxs)("button", {
                                                className:
                                                  "textLeft flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-[#FFF0F0] px-4 text-[17px] font-semibold text-[#FF3F40] transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium",
                                                onClick: () => {
                                                  r("remove");
                                                },
                                                children: [
                                                  (0, i.jsxs)("svg", {
                                                    width: "21",
                                                    height: "20",
                                                    viewBox: "0 0 21 20",
                                                    fill: "none",
                                                    xmlns:
                                                      "http://www.w3.org/2000/svg",
                                                    children: [
                                                      (0, i.jsx)("path", {
                                                        d: "M11.6324 11.2514L11.8827 7.49726C11.9232 6.88978 11.4414 6.37476 10.8325 6.37476C10.2237 6.37476 9.74185 6.88978 9.78235 7.49726L10.0326 11.2514C10.0607 11.6725 10.4105 11.9998 10.8325 11.9998C11.2546 11.9998 11.6043 11.6725 11.6324 11.2514Z",
                                                        fill: "#FF3F3F",
                                                      }),
                                                      (0, i.jsx)("circle", {
                                                        cx: "10.8328",
                                                        cy: "14.0623",
                                                        r: "0.9375",
                                                        fill: "#FF3F3F",
                                                      }),
                                                      (0, i.jsx)("path", {
                                                        d: "M8.71062 3.09582C9.7307 1.5843 11.9348 1.5843 12.9549 3.09582C14.1585 4.87924 15.6235 7.09937 16.6453 8.81189C17.6058 10.4217 18.6773 12.4256 19.5531 14.1178C20.416 15.7849 19.2611 17.7558 17.3855 17.8327C15.3163 17.9175 12.8085 17.9994 10.8328 17.9994C8.85699 17.9994 6.34926 17.9175 4.28004 17.8327C2.40438 17.7558 1.24949 15.7849 2.11241 14.1178C2.98825 12.4256 4.05975 10.4217 5.02026 8.81189C6.04203 7.09937 7.50705 4.87924 8.71062 3.09582Z",
                                                        stroke: "#FF3F3F",
                                                        strokeWidth: "2",
                                                      }),
                                                    ],
                                                  }),
                                                  "Remove Wallet",
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      "default",
                                    ),
                            }),
                          ],
                        }),
                      }),
                    }),
                  ],
                }),
              ],
            }),
          })
        );
      }
      let _ = {
        initial: {
          opacity: 0,
          scale: 0.96,
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
        },
        hidden: (e) => {
          let t = {
            opacity: 0,
            scale: 0.96,
          };
          return (
            "remove" === e &&
              (t.transition = {
                ease: [0.26, 0.08, 0.25, 1],
                duration: 0.15,
              }),
            t
          );
        },
      };
    },
    79772: (e, t, n) => {
      "use strict";
      function r() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return t.join(" ");
      }
      n.d(t, {
        x: () => r,
      });
    },
    88152: () => {},
  },
]);
