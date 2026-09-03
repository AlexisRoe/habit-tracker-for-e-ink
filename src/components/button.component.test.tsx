import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { Button } from "./button.component";

function click(container: HTMLElement, selector = "e-button"): void {
  const button = container.querySelector(selector);
  expect(button).not.toBeNull();
  button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

describe("Button", () => {
  it("renders its children inside an e-button with the primary variant by default", () => {
    const { container } = render(<Button onClick={vi.fn()}>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(container.querySelector("e-button")).toHaveAttribute("variant", "primary");
  });

  it("applies the secondary variant and a small size class", () => {
    const { container } = render(
      <Button variant="secondary" size="small" onClick={vi.fn()}>
        Click me
      </Button>,
    );

    expect(container.querySelector("e-button")).toHaveAttribute("variant", "secondary");
    expect(container.querySelector("e-button")).toHaveClass("button-small");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick}>Click me</Button>);

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Cancel", () => {
  it("renders a secondary close-icon button and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Cancel onClick={onClick} />);

    expect(container.querySelector("e-button")).toHaveAttribute("variant", "secondary");
    expect(container.querySelector("e-icon")).toHaveAttribute("name", "close");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Create", () => {
  it('renders a check icon with the default "Create" label', () => {
    render(<Button.Create onClick={vi.fn()} />);

    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<Button.Create onClick={vi.fn()} label="Save" />);

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Create onClick={onClick} />);

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Delete", () => {
  it("renders a trash icon and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Delete onClick={onClick} />);

    expect(container.querySelector("e-icon")).toHaveAttribute("name", "trash");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Edit", () => {
  it("renders an edit icon and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Edit onClick={onClick} />);

    expect(container.querySelector("e-icon")).toHaveAttribute("name", "edit");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Open", () => {
  it('renders an eye icon with an "Open" label and calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Open onClick={onClick} />);

    expect(container.querySelector("e-icon")).toHaveAttribute("name", "eye");
    expect(screen.getByText("Open")).toBeInTheDocument();

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Add", () => {
  it("renders a plus icon and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Add onClick={onClick} />);

    expect(container.querySelector("e-icon")).toHaveAttribute("name", "plus");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Move", () => {
  it("renders the secondary variant when inactive", () => {
    const { container } = render(<Button.Move onClick={vi.fn()} />);

    expect(container.querySelector("e-button")).toHaveAttribute("variant", "secondary");
  });

  it("renders the primary variant when active and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Move onClick={onClick} isActive />);

    expect(container.querySelector("e-button")).toHaveAttribute("variant", "primary");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Detail", () => {
  it("renders a pen icon and calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Detail onClick={onClick} />);

    expect(container.querySelector("e-icon")).toHaveAttribute("name", "pen");

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});

describe("Button.Back", () => {
  it('renders the "Back" label and calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<Button.Back onClick={onClick} />);

    expect(screen.getByText("Back")).toBeInTheDocument();

    click(container);

    expect(onClick).toHaveBeenCalled();
  });
});
