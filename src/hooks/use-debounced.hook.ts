import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

/**
 * Tracks a field's live value locally while reporting it to `onDebouncedChange`
 * only after typing has settled for `debounceMs` — so callers (e.g. Dexie
 * writes) aren't invoked on every keystroke.
 *
 * @param initialValue Value the field starts with.
 * @param onDebouncedChange Called with the latest value once it has been stable for `debounceMs`.
 * @param debounceMs Delay in milliseconds before `onDebouncedChange` fires. Defaults to `300`.
 * @returns A `[value, setValue]` pair, mirroring `useState`: `value` updates immediately, `setValue` updates it and schedules the debounced callback.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useDebouncedInput(initialValue, onDebouncedChange, 300);
 * <e-input default-value={value} onInput={(e) => setValue(e.currentTarget.value)} />
 * ```
 */
export function useDebouncedInput(
  initialValue: string,
  onDebouncedChange: (value: string) => void,
  debounceMs = 300,
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(initialValue);
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  onDebouncedChangeRef.current = onDebouncedChange;

  useEffect(() => {
    if (value === initialValue) return;

    const timeout = setTimeout(() => {
      onDebouncedChangeRef.current(value);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, initialValue, debounceMs]);

  return [value, setValue];
}
