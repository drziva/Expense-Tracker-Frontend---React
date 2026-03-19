export function emitApiError(message: string) {
  window.dispatchEvent(
    new CustomEvent("api-error", { detail: message })
  )
}

export function emitAuthError(message: string) {
  window.dispatchEvent(
    new CustomEvent("auth-error", { detail: message })
  );
}