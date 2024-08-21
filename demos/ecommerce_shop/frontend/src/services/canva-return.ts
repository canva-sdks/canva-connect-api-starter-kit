import type { CorrelationState } from "src/models";

const encodeCorrelationState = (stringifiedState: string) => {
  return btoa(stringifiedState);
};

export const decodeCorrelationState = (encodedState: string) => {
  return atob(encodedState);
};

/**
 * Create a URL to navigate to Canva, including Base64URL encoding the correlation state.
 * @param {Object} options - The options object.
 * @param {string} options.editUrl - The base url to navigate to.
 * @param {CorrelationState} options.correlationState - The correlation state to include in the navigation URL.
 * @returns {URL} A URL that can be used to Navigate to Canva.
 */
export const createNavigateToCanvaUrl = ({
  editUrl,
  correlationState,
}: {
  editUrl: string;
  correlationState: CorrelationState;
}): URL => {
  const redirectUrl = new URL(editUrl);
  const encodedCorrelationState = encodeCorrelationState(
    JSON.stringify(correlationState),
  );
  redirectUrl.searchParams.append(
    "correlation_state",
    encodeURIComponent(encodedCorrelationState),
  );
  return redirectUrl;
};
