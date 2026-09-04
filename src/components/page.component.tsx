import type { ReactNode } from "react";
import { NavLink } from "react-router";

import "./page.component.css";
import type { JSX } from "react/jsx-dev-runtime";
import { Text } from "./text.component";

/** Props for {@link Page}. */
interface PageProps {
  /** Page content, typically a `Page.Header` and `Page.Content`. */
  children: ReactNode;
}

/**
 * Root layout wrapper for a view. Use it to wrap every top-level page,
 * composed with `Page.Header` and `Page.Content`.
 *
 * @example
 * <Page>
 *   <Page.Header><h1>Projects</h1></Page.Header>
 *   <Page.Content>...</Page.Content>
 * </Page>
 */
function Page({ children }: PageProps) {
  return <div className="page">{children}</div>;
}

/** Props for {@link Page.Header}. */
interface PageHeaderProps {
  /** Header content, typically `Page.Header.Left` and/or `Page.Header.Right`. */
  children: ReactNode;
}

/**
 * Header section of a `Page`, typically holding the page title.
 *
 * @example
 * <Page.Header><h1>Planning</h1></Page.Header>
 */
function PageHeader({ children }: PageHeaderProps) {
  return <header className="page-header">{children}</header>;
}

/** Props for {@link Page.Content}. */
interface PageContentProps {
  /** Main body content. */
  children: ReactNode;
}

/**
 * Main content area of a `Page`, holding the primary body of the view.
 *
 * @example
 * <Page.Content><p>Details for this item go here.</p></Page.Content>
 */
function PageContent({ children }: PageContentProps) {
  return <div className="page-content">{children}</div>;
}

/** Props for {@link Page.Title}. */
interface PageTitleProps {
  /** Title text to render. Defaults to `"HabitTracker"`. */
  children?: string;
}

/**
 * App/page title, rendered as a large heading. Defaults to `"HabitTracker"`
 * when no children are given.
 *
 * @example
 * <Page.Title /> // renders "HabitTracker"
 * <Page.Title>Year</Page.Title>
 */
function PageTitle({ children = "HabitTracker" }: PageTitleProps): JSX.Element {
  return <Text.Title size="2">{children}</Text.Title>;
}

/** Props for {@link Page.Nav}. */
interface PageNavigationProps {
  /** Extra content rendered after the built-in Week/Year links. */
  children?: ReactNode;
}

/**
 * Primary navigation for a `Page`, with links between the weekly ("Week")
 * and yearly ("Year") views. Accepts additional children to render alongside
 * the built-in links.
 *
 * @example
 * <Page.Nav />
 */
function PageNavigation(props: PageNavigationProps): JSX.Element {
  return (
    <nav className="page-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "page-nav-link active" : "page-nav-link")}
      >
        <span>Week</span>
      </NavLink>
      <NavLink
        to="/year"
        className={({ isActive }) => (isActive ? "page-nav-link active" : "page-nav-link")}
      >
        <span>Year</span>
      </NavLink>
      {props.children && props.children}
    </nav>
  );
}

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Title = PageTitle;
Page.Nav = PageNavigation;

export default Page;
