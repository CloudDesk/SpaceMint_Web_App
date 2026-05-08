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

function getLenis() {
  return (window as WindowWithLenis).__spaceMintLenis;
}

export function interruptSmoothScroll() {
  const lenis = getLenis();

  if (!lenis) {
    return;
  }

  lenis.reset?.();
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
  interruptSmoothScroll();

  if (window.location.hash === hash) {
    scrollToPageTop({ defer: true });
    return;
  }

  window.history.pushState(null, "", hash);
  window.dispatchEvent(new Event("hashchange"));
  scrollToPageTop({ defer: true });
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
