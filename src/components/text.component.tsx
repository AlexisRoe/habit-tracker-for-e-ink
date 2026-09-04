import type { JSX, ReactElement } from "react";

import "./text.component.css";

/** Props for {@link Text.Title}. */
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
 * <Text.Title size="2">Projects</Text.Title>
 * ```
 */
function TitleText(props: TitleProps): JSX.Element {
  const size = props.size ?? "1";

  return <e-title level={size}>{props.children}</e-title>;
}

/** Props for {@link Text.Label}. */
interface LabelProps {
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
 * <Text.Label iconLeft={<Icon variant="chevL" onClick={goBack} />}>Projects</Text.Label>
 * ```
 */
function LabelText(props: LabelProps): JSX.Element {
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

/** Props for {@link Text}. */
interface TextProps {
  /** Text content, rendered as a paragraph. */
  children: ReactElement | string;
  className?: string;
}

/** Props for {@link Text.Mono}. */
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
 * <Text.Mono>{'01'}</Text.Mono>
 * ```
 */
function MonoText({ children, className = "" }: MonoProps): JSX.Element {
  return (
    <e-text kind="mono" as="span" className={className}>
      {children}
    </e-text>
  );
}

/**
 * Body copy, rendered through the `<e-text kind="body" as="p">` custom element.
 * Also exposes a set of text variants as static properties: `Text.Title`
 * (headings), `Text.Label` (uppercase labels, optionally icon-prefixed), and
 * `Text.Mono` (monospace inline text).
 *
 * @example
 * ```tsx
 * <Text>No habits yet.</Text>
 * ```
 *
 * @example
 * ```tsx
 * <Text.Title size="2">Projects</Text.Title>
 * <Text.Label>Add Habit</Text.Label>
 * <Text.Mono>{'01'}</Text.Mono>
 * ```
 */
export function Text({ children, className = "" }: TextProps): JSX.Element {
  return (
    <e-text kind="body" as="p" className={className}>
      {children}
    </e-text>
  );
}

Text.Title = TitleText;
Text.Label = LabelText;
Text.Mono = MonoText;
