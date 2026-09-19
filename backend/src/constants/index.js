/**
 * Project Constants Module Placeholder
 * 
 * Future Purpose:
 * - Centralize all immutable values, configuration keys, and status codes.
 * - Standardize user privileges and statuses to prevent spelling mismatches.
 * 
 * Future Integrations:
 * - `HTTP_STATUS`: Centralize HTTP response codes (e.g. 200, 201, 400, 401, 404, 500).
 * - `USER_ROLES`: Map system privileges (PATIENT, PHARMACIST, ADMIN).
 * - `ORDER_STATUS`: State transitions for deliveries (PENDING, PROCESSING, SHIPPED, DELIVERED).
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const USER_ROLES = {
  PATIENT: 'PATIENT',
  PHARMACIST: 'PHARMACIST',
  ADMIN: 'ADMIN'
};

export default {
  HTTP_STATUS,
  USER_ROLES
};
