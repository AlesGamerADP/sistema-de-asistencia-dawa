import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "./utils";

interface InputProps extends Omit<HTMLMotionProps<"input">, "onDrag"> {
  type?: string;
  className?: string;
}

function Input({ className, type, ...props }: InputProps) {
  return (
    <motion.input
      type={type}
      data-slot="input"
      className={cn(
        "w-full max-w-full px-4 py-2.5 rounded",
        "bg-white text-gray-900",
        "border border-gray-300",
        "focus:outline-none focus:border-gray-400",
        "transition-colors",
        "placeholder:text-gray-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "text-sm",
        "box-border",
        className,
      )}
      style={{ boxSizing: 'border-box' }}
      {...(props as any)}
    />
  );
}

export { Input };
