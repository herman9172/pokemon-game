export enum CoreErrorCodes {
  ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND',
  ROUTES_NOT_SET = 'ROUTES_NOT_SET',
  UNKNOWN = 'UNKNOWN',
  SECRET_MANAGER_ERROR_WITH_KEY = 'SECRET_MANAGER_ERROR_WITH_KEY',
  DB_REPOSITORY_ERROR_WITH_SECRET = 'DB_REPOSITORY_ERROR_WITH_SECRET',
  DEPENDENCY_EXCEEDED_TIMEOUT = 'DEPENDENCY_EXCEEDED_TIMEOUT',
  ROUTE_VALIDATION_ERROR = 'ROUTE_VALIDATION_ERROR',
  SQS_ERROR = 'SQS_ERROR',
}