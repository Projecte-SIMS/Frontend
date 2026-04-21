import { toast, type ToastType } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

function formatMessage(payload: string | Error | unknown) {
  if (!payload) return 'Error desconocido'
  if (typeof payload === 'string') return payload
  if (payload instanceof Error) return payload.message
  
  try {
    if (typeof payload === 'object') {
      return JSON.stringify(payload)
    }
  } catch (e) {
    return 'Error no serializable'
  }
  
  return String(payload)
}

/**
 * Muestra una notificación toast rediseñada.
 */
export function showToast(payload: string | Error | unknown, type: ToastType = 'success') {
  const message = formatMessage(payload)
  toast(message, { 
    theme: 'colored', // Usamos el modo coloreado para máximo contraste
    type: type,
    pauseOnHover: true, 
    pauseOnFocusLoss: false,
    autoClose: 3000, // Se cierra a los 3 segundos
    position: 'top-center',
    transition: 'bounce', // Animación nativa optimizada
    hideProgressBar: true,
    closeOnClick: true,
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
