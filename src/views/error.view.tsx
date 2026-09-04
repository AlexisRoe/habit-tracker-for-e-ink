import type { JSX } from "react";
import { EmptyState } from "../components/empty-state.component";
import Page from "../components/page.component";
import { Text } from "../components/text.component";
import { convertDateToTitle } from "../utils/date-converter.util";

interface ErrorViewProps {
  /** Error message shown to the user. */
  message: string;
}

/**
 * Full-page view shown in place of a view's normal content when it
 * fails to load, surfacing the given error message.
 */
function ErrorView({ message }: ErrorViewProps): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Text.Title>{convertDateToTitle()}</Text.Title>
      </Page.Header>
      <Page.Content>
        <EmptyState icon="moon" message={message} />
      </Page.Content>
    </Page>
  );
}

export default ErrorView;
