function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  if (err && typeof err === "object" && "message" in err) {
    const text = String((err as { message?: unknown }).message ?? "");
    if (text) return text;
  }
  return "Unknown error";
}

export function formErrorMessage(err: unknown){
    const message = errorMessage(err);
    const status = message.includes("not found") ? 404
      : message.includes("Lacking credentials") ? 400
      : message.includes("already exists") ? 400
      : message.includes("required") ? 400
      : message.includes("Invalid email") ? 400
      : message.includes("This account uses Google") ? 401
      : message.includes("already registered") ? 409
      : message.includes("Invalid credentials") ? 401
      : message.includes("Invalid refresh token") ? 401
      : message.includes("Refresh token expired") ? 401
      : message.includes("invalid or expired") ? 400
      : message.includes("already verified") ? 400
      : message.includes("too weak") ? 400
      : message.includes("must be different") ? 400
      : message.includes("Image must") ? 400
      : message.includes("Image is required") ? 400
      : message.includes("Cloudinary is not configured") ? 503
      : message.includes("incorrect") ? 401
      : message.includes("Please wait") ? 429
      : 500;
    return { status, message }
}