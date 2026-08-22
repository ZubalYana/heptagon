export function formErrorMessage(err: unknown){
    const message = err instanceof Error? err.message : 'Unknown error';
    const status = message.includes("not found") ? 404
      : message.includes("Lacking credentials") ? 400
      : message.includes("already exists") ? 400
      : message.includes("required") ? 400
      : message.includes("Invalid email") ? 400
      : message.includes("Invalid credentials") ? 401
      : message.includes("Invalid refresh token") ? 401
      : message.includes("Refresh token expired") ? 401
      : 500;
    return { status, message }
}