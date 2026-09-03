import type { JSX, ReactNode } from "react";
import type { ColumnStatus, ProjectItem } from "../db/types";
import { Button } from "./button.component";
import { Mono } from "./text.component";

import "./board.component.css";

const COLUMNS: { status: ColumnStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in-progress", label: "In progress" },
  { status: "testing", label: "Testing" },
  { status: "done", label: "Done" },
];

/** Props for {@link Board}. */
interface BoardProps {
  /** Items to distribute across the board's columns, keyed by {@link ProjectItem.column}. */
  items: ProjectItem[];
  /** Renders a single item's card content. */
  renderItem: (item: ProjectItem) => ReactNode;
  /** ID of the item currently being moved, if any. Enables "MOVE HERE" buttons on other columns. */
  movingItemId?: string;
  /** Called with the target column when a "MOVE HERE" button is clicked. */
  onMoveTo?: (column: ColumnStatus) => void;
}

/**
 * Renders a four-column Kanban board (To do / In progress / Testing / Done),
 * grouping `items` by their {@link ProjectItem.column} and delegating card
 * rendering to `renderItem`.
 *
 * When `movingItemId` is set, every column other than the moving item's
 * current column shows a "MOVE HERE" button that calls `onMoveTo`.
 *
 * @example
 * ```tsx
 * <Board
 *   items={items}
 *   renderItem={(item) => <ItemCard key={item.id} item={item} />}
 *   movingItemId={movingItemId}
 *   onMoveTo={(column) => moveItem(movingItemId, column)}
 * />
 * ```
 */
export function Board({ items, renderItem, movingItemId, onMoveTo }: BoardProps): JSX.Element {
  const movingItemColumn = items.find((item) => item.id === movingItemId)?.column;

  return (
    <div className="board">
      {COLUMNS.map(({ status, label }) => {
        const columnItems = items.filter((item) => item.column === status);
        const showMoveHere = movingItemId !== undefined && status !== movingItemColumn;

        return (
          <div className="board-column" key={status}>
            <div className="board-column-header">
              <Mono>{label.toUpperCase()}</Mono>
              <Mono>{String(columnItems.length).padStart(2, "0")}</Mono>
            </div>
            {showMoveHere && (
              <button type="button" className="board-move-here" onClick={() => onMoveTo?.(status)}>
                <Mono>{"↓ MOVE HERE"}</Mono>
              </button>
            )}
            <div className="board-column-body">{columnItems.map((item) => renderItem(item))}</div>
          </div>
        );
      })}
    </div>
  );
}

/** Props for {@link MoveBanner}. */
interface MoveBannerProps {
  /** Title of the item currently being moved, shown in the banner. */
  title: string;
  /** Called when the banner's cancel button is clicked. */
  onCancel: () => void;
}

/**
 * Banner shown while a board item is being moved, prompting the user to
 * choose a destination column. Pairs with {@link Board}'s `movingItemId`/
 * `onMoveTo` props, which render the "MOVE HERE" buttons this banner refers to.
 *
 * @example
 * ```tsx
 * <MoveBanner title={movingItem.title} onCancel={() => setMovingItemId(undefined)} />
 * ```
 */
export function MoveBanner({ title, onCancel }: MoveBannerProps): JSX.Element {
  return (
    <div className="move-banner">
      <div className="move-banner-text">
        <Mono>MOVING</Mono>
        <strong>{title}</strong>
        <Mono>{"CHOOSE A COLUMN ↓"}</Mono>
      </div>
      <Button.Cancel size="small" className="move-banner-close" onClick={onCancel} />
    </div>
  );
}
