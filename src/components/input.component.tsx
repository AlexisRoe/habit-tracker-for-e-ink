import type { JSX } from "react";

import { useDebouncedInput } from "../hooks/use-debounced.hook";

/** Props for {@link Input}. */
interface InputProps {
  /** Field label. */
  label?: string;
  /** Accessible label, used when no visible {@link label} is rendered. */
  ariaLabel?: string;
  /** Placeholder text shown when the field is empty. */
  placeholder?: string;
  /** Helper text shown below the field. */
  hint?: string;
  /** Error state. A string is shown as an error message; `true` marks the field as invalid without a message. */
  error?: boolean | string;
  /** Initial field value. */
  initialValue?: string;
  /** Called with the current value after typing settles for `debounceMs`. */
  onDebouncedChange: (value: string) => void;
  /** Debounce delay in milliseconds. Defaults to `300`. */
  debounceMs?: number;
  /** Extra class name(s) applied to the underlying `<e-input>`. */
  className?: string;
}

/**
 * Single-line text field that reports value changes via {@link useDebouncedInput},
 * rendered through the `<e-input>` custom element.
 *
 * @example
 * ```tsx
 * <Input label="Title" placeholder="Item title" onDebouncedChange={setTitle} />
 * ```
 */
export function Input(props: InputProps): JSX.Element {
  const [value, setValue] = useDebouncedInput(
    props.initialValue ?? "",
    props.onDebouncedChange,
    props.debounceMs ?? 300,
  );

  return (
    <e-input
      className={props.className}
      label={props.label}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      hint={props.hint ?? ""}
      default-value={value}
      type="text"
      error={props.error ?? ""}
      onInput={(e) => setValue(e.currentTarget.value)}
    ></e-input>
  );
}
