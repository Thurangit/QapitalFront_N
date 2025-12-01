import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook de debounce pour optimiser les recherches et inputs
 * Retarde l'exécution jusqu'à ce que l'utilisateur arrête de taper
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Hook pour créer une fonction debouncée
 * Utile pour les appels API lors de la recherche
 */
export const useDebouncedCallback = (callback, delay = 500) => {
    const timeoutRef = useRef(null);
    const callbackRef = useRef(callback);

    // Mettre à jour la référence du callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );

    // Nettoyer le timeout lors du démontage
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

/**
 * Hook de throttle pour limiter la fréquence d'exécution
 * Utile pour les événements scroll, resize, etc.
 */
export const useThrottle = (value, delay = 500) => {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRan.current >= delay) {
                setThrottledValue(value);
                lastRan.current = Date.now();
            }
        }, delay - (Date.now() - lastRan.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return throttledValue;
};

