import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: ContentfulStatusCode = 500,
    public errorCode: string = "INTERNAL_SERVER_ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    errorCode = "BAD_REQUEST",
    details?: unknown,
  ) {
    super(message, 400, errorCode, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized",
    errorCode = "UNAUTHORIZED",
    details?: unknown,
  ) {
    super(message, 401, errorCode, details);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = "Not Found",
    errorCode = "NOT_FOUND",
    details?: unknown,
  ) {
    super(message, 404, errorCode, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    errorCode = "CONFLICT",
    details?: unknown,
  ) {
    super(message, 409, errorCode, details);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR",
    details?: unknown,
  ) {
    super(message, 500, errorCode, details);
    this.name = "InternalServerError";
  }
}

export function sendSuccess<T>(
  c: Context,
  data: T,
  statusCode: ContentfulStatusCode = 200,
  message?: string,
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return c.json(body, statusCode);
}

export function sendError(
  c: Context,
  message: string,
  statusCode: ContentfulStatusCode = 500,
  errorCode?: string,
  details?: unknown,
) {
  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(errorCode ? { error: errorCode } : {}),
    ...(details !== undefined ? { details } : {}),
  };
  return c.json(body, statusCode);
}
