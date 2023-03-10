import React from "react";
// eslint-disable-next-line
import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { forwardRefWithPolymorphic } from "@lib/utils/forwardRefWithPolymorphic";

export const button = cva(
  [
    "button",
    "hover:opacity-80",
    "disabled:hover:opacity-50",
    "disabled:opacity-50",
    "rounded-full",
    "flex",
    "justify-center",
    "items-center",
    "font-bold",
    "whitespace-nowrap",
  ],
  {
    variants: {
      intent: {
        primary: [],
        secondary: [],
        base: [],
      },
      outline: {
        true: ["ring-1 ring-inset"],
        false: [],
      },
      size: {
        small: ["text-sm", "h-8", "px-3"],
        medium: ["text-base", "h-10", "px-4"],
        large: ["text-base", "h-11", "px-5"],
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        outline: false,
        className: ["bg-red", "text-white"],
      },
      {
        intent: "primary",
        outline: true,
        className: ["ring-red", "text-red"],
      },
      {
        intent: "secondary",
        outline: false,
        className: ["bg-purple", "text-white"],
      },
      {
        intent: "secondary",
        outline: true,
        className: ["ring-purple", "text-purple"],
      },
      {
        intent: "base",
        outline: false,
        className: ["bg-gray-100"],
      },
      {
        intent: "base",
        outline: true,
        className: ["ring-gray-600 text-gray-600"],
      },
    ],
    defaultVariants: {
      intent: "base",
      outline: false,
      size: "medium",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof button>;

const DEFAULT_TAG: React.ElementType = "button";

export const Button = forwardRefWithPolymorphic<
  typeof DEFAULT_TAG,
  ButtonVariantProps
>(
  (
    {
      as: Element = DEFAULT_TAG,
      // custom props
      outline,
      intent,
      size,
      // handled props
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <Element
        ref={ref}
        type={type}
        className={twMerge(button({ intent, size, outline }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
