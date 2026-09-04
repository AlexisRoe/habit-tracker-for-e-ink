import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { Icon } from "./icons.component";

describe("Icon", () => {
  it("renders the given variant, size and label", () => {
    const { container } = render(<Icon variant="trash" label="delete" size="16" />);

    const icon = container.querySelector("e-icon");
    expect(icon).toHaveAttribute("name", "trash");
    expect(icon).toHaveAttribute("label", "delete");
    expect(icon).toHaveAttribute("size", "16");
  });

  it("defaults to size 24 and an empty label", () => {
    const { container } = render(<Icon variant="plus" />);

    const icon = container.querySelector("e-icon");
    expect(icon).toHaveAttribute("size", "24");
    expect(icon).toHaveAttribute("label", "");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Icon variant="close" onClick={onClick} />);

    container.querySelector("e-icon")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onClick).toHaveBeenCalled();
  });
});
