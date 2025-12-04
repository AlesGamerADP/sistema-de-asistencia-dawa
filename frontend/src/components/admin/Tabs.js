// src/components/admin/Tabs.jsx
import React from 'react';
import { Clock, Users, FileCheck, Trash2 } from 'lucide-react';
import '../../styles/admin-tabs.css';

export default function Tabs({ value, onChange, items }) {
  // Calcular el índice del tab activo
  const activeIndex = items.findIndex(item => item.key === value);
  
  // Iconos para cada tab
  const icons = {
    'resumen': Clock,
    'empleados': Users,
    'activos': FileCheck,
    'eliminados': Trash2
  };
  
  return (
    <div className="admin-tabs-container">
      {items.map((item, index) => {
        const IconComponent = icons[item.key];
        return (
          <React.Fragment key={item.key}>
            <input
              id={`tab-${item.key}`}
              name="admin-tab"
              type="radio"
              checked={value === item.key}
              onChange={() => onChange(item.key)}
              className="sr-only"
            />
            <label
              htmlFor={`tab-${item.key}`}
              className={`tab-label ${value === item.key ? 'active' : ''}`}
            >
              {IconComponent && <IconComponent size={16} className="tab-icon" />}
              <span>{item.label}</span>
            </label>
          </React.Fragment>
        );
      })}
      
      {/* Paddle animado (fondo deslizante) */}
      <div
        className="tab-paddle"
        style={{
          transform: `translateX(${activeIndex * 100}%)`
        }}
      />
    </div>
  );
}
