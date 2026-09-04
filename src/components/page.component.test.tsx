import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import "@marcomattes/epaper-components";

import Page from "./page.component";

describe("Page", () => {
  it("renders its children", () => {
    render(
      <Page>
        <p>content</p>
      </Page>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

describe("Page.Header", () => {
  it("renders its children", () => {
    render(<Page.Header>header content</Page.Header>);

    expect(screen.getByText("header content")).toBeInTheDocument();
  });
});

describe("Page.Content", () => {
  it("renders its children", () => {
    render(<Page.Content>body content</Page.Content>);

    expect(screen.getByText("body content")).toBeInTheDocument();
  });
});

describe("Page.Title", () => {
  it("defaults to HabitTracker", () => {
    render(<Page.Title />);

    expect(screen.getByText("HabitTracker")).toBeInTheDocument();
  });

  it("renders the given children instead of the default", () => {
    render(<Page.Title>Year</Page.Title>);

    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.queryByText("HabitTracker")).not.toBeInTheDocument();
  });
});

describe("Page.Nav", () => {
  it("renders links to the weekly and yearly views", () => {
    render(
      <MemoryRouter>
        <Page.Nav />
      </MemoryRouter>,
    );

    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("renders additional children alongside the built-in links", () => {
    render(
      <MemoryRouter>
        <Page.Nav>
          <button type="button">Extra</button>
        </Page.Nav>
      </MemoryRouter>,
    );

    expect(screen.getByText("Extra")).toBeInTheDocument();
  });
});
