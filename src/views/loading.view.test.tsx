import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import LoadingView from "./loading.view";

describe("LoadingView", () => {
  it("renders the current date title and a loading message", () => {
    render(<LoadingView />);

    expect(screen.getByText("… LOADING …")).toBeInTheDocument();
  });
});
