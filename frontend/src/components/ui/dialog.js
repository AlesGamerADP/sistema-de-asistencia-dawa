// src/components/ui/dialog.js
import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './button';

export function Dialog({ open, onOpenChange, children }) {
  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay con animación */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      
      {/* Content Container - Centrado perfecto */}
      <div className="relative z-50 w-full max-w-2xl animate-in fade-in zoom-in duration-200">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = "", children, onClose }) {
  return (
    <div className={`
      bg-white dark:bg-gray-900 
      rounded-2xl 
      shadow-2xl 
      border border-gray-200 dark:border-gray-700
      max-h-[85vh] 
      overflow-hidden
      flex flex-col
      ${className}
    `}>
      {/* Botón cerrar superior derecha */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      )}
      
      {/* Contenido con scroll */}
      <div className="overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 pr-8 ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`mt-2 text-base text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

export function DialogBody({ children, className = "" }) {
  return (
    <div className={`px-6 sm:px-8 py-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`px-6 sm:px-8 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}

// 🆕 Modal de Confirmación para Eliminar
export function ConfirmDialog({ 
  open, 
  onOpenChange, 
  title = "¿Estás seguro?",
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "danger" // danger, warning, info
}) {
  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      buttonClass: "bg-red-600 hover:bg-red-700 text-white"
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white"
    },
    info: {
      icon: <AlertTriangle className="w-12 h-12 text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  };

  const style = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" onClose={() => onOpenChange(false)}>
        <div className="px-6 sm:px-8 py-8 text-center">
          {/* Icono centrado */}
          <div className={`mx-auto w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center mb-4`}>
            {style.icon}
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {title}
          </h3>

          {/* Descripción */}
          {description && (
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
              {description}
            </p>
          )}

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto px-6"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={`w-full sm:w-auto px-6 ${style.buttonClass}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
