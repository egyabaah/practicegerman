import { 
    APIConnectionError, 
    APIConnectionTimeoutError, 
    AuthenticationError, 
    BadRequestError, 
    ConflictError, 
    InternalServerError, 
    InvalidWebhookSignatureError, 
    NotFoundError, 
    OpenAIError, 
    PermissionDeniedError, 
    RateLimitError, 
    UnprocessableEntityError,
} from "openai";

type TErrorWithStatus = Error & { code?: number; status?: number };

// TODO: Replace i18n strings
const GENERIC_PROD_ERROR = "An unexpected error occurred. Please try again later or contact support.";

/** 
 * Maps known OpenAI errors to user-friendly messages 
 * https://github.com/openai/openai-node/blob/master/src/core/error.ts 
 * 
 * @param error - The error to map
 * @returns A user-friendly error message
 * 
 * TODO: Replace hardcoded strings with i18n strings later
*/
export function mapOpenAIError(error: unknown): string {
    if (error instanceof Error) {
        
        if (error instanceof APIConnectionError || error instanceof APIConnectionTimeoutError) {
            return "Unable to reach the server. Please check your internet connection and try again.";
        }
        if (error instanceof AuthenticationError) {
            return "Authentication error. Please contact support.";
        }
        if (error instanceof BadRequestError) {
            return "There was a problem with your request. Please try again.";
        }
        if (error instanceof ConflictError) {
            return "Conflict detected. Please retry your action.";
        }
        if (error instanceof InternalServerError) {
            return "Something went wrong on our side. Please try again later.";
        }
        if (error instanceof NotFoundError) {
            return "Requested resource was not found. Please try again later.";
        }
        if (error instanceof PermissionDeniedError) {
            return "You don’t have permission to perform this action.";
        }
        if (error instanceof RateLimitError) {
            return "Too many requests. Please wait a moment and try again.";
        }
        if (error instanceof UnprocessableEntityError) {
            return "Unable to process your request. Please check your input.";
        }
        if (error instanceof InvalidWebhookSignatureError) {
            return "We couldn’t verify this request. Please try again.";
        }
    
        // OpenAIError fallback
        if (error instanceof OpenAIError) {
            if (process.env.NODE_ENV === "production") {
                // Display user friendly error in production.
                return GENERIC_PROD_ERROR;
            };
            return error.message;
            
        };
    
        // fallback for unknown errors
        // At this point, 'error' is an instance of 'Error' but not a specific OpenAIError subclass.
        // It might be a generic Error object augmented with 'code' or 'status' properties
        // from other contexts (e.g., HTTP errors from a different library or a raw fetch error).
        const errWithPotentialCode = error as TErrorWithStatus;
        const code = errWithPotentialCode.code ?? errWithPotentialCode.status ?? null;
        switch (code) {
            case 401: return "Authentication error. Please contact support.";
            case 403: return "Access forbidden. Your account may not have permission.";
            case 429: return "Too many requests. Please wait a moment and try again.";
            case 500: return "Something went wrong on our side. Please try again later.";
            case 503: return "Service unavailable or overloaded. Try again later.";
            default: {
                // TODO: Add contact page
                if (process.env.NODE_ENV === "production") {
                    // Display user friendly error in production.
                    return GENERIC_PROD_ERROR;
                };
                return error?.message ?? "An unexpected error occurred. Please try again later.";
            };
        }
    }
    return GENERIC_PROD_ERROR;
}