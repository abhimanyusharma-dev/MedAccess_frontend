/**
 * Cross-cutting Utilities Module Placeholder
 * 
 * Future Purpose:
 * - Implement generic utilities utilized across multiple tiers of the project.
 * - Centralize application logger setup (e.g., Winston) and standard API exceptions.
 * 
 * Future Integrations:
 * - Custom Logger wrapper: Standard log files to `logs/` directory.
 * - `ApiError` class: Custom Javascript Exception subclass for Express error handles.
 * - HTTP response wrapper: Consistent status/data formatting for API client UI.
 */

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

export default ApiError;
