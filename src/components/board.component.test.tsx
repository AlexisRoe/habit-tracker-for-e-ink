import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import type { ProjectItem } from "../db/types";
import { Board, MoveBanner } from "./board.component";

function makeItem(overrides: Partial<ProjectItem> = {}): ProjectItem {
  return {
    id: "item-1",
    projectId: "project-1",
    title: "Write tests",
    description: "Cover the ideal path",
    column: "todo",
    position: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe("Board", () => {
  it("renders each column header with its label and item count", () => {
    render(<Board items={[]} renderItem={(item) => <span>{item.title}</span>} />);

    expect(screen.getByText("TO DO")).toBeInTheDocument();
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
    expect(screen.getByText("TESTING")).toBeInTheDocument();
    expect(screen.getByText("DONE")).toBeInTheDocument();
    expect(screen.getAllByText("00")).toHaveLength(4);
  });

  it("groups items into their matching column and renders them via renderItem", () => {
    const items = [
      makeItem({ id: "a", title: "Todo item", column: "todo" }),
      makeItem({ id: "b", title: "Doing item", column: "in-progress" }),
    ];

    render(<Board items={items} renderItem={(item) => <span>{item.title}</span>} />);

    expect(screen.getByText("Todo item")).toBeInTheDocument();
    expect(screen.getByText("Doing item")).toBeInTheDocument();
    expect(screen.getAllByText("01")).toHaveLength(2);
  });

  it("shows a MOVE HERE button on every column except the moving item's own column", () => {
    const items = [makeItem({ id: "a", title: "Todo item", column: "todo" })];

    render(
      <Board items={items} renderItem={(item) => <span>{item.title}</span>} movingItemId="a" />,
    );

    expect(screen.getAllByText("↓ MOVE HERE")).toHaveLength(3);
  });

  it("calls onMoveTo with the target column when a MOVE HERE button is clicked", () => {
    const items = [makeItem({ id: "a", title: "Todo item", column: "todo" })];
    const onMoveTo = vi.fn();

    render(
      <Board
        items={items}
        renderItem={(item) => <span>{item.title}</span>}
        movingItemId="a"
        onMoveTo={onMoveTo}
      />,
    );

    screen.getAllByText("↓ MOVE HERE")[0].click();

    expect(onMoveTo).toHaveBeenCalledWith("in-progress");
  });

  it("does not show any MOVE HERE button when no item is being moved", () => {
    render(<Board items={[]} renderItem={(item) => <span>{item.title}</span>} />);

    expect(screen.queryByText("↓ MOVE HERE")).not.toBeInTheDocument();
  });
});

describe("MoveBanner", () => {
  it("renders the moving item title and prompt", () => {
    render(<MoveBanner title="Write tests" onCancel={vi.fn()} />);

    expect(screen.getByText("MOVING")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("CHOOSE A COLUMN ↓")).toBeInTheDocument();
  });

  it("calls onCancel when the close button is clicked", () => {
    const onCancel = vi.fn();

    const { container } = render(<MoveBanner title="Write tests" onCancel={onCancel} />);

    const closeButton = container.querySelector(".move-banner-close");
    expect(closeButton).not.toBeNull();
    closeButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onCancel).toHaveBeenCalled();
  });
});
