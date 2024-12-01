export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "object" && error !== null) {
    if ("responseMessage" in error) {
      return (error as { responseMessage: string }).responseMessage;
    } else if ("title" in error && typeof (error as any).title === "string") {
      return (error as { title: string }).title;
    } else if ("error" in error && typeof (error as any).error === "string") {
      return (error as { error: string }).error;
    } else if ("errors" in error && typeof (error as any).errors === "object") {
      const errorObj = error as { errors: Record<string, string[]> };
      const firstErrorKey = Object.keys(errorObj.errors)[0];
      if (firstErrorKey && Array.isArray(errorObj.errors[firstErrorKey])) {
        return errorObj.errors[firstErrorKey][0] || "An error occurred";
      }
    }
  }
  return "An unexpected error occurred";
}
