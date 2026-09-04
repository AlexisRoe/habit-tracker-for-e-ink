import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useDebouncedInput } from "./use-debounced.hook";

describe("useDebouncedInput", () => {
  it("updates the returned value immediately", () => {
    const { result } = renderHook(() => useDebouncedInput("initial", vi.fn(), 300));

    act(() => result.current[1]("typed"));
    expect(result.current[0]).toBe("typed");
  });

  it("calls onDebouncedChange only after the delay has elapsed", () => {
    vi.useFakeTimers();
    const onDebouncedChange = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("initial", onDebouncedChange, 300));

    act(() => result.current[1]("typed"));
    expect(onDebouncedChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(299));
    expect(onDebouncedChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onDebouncedChange).toHaveBeenCalledWith("typed");
    expect(onDebouncedChange).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("resets the debounce timer on rapid successive changes", () => {
    vi.useFakeTimers();
    const onDebouncedChange = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("initial", onDebouncedChange, 300));

    act(() => result.current[1]("a"));
    act(() => vi.advanceTimersByTime(200));
    act(() => result.current[1]("ab"));
    act(() => vi.advanceTimersByTime(200));
    expect(onDebouncedChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(100));
    expect(onDebouncedChange).toHaveBeenCalledWith("ab");
    expect(onDebouncedChange).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("does not call onDebouncedChange when the value never changes from initial", () => {
    vi.useFakeTimers();
    const onDebouncedChange = vi.fn();
    renderHook(() => useDebouncedInput("initial", onDebouncedChange, 300));

    act(() => vi.advanceTimersByTime(1000));
    expect(onDebouncedChange).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
