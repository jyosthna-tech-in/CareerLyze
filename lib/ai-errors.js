const FALLBACK_AI_ERROR_MESSAGE = "Something went wrong while using AI. Please try again.";

export function getErrorMessage(
  error,
  fallbackMessage = FALLBACK_AI_ERROR_MESSAGE,
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

export function cleanAIResponse(text = "") {
  return text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
}

export function parseAIJsonResponse(
  text,
  fallbackMessage = "AI returned an invalid response. Please try again.",
) {
  try {
    return JSON.parse(cleanAIResponse(text));
  } catch (error) {
    throw new Error(fallbackMessage, { cause: error });
  }
}

export function normalizeAIError(
  error,
  fallbackMessage = FALLBACK_AI_ERROR_MESSAGE,
) {
  const message = getErrorMessage(error, fallbackMessage);

  if (message === "Unauthorized") {
    return new Error("Please sign in to continue.", { cause: error });
  }

  if (message === "User not found") {
    return new Error(
      "We couldn't find your profile. Please complete onboarding and try again.",
      { cause: error },
    );
  }

  if (/api key|gemini_api_key|missing api key/i.test(message)) {
    return new Error(
      "AI is not configured right now. Please try again later.",
      { cause: error },
    );
  }

  if (
    /429|quota|rate limit|too many requests|resource exhausted/i.test(message)
  ) {
    return new Error("AI is busy right now. Please wait a moment and try again.", {
      cause: error,
    });
  }

  if (
    /503|deadline|timed out|timeout|unavailable|overloaded/i.test(message)
  ) {
    return new Error(
      "AI is taking longer than expected. Please try again in a moment.",
      { cause: error },
    );
  }

  if (/invalid response|unexpected token|json/i.test(message)) {
    return new Error("AI returned an unexpected response. Please try again.", {
      cause: error,
    });
  }

  return new Error(message || fallbackMessage, { cause: error });
}

export async function withAIErrorHandling(operation, options = {}) {
  const {
    fallbackMessage = FALLBACK_AI_ERROR_MESSAGE,
    logLabel = "AI request",
  } = options;

  try {
    return await operation();
  } catch (error) {
    console.error(`${logLabel} failed:`, error);
    throw normalizeAIError(error, fallbackMessage);
  }
}
