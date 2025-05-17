"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const avatarVariants = cva("relative inline-flex items-center justify-center", {
  variants: {
    shape: {
      square: "rounded-none",
      rounded: "rounded-lg",
      circle: "rounded-full",
    },
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
  },
  defaultVariants: {
    shape: "circle",
    size: "md",
  },
})

const badgePositionVariants = cva(
  "absolute z-10 flex items-center justify-center rounded-full border-2 border-background",
  {
    variants: {
      position: {
        "top-left": "-top-1 -left-1",
        "top-right": "-top-1 -right-1",
        "bottom-left": "-bottom-1 -left-1",
        "bottom-right": "-bottom-1 -right-1",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

// export interface EnhancedAvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
//   src?: string
//   alt?: string
//   fallback?: React.ReactNode
//   topLeftBadge?: React.ReactNode
//   topRightBadge?: React.ReactNode
//   bottomLeftBadge?: React.ReactNode
//   bottomRightBadge?: React.ReactNode
//   topLeftBadgeBg?: string
//   topRightBadgeBg?: string
//   bottomLeftBadgeBg?: string
//   bottomRightBadgeBg?: string
// }

// const EnhancedAvatar = React.forwardRef<HTMLDivElement, EnhancedAvatarProps>(
const EnhancedAvatar = (
  (
    {
      className,
      shape,
      size,
      src,
      alt,
      fallback,
      topLeftBadge,
      topRightBadge,
      bottomLeftBadge,
      bottomRightBadge,
      topLeftBadgeBg,
      topRightBadgeBg,
      bottomLeftBadgeBg,
      bottomRightBadgeBg,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn(avatarVariants({ shape, size }), className)} ref={ref} {...props}>
        <Avatar
          className={cn("h-full w-full", {
            "rounded-none": shape === "square",
            "rounded-lg": shape === "rounded",
            "rounded-full": shape === "circle",
          })}
        >
          {src && (
            <AvatarImage
              className={cn({
                "rounded-none": shape === "square",
                "rounded-lg": shape === "rounded",
                "rounded-full": shape === "circle",
              })}
              src={src || "/placeholder.svg"}
              alt={alt || "Avatar"}
            />
          )}
          {fallback && (
            <AvatarFallback
              className={cn({
                "rounded-none": shape === "square",
                "rounded-lg": shape === "rounded",
                "rounded-full": shape === "circle",
              })}
            >
              {fallback}
            </AvatarFallback>
          )}
        </Avatar>

        {topLeftBadge && (
          <div
            className={badgePositionVariants({
              position: "top-left",
              size,
            })}
            style={{ backgroundColor: topLeftBadgeBg || "white" }}
          >
            {topLeftBadge}
          </div>
        )}

        {topRightBadge && (
          <div
            className={badgePositionVariants({
              position: "top-right",
              size,
            })}
            style={{ backgroundColor: topRightBadgeBg || "white" }}
          >
            {topRightBadge}
          </div>
        )}

        {bottomLeftBadge && (
          <div
            className={badgePositionVariants({
              position: "bottom-left",
              size,
            })}
            style={{ backgroundColor: bottomLeftBadgeBg || "white" }}
          >
            {bottomLeftBadge}
          </div>
        )}

        {bottomRightBadge && (
          <div
            className={badgePositionVariants({
              position: "bottom-right",
              size,
            })}
            style={{ backgroundColor: bottomRightBadgeBg || "white" }}
          >
            {bottomRightBadge}
          </div>
        )}
      </div>
    )
  }
)

EnhancedAvatar.displayName = "EnhancedAvatar"

export { EnhancedAvatar }
