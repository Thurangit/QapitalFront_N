import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X, Info } from 'lucide-react';

// Contexte pour gérer les toasts globalement
const ToastContext = React.createContext();

// Types de toast
export const TOAST_TYPES = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info'
};

// Icônes pour chaque type
const toastIcons = {
    [TOAST_TYPES.SUCCESS]: CheckCircle,
    [TOAST_TYPES.WARNING]: AlertTriangle,
    [TOAST_TYPES.ERROR]: XCircle,
    [TOAST_TYPES.INFO]: Info
};

// Couleurs pour chaque type
const toastColors = {
    [TOAST_TYPES.SUCCESS]: {
        bg: 'bg-green-500',
        text: 'text-green-800',
        icon: 'text-green-600',
        border: 'border-green-200'
    },
    [TOAST_TYPES.WARNING]: {
        bg: 'bg-orange-500',
        text: 'text-orange-800',
        icon: 'text-orange-600',
        border: 'border-orange-200'
    },
    [TOAST_TYPES.ERROR]: {
        bg: 'bg-red-500',
        text: 'text-red-800',
        icon: 'text-red-600',
        border: 'border-red-200'
    },
    [TOAST_TYPES.INFO]: {
        bg: 'bg-blue-500',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        border: 'border-blue-200'
    }
};

// Composant Toast individuel
const ToastItem = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animation d'entrée
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto-suppression après la durée spécifiée
        if (toast.duration !== 0) {
            const timer = setTimeout(() => {
                handleRemove();
            }, toast.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleRemove = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300);
    };

    const IconComponent = toastIcons[toast.type] || Info;
    const colors = toastColors[toast.type] || toastColors[TOAST_TYPES.INFO];

    return (
        <div
            className={`
                transform transition-all duration-300 ease-in-out
                ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
                ${colors.bg} ${colors.border} ${colors.text}
                rounded-lg shadow-lg border backdrop-blur-sm bg-opacity-95
                min-w-80 max-w-md mx-auto mb-3
            `}
            style={{
                transform: isVisible && !isLeaving ? 'translateY(0)' : 'translateY(-100%)',
                opacity: isVisible && !isLeaving ? 1 : 0
            }}
        >
            <div className="flex items-start p-4">
                {/* Icône */}
                <div className={`flex-shrink-0 ${colors.icon}`}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Contenu */}
                <div className="ml-3 flex-1">
                    {toast.title && (
                        <h4 className="text-sm font-medium mb-1">
                            {toast.title}
                        </h4>
                    )}
                    <p className="text-sm">
                        {toast.message}
                    </p>
                </div>

                {/* Bouton de fermeture */}
                <button
                    onClick={handleRemove}
                    className="ml-3 flex-shrink-0 rounded-md p-1 hover:bg-black hover:bg-opacity-10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Composant principal ToastContainer
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: TOAST_TYPES.INFO,
            duration: 2000,
            ...toast
        };
        setToasts(prev => [...prev, newToast]);
        return id;
    };

    // Exposer addToast globalement
    useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, []);

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <div className="pointer-events-auto">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onRemove={removeToast}
                    />
                ))}
            </div>
        </div>
    );
};

// Hook pour utiliser les toasts
export const useToast = () => {
    const showToast = (toast) => {
        if (window.showToast) {
            return window.showToast(toast);
        }
    };

    const success = (message, title = null, duration = 2000) => {
        return showToast({ type: TOAST_TYPES.SUCCESS, message, title, duration });
    };

    const warning = (message, title = null, duration = 2000) => {
        return showToast({ type: TOAST_TYPES.WARNING, message, title, duration });
    };

    const error = (message, title = null, duration = 3000) => {
        return showToast({ type: TOAST_TYPES.ERROR, message, title, duration });
    };

    const info = (message, title = null, duration = 2000) => {
        return showToast({ type: TOAST_TYPES.INFO, message, title, duration });
    };

    return { success, warning, error, info, showToast };
};

// Fonctions globales pour faciliter l'usage
export const toast = {
    success: (message, title = null, duration = 2000) => {
        if (window.showToast) {
            return window.showToast({ type: TOAST_TYPES.SUCCESS, message, title, duration });
        }
    },
    warning: (message, title = null, duration = 2000) => {
        if (window.showToast) {
            return window.showToast({ type: TOAST_TYPES.WARNING, message, title, duration });
        }
    },
    error: (message, title = null, duration = 3000) => {
        if (window.showToast) {
            return window.showToast({ type: TOAST_TYPES.ERROR, message, title, duration });
        }
    },
    info: (message, title = null, duration = 2000) => {
        if (window.showToast) {
            return window.showToast({ type: TOAST_TYPES.INFO, message, title, duration });
        }
    }
};

export default ToastContainer;
