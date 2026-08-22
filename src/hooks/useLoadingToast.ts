import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export function useLoadingToast(
    isLoading: boolean,
    message = "Đang tải dữ liệu...",
    id = "loading"
) {
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        if (isLoading) {
            toast.loading(message, { id });
        } else {
            toast.dismiss(id);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isLoading, message, id]);
}
