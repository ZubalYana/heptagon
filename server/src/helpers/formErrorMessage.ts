export function formErrorMessage(err: unknown){
    const message = err instanceof Error? err.message : 'Unknown error';
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
      : message.includes("incorrect") ? 401
      : message.includes("Please wait") ? 429
      : 500;
    return { status, message }
}