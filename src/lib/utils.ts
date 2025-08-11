import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { HttpError } from "./http"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

  // Check if error is an HttpError instance
  if (error instanceof HttpError) {
    // Handle validation errors (422) using HttpError methods
    if (error.isValidationError()) {
      const validationErrors = error.getValidationErrors();
      
      if (useFormErrors && form) {
        // Set form errors for each validation error
        for (const errorItem of validationErrors) {
          form.setError(errorItem.field as keyof T, {
            message: errorItem.message,
          });
        }
      } else {
        // Show toast for each validation error
        for (const errorItem of validationErrors) {
          toast.error(errorItem.message, { position: toastPosition });
        }
      }
    } else {
      // Handle general errors
      const errorMessage = error.getErrorMessage(fallbackMessage);
      toast.error(errorMessage, { position: toastPosition });
    }
  } else {
    // Handle non-HttpError cases
    toast.error(fallbackMessage, { position: toastPosition });
  }
}
