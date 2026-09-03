import type { JSX } from "react";

/** Props for {@link Icon}. */
interface IconProps {
  /** Accessible label for the icon. Defaults to `''`. */
  label?: string;
  /** Icon size. Defaults to `'24'`. */
  size?: "16" | "24" | "40";
  /** Which icon glyph to render. */
  variant:
    | "chevL"
    | "upload"
    | "download"
    | "plus"
    | "close"
    | "check"
    | "trash"
    | "edit"
    | "eye"
    | "search"
    | "pen"
    | "arrowR"
    | "moon"
    | "refresh";
  /** Called when the icon is clicked. */
  onClick?: () => void;
}

/**
 * Renders a named icon glyph via the `<e-icon>` custom element.
 *
 * @example
 * ```tsx
 * <Icon variant="trash" label="delete" />
 * ```
 */
export function Icon({ size = "24", variant, label = "", onClick }: IconProps): JSX.Element {
  return <e-icon name={variant} size={size} label={label} onClick={onClick}></e-icon>;
}
