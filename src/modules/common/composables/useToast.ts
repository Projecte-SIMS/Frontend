import { toast, type ToastType } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

function formatMessage(payload: string | Error | unknown) {
  if (typeof payload === 'string') return payload
  if (payload instanceof Error) return payload.message
  try {
    return JSON.stringify(payload)
  } catch {
    return String(payload)
  }
}

/**
 * Muestra una notificación toast.
 * @param payload El mensaje o error a mostrar.
 * @param type El tipo de toast (success, error, info, warning). Por defecto es 'success'.
 */
export function showToast(payload: string | Error | unknown, type: ToastType = 'success') {
  const message = formatMessage(payload)
  toast(message, { 
    theme: 'dark', 
    type: type,
    pauseOnHover: false, 
    pauseOnFocusLoss: false,
    autoClose: 3000,
    position: 'bottom-right'
  })
}

export function useToast() {
  return {
    success: (message: string | Error | unknown) => showToast(message, 'success'),
    error: (message: string | Error | unknown) => showToast(message, 'error'),
    info: (message: string | Error | unknown) => showToast(message, 'info'),
    warning: (message: string | Error | unknown) => showToast(message, 'warning'),
  }
}

export default showToast
