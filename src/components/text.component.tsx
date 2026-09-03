import type { JSX, ReactElement } from "react";

import "./text.component.css";

interface TitleProps {
  /** Title label displayed to users */
  children: ReactElement | string;
  /** Defines the header size */
  size?: "1" | "2" | "3" | "4" | "5" | "6";
}

/**
 * Heading text, rendered through the `<e-title>` custom element.
 *
 * @example
 * ```tsx
 * <Title size="2">Projects</Title>
 * ```
 */
export function Title(props: TitleProps): JSX.Element {
  const size = props.size ?? "1";

  return <e-title level={size}>{props.children}</e-title>;
}

interface TitleLabelProps {
  /** Label all in uppercase and styling */
  children: string;
  /** Icon on the left */
  iconLeft?: ReactElement;
}

/**
 * Uppercase label text, optionally preceded by an icon.
 *
 * @example
 * ```tsx
 * <TitleLabel iconLeft={<Icon variant="chevL" onClick={goBack} />}>Projects</TitleLabel>
 * ```
 */
export function TitleLabel(props: TitleLabelProps): JSX.Element {
  if (props.iconLeft) {
    return (
      <div className="title-label-container">
        {props.iconLeft}
        <e-text kind="label" as="span">
          {props.children.toUpperCase()}
        </e-text>
      </div>
    );
  }

  return (
    <e-text kind="label" as="span">
      {props.children.toUpperCase()}
    </e-text>
  );
}

/** Props for {@link Mono}. */
interface MonoProps {
  /** Text content, rendered in a monospace font. */
  children: string;
  className?: string;
}

/**
 * Monospace inline text, rendered through the `<e-text kind="mono">` custom element.
 *
 * @example
 * ```tsx
 * <Mono>{'01'}</Mono>
 * ```
 */
export function Mono({ children, className = "" }: MonoProps): JSX.Element {
  return (
    <e-text kind="mono" as="span" className={className}>
      {children}
    </e-text>
  );
}
