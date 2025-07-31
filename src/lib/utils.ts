import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Types for API error handling
export interface ApiError {
  status: number;
  payload: {
    message?: string;
    errors?: {
      field: string;
      message: string;
    }[];
    statusCode?: number;
  };
}

export interface FormErrorHandler<T = Record<string, unknown>> {
  setError: (field: keyof T | `root.${string}` | "root", error: { message: string }) => void;
}

export interface ErrorHandlerOptions {
  useFormErrors?: boolean; // Whether to set form errors or use toast only
  toastPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  fallbackMessage?: string;
  logError?: boolean;
}

/**
 * Centralized error handler for API responses
 * Handles both validation errors (422) and general errors
 * Can set form errors or show toast notifications
 */
export function handleApiError<T = Record<string, unknown>>(
  error: unknown,
  form?: FormErrorHandler<T>,
  options: ErrorHandlerOptions = {}
) {
  const {
    useFormErrors = true,
    toastPosition = "top-left",
    fallbackMessage = "An error occurred",
    logError = true
  } = options;

  if (logError) {
    console.error("API Error:", error);
  }

  // Type guard to ensure error has the expected structure
  const apiError = error as ApiError;
  
  if (!apiError.status || !apiError.payload) {
    toast.error(fallbackMessage, { position: toastPosition });
    return;
  }

  const { status, payload } = apiError;

  // Handle validation errors (422)
  if (status === 422 && payload.errors && payload.errors.length > 0) {
    if (useFormErrors && form) {
      // Set form errors for each validation error
      for (const errorItem of payload.errors) {
        form.setError(errorItem.field as keyof T, {
          message: errorItem.message,
        });
      }
    } else {
      // Show toast for each validation error
      for (const errorItem of payload.errors) {
        toast.error(errorItem.message, { position: toastPosition });
      }
    }
  } else {
    // Handle general errors
    const errorMessage = payload.message || fallbackMessage;
    toast.error(errorMessage, { position: toastPosition });
  }
}
