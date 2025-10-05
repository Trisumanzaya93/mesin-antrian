import { NextResponse } from "next/server";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | null;
}

/**
 * Success response
 */
export function successResponse<T>(data: T, message = "Success") {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(body, { status: 200 });
}

/**
 * Error response
 */
export function errorResponse(
  message = "Something went wrong",
  status = 500,
  error?: unknown
) {
  const body: ApiResponse = {
    success: false,
    message,
    error: error instanceof Error ? error.message : String(error || null),
  };
  return NextResponse.json(body, { status });
}
