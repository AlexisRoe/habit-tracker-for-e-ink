import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { Input } from "./input.component";

describe("Input", () => {
  it("renders the given label, placeholder and initial value", () => {
    const { container } = render(
      <Input
        label="Title"
        placeholder="Item title"
        initialValue="Write tests"
        onDebouncedChange={vi.fn()}
      />,
    );

    const input = container.querySelector("e-input");
    expect(input).toHaveAttribute("label", "Title");
    expect(input).toHaveAttribute("placeholder", "Item title");
    expect(input).toHaveAttribute("default-value", "Write tests");
  });

  it("calls onDebouncedChange with the new value", async () => {
    const onDebouncedChange = vi.fn();
    const { container } = render(<Input onDebouncedChange={onDebouncedChange} debounceMs={0} />);

    const input = container.querySelector("input.ink-control") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "new value" } });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onDebouncedChange).toHaveBeenCalledWith("new value");
  });
});
