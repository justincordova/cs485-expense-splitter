import "server-only";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createErrorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return createErrorResponse(error.statusCode, error.message);
  }
  return createErrorResponse(500, "Internal server error");
}
