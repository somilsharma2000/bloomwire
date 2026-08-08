import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'wishlist' | 'cart' | 'auth'
  icon?: string
}

interface ToastState {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type'], icon?: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  showToast: (message, type = 'success', icon) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    set((state) => ({ toasts: [...state.toasts, { id, message, type, icon }] }))
    const duration = type === 'cart' ? 3000 : 3500
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// Convenience hook for non-React usage
export const toast = {
  show: (message: string, type: Toast['type'] = 'success', icon?: string) => {
    useToastStore.getState().showToast(message, type, icon)
  },
}
