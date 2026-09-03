import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import "@marcomattes/epaper-components";

import { ItemForm } from "./item-form.component";

describe("ItemForm", () => {
  it("renders the title, description and column fields with their initial values", () => {
    const { container } = render(
      <ItemForm
        initialTitle="Write tests"
        initialDescription="Cover the ideal path"
        initialColumn="in-progress"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Column")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Write tests")).toBeInTheDocument();
    expect(container.querySelector("textarea")).toHaveAttribute(
      "placeholder",
      "Describe this item…",
    );

    expect(screen.getByRole("radio", { name: "To do" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "In progress" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Testing" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Done" })).toHaveAttribute("aria-checked", "false");
  });
});
