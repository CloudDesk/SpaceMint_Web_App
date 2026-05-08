type SpaceMintLenis = {
  reset?: () => void;
  resize?: () => void;
  start?: () => void;
  stop?: () => void;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      duration?: number;
      force?: boolean;
      immediate?: boolean;
      lock?: boolean;
      offset?: number;
    },
  ) => void;
};

type WindowWithLenis = Window & {
  __spaceMintLenis?: SpaceMintLenis;
};

type RouteScrollIntent = "restore" | "top";

const routeScrollPositions = new Map<string, number>();
let nextRouteScrollIntent: RouteScrollIntent = "top";

function getLenis() {
  return (window as WindowWithLenis).__spaceMintLenis;
}

function getRouteScrollKey(hash: string) {
  return hash || "#";
}

function getCurrentScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function interruptSmoothScroll() {
  const lenis = getLenis();

  if (!lenis) {
    return;
  }

  lenis.reset?.();
}

function scrollToPosition(position: number, immediate = true) {
  const nextPosition = Math.max(position, 0);
  const lenis = getLenis();

  if (lenis) {
    lenis.reset?.();
    lenis.resize?.();
    lenis.scrollTo(nextPosition, {
      duration: immediate ? 0 : 0.72,
      force: true,
      immediate,
      lock: false,
    });
  } else {
    window.scrollTo({
      top: nextPosition,
      left: 0,
      behavior: immediate ? "auto" : "smooth",
    });
  }

  if (immediate) {
    document.documentElement.scrollTop = nextPosition;
    document.body.scrollTop = nextPosition;
  }
}

function runPageTopScroll(immediate = false) {
  const lenis = getLenis();

  if (lenis) {
    lenis.reset?.();
    lenis.resize?.();
    lenis.scrollTo(0, {
      duration: immediate ? 0 : 0.82,
      force: true,
      immediate,
      lock: false,
    });
  } else {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: immediate ? "auto" : "smooth",
    });
  }

  if (immediate) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

export function saveRouteScrollPosition(hash = window.location.hash) {
  routeScrollPositions.set(getRouteScrollKey(hash), getCurrentScrollY());
}

export function markNextRouteForRestore() {
  nextRouteScrollIntent = "restore";
}

export function markNextRouteForTop() {
  nextRouteScrollIntent = "top";
}

export function restoreOrScrollToTop(
  hash = window.location.hash,
  options: { defer?: boolean } = {},
) {
  const scrollIntent = nextRouteScrollIntent;
  nextRouteScrollIntent = "top";

  const runScroll = () => {
    if (scrollIntent === "restore") {
      const savedPosition = routeScrollPositions.get(getRouteScrollKey(hash));

      if (typeof savedPosition === "number") {
        scrollToPosition(savedPosition, true);
        return;
      }
    }

    runPageTopScroll(false);
  };

  if (!options.defer) {
    runScroll();
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(runScroll);
  });
}

export function scrollToPageTop(options: { defer?: boolean; immediate?: boolean } = {}) {
  if (!options.defer) {
    runPageTopScroll(options.immediate);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => runPageTopScroll(options.immediate));
  });
}

export function navigateToHash(hash: string) {
  saveRouteScrollPosition();
  markNextRouteForTop();
  interruptSmoothScroll();

  if (window.location.hash === hash) {
    scrollToPageTop({ defer: true });
    return;
  }

  window.history.pushState(null, "", hash);
  window.dispatchEvent(new Event("hashchange"));
}

export function scrollToElement(
  target: string | HTMLElement,
  options: { offset?: number } = {},
) {
  const lenis = getLenis();
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

  if (!element) {
    return;
  }

  if (lenis) {
    lenis.reset?.();
    lenis.resize?.();
    lenis.scrollTo(element, {
      duration: 0.78,
      force: true,
      lock: false,
      offset: options.offset ?? -112,
    });
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
}
