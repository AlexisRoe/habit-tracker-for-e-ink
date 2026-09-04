import type { ReactElement } from "react";
import type { JSX } from "react/jsx-runtime";

import { Text } from "./text.component";

import "./progress.component.css";

/** Props for {@link ProgressBar}. */
interface ProgressBarProps {
  /** Current progress value, out of 100. */
  value: number;
  /** Number of discrete steps to render along the bar, if any. */
  steps?: number;
  /** Accessible label for the bar. */
  label?: string;
}

/**
 * Linear progress bar, rendered through the `<e-progress>` custom element.
 *
 * @example
 * ```tsx
 * <ProgressBar value={doneInPercent} />
 * ```
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element {
  return (
    <e-progress
      className="progressbar"
      value={`${props.value}`}
      max="100"
      variant="linear"
      steps={props.steps ? `${props.steps}` : ""}
      label={props.label ?? ""}
    ></e-progress>
  );
}

/** Props for {@link ProgressBarLegend}. */
interface ProgressBarLegendProps {
  /** Item counts per column. */
  amounts: {
    todo: number;
    inProgress: number;
    testing: number;
    done: number;
  };
  /** Completion percentage shown next to `label`. */
  doneInPercent: number;
  /** Text shown after the percentage, e.g. `'done'`. */
  label: string;
}

/**
 * Legend showing per-column item counts and an overall completion percentage,
 * meant to be paired with a {@link ProgressBar}.
 *
 * @example
 * ```tsx
 * <ProgressBarLegend doneInPercent={doneInPercent} label="done" amounts={project.items} />
 * ```
 */
export function ProgressBarLegend(props: ProgressBarLegendProps): JSX.Element {
  return (
    <div className="progress-bar-legend-container">
      <div className="progress-bar-legend-item-container">
        <div className="progress-bar-legend-item-todo">{props.amounts.todo}</div>
        <div className="progress-bar-legend-item-inprogress">{props.amounts.inProgress}</div>
        <div className="progress-bar-legend-item-testing">{props.amounts.testing}</div>
        <div className="progress-bar-legend-item-done">{props.amounts.done}</div>
      </div>
      <div className="progress-bar-legend-done-container">
        <div>{`${props.doneInPercent}% ${props.label}`}</div>
      </div>
    </div>
  );
}

/** Props for {@link ProgressOverview}. */
interface ProgressOverviewProps {
  /** Total number of items. */
  total: number;
  /** Number of items in the `done` column. */
  done: number;
}

/**
 * Compact `done/total` and percentage summary, rendered in mono text.
 *
 * @example
 * ```tsx
 * <ProgressOverview done={doneCount} total={itemCount} />
 * ```
 */
export function ProgressOverview({ total, done }: ProgressOverviewProps): JSX.Element {
  const doneInPercent = total !== 0 ? (done * 100) / total : 0;

  return (
    <div className="progress-overview">
      <Text.Mono>{`${done}/${total} DONE`}</Text.Mono>
      <Text.Mono>{`●`}</Text.Mono>
      <Text.Mono>{`${doneInPercent}%`}</Text.Mono>
    </div>
  );
}

/** Props for {@link ProgressContainer}. */
interface ProgressContainerProps {
  /** Progress-related elements to lay out together, e.g. a {@link ProgressBar} and {@link ProgressOverview}. */
  children: ReactElement | ReactElement[];
}

/**
 * Layout wrapper grouping progress-related elements together.
 *
 * @example
 * ```tsx
 * <ProgressContainer>
 *   <ProgressBar value={completionPercentage} />
 *   <ProgressOverview done={doneCount} total={itemCount} />
 * </ProgressContainer>
 * ```
 */
export function ProgressContainer({ children }: ProgressContainerProps): JSX.Element {
  return <div className="progress-container">{children}</div>;
}
