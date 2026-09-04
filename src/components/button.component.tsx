import type { JSX, ReactNode } from "react";
import { Icon, type IconProps } from "./icons.component";

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
  /** Visual style. `'transparent'` strips the background/border, showing only its content. Defaults to `'primary'`. */
  variant?: "primary" | "secondary" | "transparent";
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
  const isTransparent = variant === "transparent";
  const combinedClassName =
    [
      className,
      isTransparent ? "button-transparent" : undefined,
      size === "small" ? "button-small" : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <e-button
      className={combinedClassName}
      variant={isTransparent ? "secondary" : variant}
      onClick={onClick}
      disabled={disabled}
    >
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

/** Props for {@link Button.Naked}. */
interface NakedButtonProps extends BaseButtonProps {
  /** Which icon glyph to render. */
  variant: IconProps["variant"];
  /** Accessible label for the icon/button. */
  label: string;
  /** Icon size. Defaults to `'24'`. */
  size?: IconProps["size"];
  /** Extra class name(s) applied to the underlying button. */
  className?: string;
  /** Disables the button when `true`. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * Icon-only button with no background or border, used where a minimal
 * control showing just an icon is needed.
 *
 * @example
 * ```tsx
 * <Button.Naked variant="check" label="Save habit" onClick={handleAccept} />
 * ```
 */
function NakedButton({
  onClick,
  variant,
  label,
  size,
  className,
  disabled = false,
}: NakedButtonProps): JSX.Element {
  return (
    <Button variant="transparent" className={className} onClick={onClick} disabled={disabled}>
      <Icon variant={variant} label={label} size={size} />
    </Button>
  );
}

/** Props for {@link Button.Transparent}. */
interface TransparentButtonProps extends BaseButtonProps {
  /** Button content, usually text. */
  children: ReactNode;
  /** Extra class name(s) applied to the underlying button. */
  className?: string;
  /** Disables the button when `true`. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * Text button with no background or border, used where a minimal control
 * showing plain content (usually text) is needed.
 *
 * @example
 * ```tsx
 * <Button.Transparent onClick={onDateClick}>{convertDateToTitle(today)}</Button.Transparent>
 * ```
 */
function TransparentButton({
  onClick,
  children,
  className,
  disabled = false,
}: TransparentButtonProps): JSX.Element {
  return (
    <Button variant="transparent" className={className} onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

/** Props for {@link Button.Habit}. */
interface HabitButtonProps {
  /** Whether the day is completed for this habit. Renders a filled circle when `true`. Ignored when {@link locked} is `true`. */
  completed: boolean;
  /**
   * Renders a fixed, non-interactive hatched circle with no accessible name,
   * for a day the habit cannot be toggled on because it didn't exist yet.
   * Defaults to `false`.
   */
  locked?: boolean;
  /**
   * Renders a fixed, non-interactive empty circle with no accessible name,
   * for a day in the future. Defaults to `false`.
   */
  future?: boolean;
  /** Accessible label describing the habit and day. */
  label: string;
  /** Called when the circle is clicked. Not called when {@link locked} or {@link future} is `true`. */
  onClick?: () => void;
}

/**
 * Circular toggle button used for a single habit/day cell. When `locked` is
 * `true` it renders a fixed hatched circle with no interaction, regardless of
 * `completed`. When `future` is `true` it renders a fixed empty circle with
 * no interaction. Otherwise it renders filled when `completed`, empty
 * otherwise, and is clickable either way (including to un-complete a filled
 * day).
 *
 * @example
 * ```tsx
 * <Button.Habit completed={isCompleted} label="Read on 2026-09-01" onClick={toggle} />
 * ```
 */
function HabitButton({
  completed,
  locked = false,
  future = false,
  label,
  onClick,
}: HabitButtonProps): JSX.Element {
  const inert = locked || future;
  const combinedClassName = [
    "button-habit",
    !inert && completed ? "button-habit-filled" : undefined,
    locked ? "button-habit-locked" : undefined,
    future ? "button-habit-future" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      variant="secondary"
      className={combinedClassName}
      onClick={inert ? undefined : onClick}
      disabled={inert}
    >
      {inert ? null : <span className="visually-hidden">{label}</span>}
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
Button.Naked = NakedButton;
Button.Transparent = TransparentButton;
Button.Habit = HabitButton;
