import type { JSX } from "react";

import { AddHabitBanner } from "../components/add-habit-banner.component";
import { DateNav } from "../components/date-nav.component";
import Page from "../components/page.component";

export function DashboardView(): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Page.Title />
        <Page.Nav />
      </Page.Header>
      <Page.Content>
        <DateNav />
        <AddHabitBanner onAdd={() => alert("hallo")} />
      </Page.Content>
    </Page>
  );
}
