import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import { EmptyState } from "./empty-state.component";

describe("EmptyState", () => {
  it("renders the default message and icon", () => {
    const { container } = render(<EmptyState icon="search" />);

    expect(screen.getByText("Oops nothing here")).toBeInTheDocument();
    expect(container.querySelector("e-icon")).toHaveAttribute("name", "search");
    expect(container.querySelector("e-icon")).toHaveAttribute("label", "empty");
  });

  it("renders a custom message and label", () => {
    const { container } = render(
      <EmptyState icon="plus" label="no projects" message="No projects yet" />,
    );

    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(container.querySelector("e-icon")).toHaveAttribute("label", "no projects");
  });
});
