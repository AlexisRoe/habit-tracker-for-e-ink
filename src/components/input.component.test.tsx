import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { FileInput, Input, Segmented, Textarea } from "./input.component";

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

describe("FileInput", () => {
  it("calls onFileSelected with the chosen file and resets the input", () => {
    const onFileSelected = vi.fn();
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <FileInput ref={ref} accept=".json" onFileSelected={onFileSelected} />,
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("accept", ".json");

    const file = new File(["{}"], "data.json", { type: "application/json" });
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onFileSelected).toHaveBeenCalledWith(file);
    expect(input.value).toBe("");
  });
});

describe("Textarea", () => {
  it("renders the given label and placeholder", () => {
    const { container } = render(
      <Textarea
        label="Description"
        placeholder="Describe this item…"
        onDebouncedChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(container.querySelector("e-textarea")).toHaveAttribute(
      "placeholder",
      "Describe this item…",
    );
  });

  it("calls onDebouncedChange with the new value", async () => {
    const onDebouncedChange = vi.fn();
    const { container } = render(<Textarea onDebouncedChange={onDebouncedChange} debounceMs={0} />);

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.input(textarea, { target: { value: "new value" } });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onDebouncedChange).toHaveBeenCalledWith("new value");
  });
});

describe("Segmented", () => {
  it("renders the label and each option", () => {
    render(
      <Segmented
        label="Column"
        options={[
          { value: "todo", label: "To do" },
          { value: "done", label: "Done" },
        ]}
        value="todo"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Column")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "To do" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Done" })).toBeInTheDocument();
  });

  it("calls onChange with the newly selected value", () => {
    const onChange = vi.fn();
    render(
      <Segmented
        options={[
          { value: "todo", label: "To do" },
          { value: "done", label: "Done" },
        ]}
        value="todo"
        onChange={onChange}
      />,
    );

    screen.getByRole("radio", { name: "Done" }).click();

    expect(onChange).toHaveBeenCalledWith("done");
  });
});
