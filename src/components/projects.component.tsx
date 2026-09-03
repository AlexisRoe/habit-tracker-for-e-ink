import { type JSX, type ReactNode, useState } from "react";

import { Button } from "./button.component";
import { Icon } from "./icons.component";
import { Input } from "./input.component";
import { ProgressBar, ProgressBarLegend } from "./progress.component";

import "./projects.component.css";

/** Props for {@link ProjectGrid}. */
interface ProjectGridProps {
  /** {@link ProjectCard}s (and similar) to lay out in a grid. */
  children: ReactNode;
}

/**
 * Grid layout for a list of {@link ProjectCard}s.
 *
 * @example
 * ```tsx
 * <ProjectGrid>
 *   {projects.map((project) => <ProjectCard key={project.id} {...project} />)}
 * </ProjectGrid>
 * ```
 */
export function ProjectGrid(props: ProjectGridProps): JSX.Element {
  return <div className="project-grid">{props.children}</div>;
}

/** Props for {@link ProjectCard.Update}. */
interface ProjectCardUpdateProps {
  /** Whether the card is shown. Renders nothing when `false`. */
  isVisible: boolean;
  /** Called when the card is closed without creating/saving. */
  onClose: () => void;
  /** Called with the entered name when confirmed. */
  onCreate: (label: string) => void;
  /** Card title. Defaults to `'New Project'`. */
  title?: string;
  /** Initial value of the name field, e.g. when editing an existing project. */
  initialValue?: string;
  /** Small text shown above the title. */
  eyebrow?: string;
}

/**
 * Card form for creating a new project or editing an existing project's name.
 * Exposed as `ProjectCard.Update`.
 *
 * @example
 * ```tsx
 * <ProjectCard.Update
 *   isVisible
 *   initialValue={project.name}
 *   onClose={() => setIsEditing(false)}
 *   onCreate={(name) => renameProject(project.id, name)}
 * />
 * ```
 */
function ProjectCardUpdate({
  eyebrow,
  initialValue = "",
  isVisible,
  onClose,
  onCreate,
  title = "New Project",
}: ProjectCardUpdateProps): JSX.Element | null {
  const [value, setValue] = useState<string>(initialValue);

  if (isVisible === false) return null;

  const handleCreate = () => {
    onCreate(value);
    onClose();
  };

  const isCreateDisabled = value.trim().length === 0;

  return (
    <e-card className="project-cards" title={title} eyebrow={eyebrow ?? ""} data-type="new-card">
      <div className="project-cards-content">
        <div className="project-cards-body">
          <Input
            label="Project name"
            placeholder="Example"
            onDebouncedChange={setValue}
            initialValue={initialValue}
          />
        </div>
        <div className="project-cards-actions">
          <Button.Create
            onClick={handleCreate}
            disabled={isCreateDisabled}
            label={initialValue === "" ? "Create" : "Update"}
          />
          <Button.Cancel onClick={onClose} />
        </div>
      </div>
    </e-card>
  );
}

/** Per-column item counts shown on a {@link ProjectCard}. */
interface Items {
  /** Number of items in the `todo` column. */
  todo: number;
  /** Number of items in the `in-progress` column. */
  inProgress: number;
  /** Number of items in the `testing` column. */
  testing: number;
  /** Number of items in the `done` column. */
  done: number;
}

/** Actions available on a {@link ProjectCard}. */
interface ItemActions {
  /** Called with the new name when the project is renamed. */
  update: (title: string) => void;
  /** Called when the project is deleted (after confirmation). */
  delete: () => void;
  /** Called when the project is opened. */
  open: () => void;
}

/** Props for {@link ProjectCard}. */
interface ProjectCardProps {
  /** Project name. */
  title: string;
  /** Per-column item counts, used to render progress. */
  items: Items;
  /** Card actions. */
  actions: ItemActions;
}

function sum(input: number[]): number {
  return input.reduce((prev, cur) => prev + cur, 0);
}

/**
 * Card summarizing a project's progress, with actions to open, rename, or
 * delete it (with an inline delete confirmation). Switches to
 * {@link ProjectCard.Update} while renaming.
 *
 * @example
 * ```tsx
 * <ProjectCard
 *   title={project.name}
 *   items={project.itemCounts}
 *   actions={{ open: () => openProject(project.id), update: rename, delete: removeProject }}
 * />
 * ```
 */
function ProjectCard(props: ProjectCardProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const total = sum(Object.values(props.items));
  const done = props.items.done;
  const doneInPercent = total === 0 ? 0 : (done * 100) / total;

  if (isEditing) {
    return (
      <ProjectCardUpdate
        isVisible
        title={props.title}
        initialValue={props.title}
        onClose={() => setIsEditing(false)}
        onCreate={(title) => props.actions.update(title)}
      />
    );
  }

  return (
    <e-card className="project-cards" title={props.title} eyebrow={`${total} ITEMS`}>
      <div className="project-cards-content">
        <div className="project-cars-progress project-cards-body">
          <ProgressBar value={doneInPercent} />
          <ProgressBarLegend doneInPercent={doneInPercent} label="done" amounts={props.items} />
        </div>
        {isConfirmingDelete ? (
          <div className="project-cards-delete-confirm">
            <div className="project-cards-delete-confirm-text">Delete this project?</div>
            <div className="project-cards-actions-left">
              <Button
                onClick={() => {
                  props.actions.delete();
                  setIsConfirmingDelete(false);
                }}
              >
                <Icon variant="trash" label="confirm delete" />
              </Button>
              <Button variant="secondary" onClick={() => setIsConfirmingDelete(false)}>
                <Icon variant="close" label="cancel delete" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="project-cards-actions">
            <div className="project-cards-actions-left">
              <Button.Open onClick={props.actions.open} />
              <Button.Edit onClick={() => setIsEditing(true)} />
            </div>
            <Button.Delete onClick={() => setIsConfirmingDelete(true)} />
          </div>
        )}
      </div>
    </e-card>
  );
}

ProjectCard.Update = ProjectCardUpdate;

export { ProjectCard };
