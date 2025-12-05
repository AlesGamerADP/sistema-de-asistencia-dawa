'use client';

import React from 'react';
import { Clock, Users, FileCheck, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/admin-tabs.css';

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  value: string;
  onChange: (key: string) => void;
  items: TabItem[];
}

export default function Tabs({ value, onChange, items }: TabsProps) {
  const activeIndex = items.findIndex(item => item.key === value);
  
  const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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
      
      {/* Paddle animado */}
      <motion.div
        className="tab-paddle"
        initial={false}
        animate={{
          x: `${activeIndex * 100}%`
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      />
    </div>
  );
}

