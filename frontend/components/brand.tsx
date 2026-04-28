import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full Codexa logotype (icon + word). Use in headers and footers.
 * SVG aspect ratio is 2:1, so width is set and height auto-scales.
 */
export function Logo({
  className,
  width = 140,
  priority = false,
}: {
  className?: string;
  width?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/codex-logo.svg"
      alt="Codexa"
      width={width}
      height={Math.round(width / 2)}
      priority={priority}
      className={cn("h-auto select-none", className)}
    />
  );
}

/**
 * Square Codexa mark (icon glyph only). Use as avatar / favicon-style spots.
 */
export function Icon({
  className,
  size = 32,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/codex-icon.svg"
      alt="Codexa"
      width={size}
      height={size}
      priority={priority}
      className={cn("select-none", className)}
    />
  );
}
