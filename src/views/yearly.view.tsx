import { type JSX, useState } from "react";

import Page from "../components/page.component";
import { YearlyProgress } from "../components/yearly-progress.component";

export function YearlyView(): JSX.Element {
  const [year, setYear] = useState(() => new Date().getFullYear());

  return (
    <Page>
      <Page.Header>
        <Page.Title />
        <Page.Nav />
      </Page.Header>
      <Page.Content>
        <YearlyProgress
          year={year}
          onPreviousYear={() => setYear((current) => current - 1)}
          onNextYear={() => setYear((current) => current + 1)}
        />
      </Page.Content>
    </Page>
  );
}
