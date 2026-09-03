import { type JSX, useEffect, useState } from "react";
import type { ColumnStatus } from "../db/types";
import { Input, Segmented, Textarea } from "./input.component";

import "./item-form.component.css";

const COLUMN_OPTIONS: { value: ColumnStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "testing", label: "Testing" },
  { value: "done", label: "Done" },
];

/** Current values held by an {@link ItemForm}. */
export interface ItemFormValue {
  /** Item title. */
  title: string;
  /** Longer free-text description of the item. */
  description: string;
  /** Kanban column the item is assigned to. */
  column: ColumnStatus;
}

interface ItemFormProps {
  /** Title to seed the form with, e.g. when editing an existing item. */
  initialTitle?: string;
  /** Description to seed the form with, e.g. when editing an existing item. */
  initialDescription?: string;
  /** Column to seed the form with, e.g. when editing an existing item. Defaults to `'todo'`. */
  initialColumn?: ColumnStatus;
  /**
   * Called with the full form value on mount and again after every field
   * change, so the parent always has an up-to-date value to persist on save.
   */
  onChange: (value: ItemFormValue) => void;
}

/**
 * Form for creating or editing a {@link ItemFormValue}: title, description
 * and column. Holds its own field state and reports the current value to
 * the parent via `onChange`, which is responsible for persisting it.
 *
 * @example
 * <ItemForm
 *   key={item?.id ?? 'new'}
 *   initialTitle={item?.title}
 *   initialDescription={item?.description}
 *   initialColumn={item?.column}
 *   onChange={setFormValue}
 * />
 */
export function ItemForm(props: ItemFormProps): JSX.Element {
  const [title, setTitle] = useState(props.initialTitle ?? "");
  const [description, setDescription] = useState(props.initialDescription ?? "");
  const [column, setColumn] = useState<ColumnStatus>(props.initialColumn ?? "todo");

  useEffect(() => {
    props.onChange({ title, description, column });
  }, [title, props.onChange, description, column]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    props.onChange({ title: value, description, column });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    props.onChange({ title, description: value, column });
  };

  const handleColumnChange = (value: string) => {
    const nextColumn = value as ColumnStatus;
    setColumn(nextColumn);
    props.onChange({ title, description, column: nextColumn });
  };

  return (
    <div className="item-form">
      <Input
        label="Title"
        placeholder="Item title"
        initialValue={title}
        onDebouncedChange={handleTitleChange}
        debounceMs={0}
      />
      <Textarea
        label="Description"
        placeholder="Describe this item…"
        initialValue={description}
        onDebouncedChange={handleDescriptionChange}
        debounceMs={0}
      />
      <Segmented
        label="Column"
        options={COLUMN_OPTIONS}
        value={column}
        onChange={handleColumnChange}
      />
    </div>
  );
}
