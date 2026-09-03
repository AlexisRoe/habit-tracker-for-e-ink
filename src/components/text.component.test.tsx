import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { Mono, Title, TitleLabel } from "./text.component";

describe("Title", () => {
  it("renders its children at the default level", () => {
    const { container } = render(<Title>Projects</Title>);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(container.querySelector("e-title")).toHaveAttribute("level", "1");
  });

  it("renders at a custom level", () => {
    const { container } = render(<Title size="3">Projects</Title>);

    expect(container.querySelector("e-title")).toHaveAttribute("level", "3");
  });
});

describe("TitleLabel", () => {
  it("renders the label uppercased", () => {
    render(<TitleLabel>projects</TitleLabel>);

    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
  });

  it("renders the left icon when provided", () => {
    const { container } = render(
      <TitleLabel iconLeft={<span data-testid="icon" />}>projects</TitleLabel>,
    );

    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
  });
});

describe("Mono", () => {
  it("renders its children in mono text", () => {
    const { container } = render(<Mono>{"01"}</Mono>);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(container.querySelector("e-text")).toHaveAttribute("kind", "mono");
  });
});
