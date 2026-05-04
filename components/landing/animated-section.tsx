"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedSection({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const shouldReduceMotion = useReducedMotion();

  const visible = shouldReduceMotion || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: shouldReduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
