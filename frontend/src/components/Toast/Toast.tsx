import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    const colors = {
        success: {
            bg: 'rgba(34, 197, 94, 0.15)',
            border: 'rgba(34, 197, 94, 0.5)',
            icon: '#22c55e',
        },
        error: {
            bg: 'rgba(239, 68, 68, 0.15)',
            border: 'rgba(239, 68, 68, 0.5)',
            icon: '#ef4444',
        },
        info: {
            bg: 'rgba(59, 130, 246, 0.15)',
            border: 'rgba(59, 130, 246, 0.5)',
            icon: '#3b82f6',
        },
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: colors[type].bg,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${colors[type].border}`,
                        borderRadius: 12,
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        zIndex: 1001,
                        maxWidth: 400,
                    }}
                >
                    <div style={{ color: colors[type].icon, flexShrink: 0 }}>
                        {icons[type]}
                    </div>
                    <span style={{
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        flex: 1,
                    }}>
                        {message}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4,
                            flexShrink: 0,
                        }}
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
