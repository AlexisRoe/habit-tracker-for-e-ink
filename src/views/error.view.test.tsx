import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import ErrorView from "./error.view";

describe("ErrorView", () => {
  it("renders the given error message", () => {
    render(<ErrorView message="Project is not defined" />);

    expect(screen.getByText("Project is not defined")).toBeInTheDocument();
  });
});
