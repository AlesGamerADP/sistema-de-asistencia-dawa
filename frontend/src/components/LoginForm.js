/**
 * Componente LoginForm
 * 
 * Formulario de inicio de sesión con animaciones profesionales
 * Incluye validación, estados de carga y manejo de errores
 * 
 * @module components/LoginForm
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ButtonSpinner } from './Loader';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {boolean} props.isLoading - Estado de carga
 * @param {string} props.roleType - Tipo de rol ('colaborador' | 'administrador')
 */
export function LoginForm({ onSubmit, isLoading, roleType }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Limpiar el formulario cuando cambie el rol
   */
  useEffect(() => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setErrors({});
    setTouched({});
  }, [roleType]);

  /**
   * Validar formulario en tiempo real
   */
  const validateField = (field, value) => {
    switch (field) {
      case 'username':
        if (!value.trim()) {
          return 'El usuario es requerido';
        }
        if (value.length < 3) {
          return 'El usuario debe tener al menos 3 caracteres';
        }
        return null;
      
      case 'password':
        if (!value.trim()) {
          return 'La contraseña es requerida';
        }
        if (value.length < 4) {
          return 'La contraseña debe tener al menos 4 caracteres';
        }
        return null;
      
      default:
        return null;
    }
  };

  /**
   * Validar formulario completo antes de enviar
   */
  const validateForm = () => {
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);

    const newErrors = {};
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambio en campos
   */
  const handleFieldChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  /**
   * Marcar campo como tocado al perder el foco
   */
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === 'username' ? username : password;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({ username: true, password: true });

    if (validateForm()) {
      onSubmit({ username, password, roleType });
    }
  };

  // Determinar placeholder según el rol
  const usernamePlaceholder = roleType === 'administrador' ? 'admin' : 'colaborador';
  const passwordPlaceholder = roleType === 'administrador' ? 'admin123' : 'colab123';

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: [1, 0.8, 1],
        scale: [1, 0.98, 1],
        transition: { duration: 0.3 }
      }}
      key={roleType} // Disparar animación al cambiar rol
    >
      {/* Campo: Usuario */}
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Usuario
        </Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            placeholder={usernamePlaceholder}
            value={username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
            onBlur={() => handleBlur('username')}
            required
            disabled={isLoading}
            className={`pl-10 ${errors.username && touched.username ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <AnimatePresence mode="wait">
          {errors.username && touched.username && (
            <motion.div
              className="flex items-center gap-1 text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.username}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Campo: Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            required
            disabled={isLoading}
            className={`pl-10 pr-10 ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          
          {/* Toggle ver/ocultar contraseña */}
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </motion.button>
        </div>
        <AnimatePresence mode="wait">
          {errors.password && touched.password && (
            <motion.div
              className="flex items-center gap-1 text-red-500 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Botón de Envío */}
      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isLoading || Object.keys(errors).some(key => errors[key])}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <ButtonSpinner />
            <span>Iniciando sesión...</span>
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </motion.form>
  );
}

export default LoginForm;
