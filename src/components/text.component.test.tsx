import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { Text } from "./text.component";

describe("Text.Title", () => {
  it("renders its children at the default level", () => {
    const { container } = render(<Text.Title>Projects</Text.Title>);

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(container.querySelector("e-title")).toHaveAttribute("level", "1");
  });

  it("renders at a custom level", () => {
    const { container } = render(<Text.Title size="3">Projects</Text.Title>);

    expect(container.querySelector("e-title")).toHaveAttribute("level", "3");
  });
});

describe("Text.Label", () => {
  it("renders the label uppercased", () => {
    render(<Text.Label>projects</Text.Label>);

    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
  });

  it("renders the left icon when provided", () => {
    const { container } = render(
      <Text.Label iconLeft={<span data-testid="icon" />}>projects</Text.Label>,
    );

    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
    expect(screen.getByText("PROJECTS")).toBeInTheDocument();
  });
});

describe("Text", () => {
  it("renders its children as body text", () => {
    const { container } = render(<Text>No habits yet.</Text>);

    expect(screen.getByText("No habits yet.")).toBeInTheDocument();
    expect(container.querySelector("e-text")).toHaveAttribute("kind", "body");
    expect(container.querySelector("e-text")).toHaveAttribute("as", "p");
  });
});

describe("Text.Mono", () => {
  it("renders its children in mono text", () => {
    const { container } = render(<Text.Mono>{"01"}</Text.Mono>);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(container.querySelector("e-text")).toHaveAttribute("kind", "mono");
  });
});
