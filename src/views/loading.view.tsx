import type { JSX } from "react";
import { EmptyState } from "../components/empty-state.component";
import Page from "../components/page.component";
import { Text } from "../components/text.component";
import { convertDateToTitle } from "../utils/date-converter.util";

/**
 * Full-page view shown in place of a view's normal content while it
 * is loading.
 */
function LoadingView(): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Text.Title>{convertDateToTitle()}</Text.Title>
      </Page.Header>
      <Page.Content>
        <EmptyState icon="refresh" message="… LOADING …" />
      </Page.Content>
    </Page>
  );
}

export default LoadingView;
