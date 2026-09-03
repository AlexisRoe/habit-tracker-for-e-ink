import type { JSX } from "react";

import { Button } from "./button.component";

import "./item.component.css";

/** Actions available on an {@link Item} card. */
interface ItemActions {
  /** Called when the delete button is clicked. */
  delete: () => void;
  /** Called when the move button is clicked. */
  move: () => void;
  /** Called when the detail button is clicked. */
  openDetail: () => void;
}

/** Props for {@link Item}. */
interface ItemProps {
  /** Item title, shown as the card title. */
  title: string;
  /** Item description, shown in the card body. */
  description: string;
  /** Card actions. */
  actions: ItemActions;
  /** Whether this item is the one currently being moved. Highlights the card and the move button. Defaults to `false`. */
  isMoving?: boolean;
}

/**
 * Card representing a single {@link ProjectItem} on the {@link Board}, with
 * actions to open its detail view, move it, or delete it.
 *
 * @example
 * ```tsx
 * <Item
 *   title={item.title}
 *   description={item.description}
 *   actions={{ delete: () => remove(item.id), move: () => startMove(item.id), openDetail: () => open(item.id) }}
 *   isMoving={movingItemId === item.id}
 * />
 * ```
 */
export function Item({ title, description, actions, isMoving = false }: ItemProps): JSX.Element {
  return (
    <e-card className={isMoving ? "item-card item-card-moving" : "item-card"} title={title}>
      <div className="item-card-content">
        <div className="item-card-body">{description}</div>
        <div className="item-card-actions">
          <Button.Detail onClick={actions.openDetail} />
          <div className="item-card-actions-left">
            <Button.Move onClick={actions.move} isActive={isMoving} />
            <Button.Delete onClick={actions.delete} />
          </div>
        </div>
      </div>
    </e-card>
  );
}
