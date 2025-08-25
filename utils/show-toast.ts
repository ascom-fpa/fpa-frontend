import { toast, ToastOptions, ToastContent, Id } from "react-toastify"

type ToastType = "success" | "error" | "info" | "default"

interface ShowToastOptions {
    id?: Id
    type?: ToastType
    children: ToastContent<unknown>
    progress?: number // usefull to upload
    autoClose?: number | false
    isLoading?: boolean
}

export function showToast({ id, type = "default", children, progress, autoClose = 3000, isLoading, }: ShowToastOptions) {
    const options: ToastOptions = {
        type,
        progress,
        autoClose,
        isLoading,
    }

    if (id) {
        toast.update(id, {
            render: children,
            ...options,
        })
        return id
    }

    if (isLoading) {
        return toast.loading(children, { autoClose: 1000 })
    }

    return toast(children, options)
}