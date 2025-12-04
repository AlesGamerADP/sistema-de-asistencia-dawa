// src/components/ui/select.js
import React from 'react';

export function Select({ value, onValueChange, children, className = "" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef(null);

  // Cerrar al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Encontrar el texto a mostrar
  let displayText = 'Seleccionar...';
  const selectContent = React.Children.toArray(children).find(
    child => child && child.type === SelectContent
  );
  
  if (selectContent && value) {
    const items = React.Children.toArray(selectContent.props.children);
    const selectedItem = items.find(item => item && item.props && item.props.value === value);
    if (selectedItem) {
      displayText = selectedItem.props.children;
    }
  }

  const handleSelect = (newValue) => {
    if (typeof onValueChange === 'function') {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={!value ? 'text-gray-500 dark:text-gray-400' : ''}>{displayText}</span>
        <svg 
          className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && selectContent && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg">
          {React.Children.map(selectContent.props.children, child => {
            if (child && child.type === SelectItem) {
              return React.cloneElement(child, { 
                currentValue: value,
                onSelect: handleSelect
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ children }) {
  // Este componente ya no se usa, pero lo mantenemos por compatibilidad
  return <>{children}</>;
}

export function SelectValue({ placeholder = "Seleccionar..." }) {
  // Este componente ya no se usa, pero lo mantenemos por compatibilidad
  return null;
}

export function SelectContent({ children }) {
  // Este componente solo agrupa los items
  return <>{children}</>;
}

export function SelectItem({ value, currentValue, onSelect, children }) {
  const isSelected = value === currentValue;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onSelect === 'function') {
      onSelect(value);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
        isSelected 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' 
          : 'text-gray-900 dark:text-gray-100'
      }`}
    >
      {children}
    </div>
  );
}
