import type { JSX, ReactNode } from "react";
import { Icon } from "./icons.component";

import "./button.component.css";

/** Props shared by every icon/action button variant attached to {@link Button}. */
interface BaseButtonProps {
  /** Called when the button is clicked. */
  onClick: () => void;
}

/** Props for {@link Button}. */
interface ButtonProps {
  /** Button content — usually text and/or an {@link Icon}. */
  children: ReactNode;
  /** Visual style. Defaults to `'primary'`. */
  variant?: "primary" | "secondary";
  /** Button size. Defaults to `'default'`. */
  size?: "default" | "small";
  /** Called when the button is clicked. */
  onClick?: () => void;
  /** Disables the button when `true`. Defaults to `false`. */
  disabled?: boolean;
  /** Extra class name(s) applied to the underlying `<e-button>`. */
  className?: string;
}

/**
 * Base button, rendered as an `<e-button>` custom element. Also exposes a set
 * of pre-configured action-button variants as static properties (e.g.
 * `Button.Cancel`, `Button.Delete`), each wrapping `Button` with a fixed icon
 * and variant for a common action.
 *
 * @example
 * ```tsx
 * <Button variant="secondary" onClick={handleClick}>Click me</Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button.Cancel onClick={onClose} />
 * <Button.Create onClick={handleCreate} disabled={isCreateDisabled} />
 * ```
 */
export function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  onClick,
  disabled = false,
}: ButtonProps): JSX.Element {
  const combinedClassName =
    [className, size === "small" ? "button-small" : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <e-button className={combinedClassName} variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </e-button>
  );
}

/** Props for {@link Button.Cancel}. */
interface CancelButtonProps extends BaseButtonProps {
  /** Button size. Defaults to `'default'`. */
  size?: "default" | "small";
  /** Extra class name(s) applied to the underlying button. */
  className?: string;
}

/**
 * Secondary button rendering a close icon, used to cancel or dismiss.
 *
 * @example
 * ```tsx
 * <Button.Cancel onClick={onClose} />
 * ```
 */
function CancelButton({ onClick, size = "default", className }: CancelButtonProps): JSX.Element {
  return (
    <Button variant="secondary" size={size} className={className} onClick={onClick}>
      <Icon variant="close" label="close" size={size === "small" ? "16" : "24"} />
    </Button>
  );
}

/** Props for {@link Button.Create}. */
interface CreateButtonProps extends BaseButtonProps {
  /** Disables the button when `true`. Defaults to `false`. */
  disabled?: boolean;
  /** Label text shown next to the check icon. Defaults to `'Create'`. */
  label?: string;
}

/**
 * Primary button rendering a check icon and label, used to confirm creation.
 *
 * @example
 * ```tsx
 * <Button.Create onClick={handleCreate} disabled={isCreateDisabled} />
 * ```
 */
function CreateButton({
  onClick,
  disabled = false,
  label = "Create",
}: CreateButtonProps): JSX.Element {
  return (
    <Button
      className={disabled ? "create-button-disabled" : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon variant="check" label="Create" />
      <span>{` ${label}`}</span>
    </Button>
  );
}

/** Props for {@link Button.Delete}. */
interface DeleteButtonProps extends BaseButtonProps {}

/**
 * Secondary button rendering a trash icon, used to delete an item.
 *
 * @example
 * ```tsx
 * <Button.Delete onClick={handleDelete} />
 * ```
 */
function DeleteButton({ onClick }: DeleteButtonProps): JSX.Element {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Icon variant="trash" label="delete" />
    </Button>
  );
}

/** Props for {@link Button.Edit}. */
interface EditButtonProps extends BaseButtonProps {}

/**
 * Secondary button rendering an edit icon, used to enter edit mode.
 *
 * @example
 * ```tsx
 * <Button.Edit onClick={() => setIsEditing(true)} />
 * ```
 */
function EditButton({ onClick }: EditButtonProps): JSX.Element {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Icon variant="edit" label="update or create" />
    </Button>
  );
}

/** Props for {@link Button.Open}. */
interface OpenButtonProps extends BaseButtonProps {}

/**
 * Primary button rendering an eye icon and "Open" label, used to open an item.
 *
 * @example
 * ```tsx
 * <Button.Open onClick={props.actions.open} />
 * ```
 */
function OpenButton({ onClick }: OpenButtonProps): JSX.Element {
  return (
    <Button variant="primary" onClick={onClick}>
      <Icon variant="eye" label="Open" />
      <span> Open</span>
    </Button>
  );
}

/** Props for {@link Button.Add}. */
interface AddButtonProps extends BaseButtonProps {}

/**
 * Primary button rendering a plus icon, used to add a new item.
 *
 * @example
 * ```tsx
 * <Button.Add onClick={handleAdd} />
 * ```
 */
function AddButton({ onClick }: AddButtonProps): JSX.Element {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Icon variant="plus" label="update or create" />
    </Button>
  );
}

/** Props for {@link Button.Move}. */
interface MoveButtonProps extends BaseButtonProps {
  /** Whether the item is currently being moved. Renders the primary variant when `true`. Defaults to `false`. */
  isActive?: boolean;
}

/**
 * Button rendering a move icon, used to start/confirm moving an item. Renders
 * with the primary variant while `isActive` is `true`, secondary otherwise.
 *
 * @example
 * ```tsx
 * <Button.Move onClick={actions.move} isActive={isMoving} />
 * ```
 */
function MoveButton({ onClick, isActive = false }: MoveButtonProps): JSX.Element {
  return (
    <Button variant={isActive ? "primary" : "secondary"} onClick={onClick}>
      <Icon variant="arrowR" label="move" />
    </Button>
  );
}

/** Props for {@link Button.Detail}. */
interface DetailButtonProps extends BaseButtonProps {}

/**
 * Primary button rendering a pen icon, used to open an item's detail view.
 *
 * @example
 * ```tsx
 * <Button.Detail onClick={actions.openDetail} />
 * ```
 */
function DetailButton({ onClick }: DetailButtonProps): JSX.Element {
  return (
    <Button variant="primary" onClick={onClick}>
      <Icon variant="pen" label="open item" />
    </Button>
  );
}

/** Props for {@link Button.Back}. */
interface BackButtonProps extends BaseButtonProps {}

/**
 * Secondary text button labeled "Back", used for backwards navigation.
 *
 * @example
 * ```tsx
 * <Button.Back onClick={handleBack} />
 * ```
 */
function BackButton({ onClick }: BackButtonProps): JSX.Element {
  return (
    <Button className="button-basic-reset" variant="secondary" onClick={onClick}>
      Back
    </Button>
  );
}

Button.Cancel = CancelButton;
Button.Create = CreateButton;
Button.Delete = DeleteButton;
Button.Edit = EditButton;
Button.Open = OpenButton;
Button.Add = AddButton;
Button.Move = MoveButton;
Button.Detail = DetailButton;
Button.Back = BackButton;
