/**
 * Componentes Card
 * 
 * Sistema de tarjetas para contenedores de contenido
 * Card, CardHeader, CardTitle, CardDescription, CardContent
 * 
 * @module components/ui/card
 */

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Principal
 */
export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white
        rounded-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Header
 */
export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div
      className={`
        px-6 pt-6 pb-4
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Title
 */
export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
  return (
    <h2
      className={`
        text-xl font-bold
        text-black
        ${className}
      `}
      {...props}
    >
      {children}
    </h2>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Description
 */
export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p
      className={`
        text-sm
        text-gray-500
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card Content
 */
export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div
      className={`
        px-6 pb-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

