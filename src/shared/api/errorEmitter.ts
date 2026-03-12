export function emitApiError(message: string) {
  window.dispatchEvent(
    new CustomEvent("api-error", { detail: message })
  )
}