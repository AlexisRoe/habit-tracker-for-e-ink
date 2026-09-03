import { type JSX, useState } from "react";

import { AddHabitBanner } from "../components/add-habit-banner.component";
import { DateNav } from "../components/date-nav.component";
import { EmptyState } from "../components/empty-state.component";
import { HabitTable } from "../components/habit-table.component";
import Page from "../components/page.component";
import { useHabits } from "../hooks/use-habits.hook";
import { getWeekDays } from "../utils/date-converter.util";

export function DashboardView(): JSX.Element {
  const [date, setDate] = useState(() => new Date());
  const weekDays = getWeekDays(date);
  const { habits, isAtLimit, addHabit, renameHabit, moveHabit, archiveHabit, toggleFulfillment } =
    useHabits(date);

  function goToPreviousWeek(): void {
    setDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() - 7);
      return next;
    });
  }

  function goToNextWeek(): void {
    setDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + 7);
      return next;
    });
  }

  return (
    <Page>
      <Page.Header>
        <Page.Title />
        <Page.Nav />
      </Page.Header>
      <Page.Content>
        <DateNav date={date} onPrevious={goToPreviousWeek} onNext={goToNextWeek} />
        {habits.length === 0 ? (
          <EmptyState icon="plus" message="... no habit yet ..." />
        ) : (
          <HabitTable
            habits={habits}
            weekDays={weekDays}
            onToggleCompletion={toggleFulfillment}
            onRename={renameHabit}
            onArchive={archiveHabit}
            onMoveUp={(habitId) => moveHabit(habitId, -1)}
            onMoveDown={(habitId) => moveHabit(habitId, 1)}
          />
        )}
        <AddHabitBanner onAdd={addHabit} hidden={isAtLimit} />
      </Page.Content>
    </Page>
  );
}
