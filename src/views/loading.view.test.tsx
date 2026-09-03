import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import LoadingView from "./loading.view";

describe("LoadingView", () => {
  it("renders the given title label and title", () => {
    render(<LoadingView titleLabel="Website Relaunch" title="Planning" />);

    expect(screen.getByText("WEBSITE RELAUNCH")).toBeInTheDocument();
    expect(screen.getByText("Planning")).toBeInTheDocument();
    expect(screen.getByText("… LOADING …")).toBeInTheDocument();
  });
});
