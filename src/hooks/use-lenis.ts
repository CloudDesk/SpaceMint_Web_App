import { useEffect } from "react";
import Lenis from "lenis";

type WindowWithLenis = Window & {
  __spaceMintLenis?: Lenis;
};

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.76,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    });

    (window as WindowWithLenis).__spaceMintLenis = lenis;

    let frame = 0;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as WindowWithLenis).__spaceMintLenis;
    };
  }, []);
}
