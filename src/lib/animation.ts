import type { Variants } from "framer-motion";
import { activeDesignSystem } from "@/config/design-system";

const motion = activeDesignSystem.motion;

export const easeLuxury = motion.ease;

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: motion.distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motion.duration.reveal,
      ease: easeLuxury,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};
