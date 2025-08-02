// src/features/product/hooks/useDebouncedEffect.js
import { useEffect, useRef } from "react";

/**
 * Custom hook similar a useEffect pero con debounce
 */
export function useDebouncedEffect(callback, delay, deps) {
    const firstCall = useRef(true);

    useEffect(() => {
        if (firstCall.current) {
            firstCall.current = false;
            return;
        }

        const handler = setTimeout(() => callback(), delay);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay, ...deps]);
}
