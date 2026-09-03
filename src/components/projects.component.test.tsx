import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { ProjectCard, ProjectGrid } from "./projects.component";

describe("ProjectGrid", () => {
  it("renders its children", () => {
    render(
      <ProjectGrid>
        <span>child</span>
      </ProjectGrid>,
    );

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  const items = { todo: 1, inProgress: 1, testing: 0, done: 2 };

  it("renders the title and item progress", () => {
    const { container } = render(
      <ProjectCard
        title="My Project"
        items={items}
        actions={{ update: vi.fn(), delete: vi.fn(), open: vi.fn() }}
      />,
    );

    expect(container.querySelector("e-card")).toHaveAttribute("title", "My Project");
    expect(container.querySelector("e-card")).toHaveAttribute("eyebrow", "4 ITEMS");
  });

  it("calls actions.open when the open button is clicked", () => {
    const actions = { update: vi.fn(), delete: vi.fn(), open: vi.fn() };
    const { container } = render(
      <ProjectCard title="My Project" items={items} actions={actions} />,
    );

    container
      .querySelectorAll("e-button")[0]
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(actions.open).toHaveBeenCalled();
  });

  it("shows a delete confirmation before calling actions.delete", () => {
    const actions = { update: vi.fn(), delete: vi.fn(), open: vi.fn() };
    const { container } = render(
      <ProjectCard title="My Project" items={items} actions={actions} />,
    );

    act(() => {
      container
        .querySelectorAll("e-button")[2]
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(screen.getByText("Delete this project?")).toBeInTheDocument();
    expect(actions.delete).not.toHaveBeenCalled();

    act(() => {
      container
        .querySelectorAll("e-button")[0]
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(actions.delete).toHaveBeenCalled();
  });

  it("switches to ProjectCard.Update when editing", () => {
    const actions = { update: vi.fn(), delete: vi.fn(), open: vi.fn() };
    const { container } = render(
      <ProjectCard title="My Project" items={items} actions={actions} />,
    );

    act(() => {
      container
        .querySelectorAll("e-button")[1]
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.querySelector('e-card[data-type="new-card"]')).toBeInTheDocument();
  });
});

describe("ProjectCard.Update", () => {
  it("is hidden when isVisible is false", () => {
    const { container } = render(
      <ProjectCard.Update isVisible={false} onClose={vi.fn()} onCreate={vi.fn()} />,
    );

    expect(container.querySelector("e-card")).not.toBeInTheDocument();
  });

  it("calls onCreate with the entered name and then onClose", async () => {
    const onCreate = vi.fn();
    const onClose = vi.fn();
    const { container } = render(
      <ProjectCard.Update
        isVisible
        initialValue="My Project"
        onClose={onClose}
        onCreate={onCreate}
      />,
    );

    const input = container.querySelector("input.ink-control") as HTMLInputElement;
    act(() => {
      fireEvent.input(input, { target: { value: "Renamed Project" } });
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    act(() => {
      container
        .querySelector("e-button")
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onCreate).toHaveBeenCalledWith("Renamed Project");
    expect(onClose).toHaveBeenCalled();
  });
});
