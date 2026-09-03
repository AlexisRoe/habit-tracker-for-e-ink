import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import {
  ProgressBar,
  ProgressBarLegend,
  ProgressContainer,
  ProgressOverview,
} from "./progress.component";

describe("ProgressBar", () => {
  it("renders the given value, steps and label", () => {
    const { container } = render(<ProgressBar value={42} steps={4} label="progress" />);

    const bar = container.querySelector("e-progress");
    expect(bar).toHaveAttribute("value", "42");
    expect(bar).toHaveAttribute("steps", "4");
    expect(bar).toHaveAttribute("label", "progress");
  });
});

describe("ProgressBarLegend", () => {
  it("renders each column count and the done percentage", () => {
    render(
      <ProgressBarLegend
        amounts={{ todo: 1, inProgress: 2, testing: 3, done: 4 }}
        doneInPercent={40}
        label="done"
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("40% done")).toBeInTheDocument();
  });
});

describe("ProgressOverview", () => {
  it("renders the done/total ratio and percentage", () => {
    render(<ProgressOverview done={2} total={4} />);

    expect(screen.getByText("2/4 DONE")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders 0% when total is 0", () => {
    render(<ProgressOverview done={0} total={0} />);

    expect(screen.getByText("0/0 DONE")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});

describe("ProgressContainer", () => {
  it("renders its children", () => {
    render(
      <ProgressContainer>
        <span>child</span>
      </ProgressContainer>,
    );

    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
