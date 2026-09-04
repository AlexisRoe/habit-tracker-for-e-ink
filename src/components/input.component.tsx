import type { ESegmented } from "@marcomattes/epaper-components";
import { forwardRef, type JSX, useEffect, useRef } from "react";

import { useDebouncedInput } from "../hooks/use-debounced.hook";

import "./input.component.css";

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

/** Props for {@link FileInput}. */
interface FileInputProps {
  /** MIME type(s) or file extension(s) accepted, forwarded to the native `accept` attribute. */
  accept?: string;
  /** Called with the selected file. The input is reset immediately after, so it can be re-triggered for the same file. */
  onFileSelected: (file: File) => void;
}

/**
 * Visually hidden native file input. Typically triggered programmatically via
 * a ref (e.g. `ref.current?.click()`) from a visible button.
 *
 * @example
 * ```tsx
 * const fileInputRef = useRef<HTMLInputElement>(null);
 * <FileInput ref={fileInputRef} accept=".json" onFileSelected={importData} />
 * <button onClick={() => fileInputRef.current?.click()}>Import</button>
 * ```
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(props, ref) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) props.onFileSelected(file);
      e.target.value = "";
    };

    return (
      <input
        ref={ref}
        type="file"
        accept={props.accept}
        style={{ display: "none" }}
        onChange={handleChange}
      />
    );
  },
);

/** Props for {@link Textarea}. */
interface TextareaProps {
  /** Field label. */
  label?: string;
  /** Placeholder text shown when the field is empty. */
  placeholder?: string;
  /** Error state. A string is shown as an error message; `true` marks the field as invalid without a message. */
  error?: boolean | string;
  /** Initial field value. */
  initialValue?: string;
  /** Called with the current value after typing settles for `debounceMs`. */
  onDebouncedChange: (value: string) => void;
  /** Debounce delay in milliseconds. Defaults to `300`. */
  debounceMs?: number;
}

/**
 * Multi-line text field that reports value changes via {@link useDebouncedInput},
 * rendered through the `<e-textarea>` custom element.
 *
 * @example
 * ```tsx
 * <Textarea label="Description" placeholder="Describe this item…" onDebouncedChange={setDescription} />
 * ```
 */
export function Textarea(props: TextareaProps): JSX.Element {
  const [value, setValue] = useDebouncedInput(
    props.initialValue ?? "",
    props.onDebouncedChange,
    props.debounceMs ?? 300,
  );

  return (
    <div className="field-group">
      {props.label && (
        <e-text className="field-label" kind="label" as="span">
          {props.label}
        </e-text>
      )}
      <e-textarea
        placeholder={props.placeholder}
        value={value}
        error={props.error ?? ""}
        onInput={(e) => setValue(e.currentTarget.value)}
      ></e-textarea>
    </div>
  );
}

/** A single selectable option in a {@link Segmented} control. */
interface SegmentedOption {
  /** Underlying value reported to `onChange`. */
  value: string;
  /** Text shown for this option. */
  label: string;
}

/** Props for {@link Segmented}. */
interface SegmentedProps {
  /** Field label. */
  label?: string;
  /** Options to render. */
  options: SegmentedOption[];
  /** Currently selected option value. */
  value: string;
  /** Called with the newly selected option value. */
  onChange: (value: string) => void;
}

/**
 * Segmented single-choice control, rendered through the `<e-segmented>` /
 * `<e-segment>` custom elements.
 *
 * @example
 * ```tsx
 * <Segmented
 *   label="Column"
 *   options={[{ value: 'todo', label: 'To do' }, { value: 'done', label: 'Done' }]}
 *   value={column}
 *   onChange={setColumn}
 * />
 * ```
 */
export function Segmented(props: SegmentedProps): JSX.Element {
  const ref = useRef<ESegmented>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ value: string }>).detail;
      props.onChange(detail.value);
    };

    el.addEventListener("e-change", handleChange);
    return () => el.removeEventListener("e-change", handleChange);
  }, [props.onChange]);

  return (
    <div className="field-group">
      {props.label && (
        <e-text className="field-label" kind="label" as="span">
          {props.label}
        </e-text>
      )}
      <e-segmented ref={ref} value={props.value}>
        {props.options.map((option) => (
          <e-segment key={option.value} value={option.value} label={option.label}></e-segment>
        ))}
      </e-segmented>
    </div>
  );
}
