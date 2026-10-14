export type AnalysisErrorCode =
  | "empty_input"
  | "missing_api_key"
  | "rate_limit"
  | "timeout"
  | "invalid_response"
  | "no_requirements";

export class AnalysisError extends Error {
  constructor(readonly code: AnalysisErrorCode) {
    super(code);
  }
}
