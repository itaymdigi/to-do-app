"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

interface State {
  toasts: ToasterToast[]
}

export function useToast() {
  const [state, setState] = React.useState<State>({
    toasts: [],
  })

  const toastTimeouts = React.useRef(new Map<string, ReturnType<typeof setTimeout>>()).current

  const addToRemoveQueue = React.useCallback((toastId: string) => {
    if (toastTimeouts.has(toastId)) {
      return
    }

    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId)
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }))
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
  }, [toastTimeouts])

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.id && !toast.duration) addToRemoveQueue(toast.id)
    })
  }, [state.toasts, addToRemoveQueue])

  const toast = React.useCallback(function ({
    ...props
  }: Omit<ToasterToast, "id">) {
    const id = genId()

    setState((state) => ({
      ...state,
      toasts: [
        ...state.toasts,
        { ...props, id },
      ].slice(0, TOAST_LIMIT),
    }))

    return id
  }, [])

  const dismiss = React.useCallback(function (toastId?: string) {
    setState((state) => ({
      ...state,
      toasts: state.toasts.map((toast) =>
        toast.id === toastId || toastId === undefined
          ? {
              ...toast,
              open: false,
            }
          : toast
      ),
    }))
  }, [])

  const remove = React.useCallback(function (toastId?: string) {
    setState((state) => ({
      ...state,
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    }))
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss,
    remove,
  }
}
