import type { JSX } from "react";

import Page from "../components/page.component";

export function YearlyView(): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Page.Title />
        <Page.Nav />
      </Page.Header>
      <Page.Content>YEAR</Page.Content>
    </Page>
  );
}
