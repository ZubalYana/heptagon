export function formErrorMessage(err: unknown){
    const message = err instanceof Error? err.message : 'Unknown error';
    const status = message.includes("not found") ? 404
  : message.includes("Lacking credentials") ? 400
  : 500;
  return { status, message }
}