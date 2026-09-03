import type { JSX } from "react";

import { Icon } from "./icons.component";

import "./empty-state.component.css";

/** Props for {@link EmptyState}. */
interface EmptyStateProps {
  /** Icon variant shown above the message. See {@link Icon}. */
  icon:
    | "upload"
    | "download"
    | "plus"
    | "close"
    | "check"
    | "trash"
    | "edit"
    | "eye"
    | "search"
    | "moon"
    | "refresh";
  /** Accessible label for the icon. Defaults to `'empty'`. */
  label?: string;
  /** Message shown below the icon. Defaults to `'Oops nothing here'`. */
  message?: string;
}

/**
 * Placeholder shown when a list or view has no content to display.
 *
 * @example
 * ```tsx
 * <EmptyState icon="search" message="No projects yet" />
 * ```
 */
export function EmptyState(props: EmptyStateProps): JSX.Element {
  return (
    <div className="empty-state">
      <Icon variant={props.icon} label={props.label ?? "empty"} size="40" />
      <h1>{props.message ?? "Oops nothing here"}</h1>
    </div>
  );
}
