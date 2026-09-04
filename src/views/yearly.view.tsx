import { type JSX, useState } from "react";

import { DateNav } from "../components/date-nav.component";
import Page from "../components/page.component";
import { YearlyProgress } from "../components/yearly-progress.component";
import { useYearlyProgress } from "../hooks/use-yearly-progress.hook";

/**
 * Yearly overview view: shows weekly completion progress for a whole year,
 * with controls to navigate between years.
 *
 * @example
 * <Route path="year" element={<YearlyView />} />
 */
export function YearlyView(): JSX.Element {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { weeks } = useYearlyProgress(year, new Date());
  const isCurrentYear = year >= new Date().getFullYear();

  return (
    <Page>
      <Page.Header>
        <Page.Title />
        <Page.Nav />
      </Page.Header>
      <Page.Content>
        <DateNav
          label={`${year} — ${weeks.length} Weeks`}
          center={String(year)}
          previousLabel="Previous year"
          nextLabel="Next year"
          nextDisabled={isCurrentYear}
          onPrevious={() => setYear((current) => current - 1)}
          onNext={() => setYear((current) => current + 1)}
        />
        <YearlyProgress year={year} />
      </Page.Content>
    </Page>
  );
}
