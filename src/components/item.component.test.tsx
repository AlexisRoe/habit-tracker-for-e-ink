import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { Item } from "./item.component";

describe("Item", () => {
  it("renders the title and description", () => {
    const { container } = render(
      <Item
        title="Write tests"
        description="Cover the ideal path"
        actions={{ delete: vi.fn(), move: vi.fn(), openDetail: vi.fn() }}
      />,
    );

    expect(container.querySelector("e-card")).toHaveAttribute("title", "Write tests");
    expect(screen.getByText("Cover the ideal path")).toBeInTheDocument();
  });

  it("is not marked as moving by default", () => {
    const { container } = render(
      <Item
        title="Write tests"
        description="Cover the ideal path"
        actions={{ delete: vi.fn(), move: vi.fn(), openDetail: vi.fn() }}
      />,
    );

    expect(container.querySelector("e-card")).not.toHaveClass("item-card-moving");
  });

  it("applies the moving class when isMoving is true", () => {
    const { container } = render(
      <Item
        title="Write tests"
        description="Cover the ideal path"
        actions={{ delete: vi.fn(), move: vi.fn(), openDetail: vi.fn() }}
        isMoving
      />,
    );

    expect(container.querySelector("e-card")).toHaveClass("item-card-moving");
  });

  it("calls the matching action when a button is clicked", () => {
    const actions = { delete: vi.fn(), move: vi.fn(), openDetail: vi.fn() };
    const { container } = render(
      <Item title="Write tests" description="Cover the ideal path" actions={actions} />,
    );

    const buttons = container.querySelectorAll("e-button");
    buttons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    buttons[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    buttons[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(actions.openDetail).toHaveBeenCalled();
    expect(actions.move).toHaveBeenCalled();
    expect(actions.delete).toHaveBeenCalled();
  });
});
