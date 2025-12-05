/**
 * Componente LoginForm
 * 
 * Formulario de inicio de sesión con diseño limpio
 * 
 * @module components/LoginForm
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ButtonSpinner } from './Loader';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: { username: string; password: string; roleType?: string }) => void;
  isLoading: boolean;
  roleType: 'colaborador' | 'administrador';
}

interface FormErrors {
  username?: string;
  password?: string;
}

interface TouchedFields {
  username?: boolean;
  password?: boolean;
}

export function LoginForm({ onSubmit, isLoading, roleType }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  useEffect(() => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setErrors({});
    setTouched({});
  }, [roleType]);

  const validateField = (field: 'username' | 'password', value: string): string | null => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'El usuario es requerido';
        if (value.length < 3) return 'El usuario debe tener al menos 3 caracteres';
        return null;
      case 'password':
        if (!value.trim()) return 'La contraseña es requerida';
        if (value.length < 4) return 'La contraseña debe tener al menos 4 caracteres';
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): boolean => {
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);

    const newErrors: FormErrors = {};
    if (usernameError) newErrors.username = usernameError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: 'username' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === 'username' ? username : password;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (validateForm()) {
      onSubmit({ username, password, roleType });
    }
  };

  // Placeholders con las credenciales de prueba
  const usernamePlaceholder = roleType === 'administrador' ? 'admin' : 'colaborador';
  const passwordPlaceholder = roleType === 'administrador' ? 'admin123' : 'colab123';

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {/* Campo: Usuario */}
      <div className="login-field">
        <Label htmlFor="username" className="login-label">
          <User className="w-4 h-4" />
          Usuario
        </Label>
        <div className="login-input-wrapper">
          <Input
            id="username"
            type="text"
            placeholder={usernamePlaceholder}
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('username', e.target.value)}
            onBlur={() => handleBlur('username')}
            required
            disabled={isLoading}
            className="login-input"
          />
          <User className="login-input-icon-right" />
        </div>
        {errors.username && touched.username && (
          <div className="login-error">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.username}</span>
          </div>
        )}
      </div>

      {/* Campo: Contraseña */}
      <div className="login-field">
        <Label htmlFor="password" className="login-label">
          <Lock className="w-4 h-4" />
          Contraseña
        </Label>
        <div className="login-input-wrapper">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            required
            disabled={isLoading}
            className="login-input login-input-password login-input-with-eye"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="login-eye-button"
            disabled={isLoading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && touched.password && (
          <div className="login-error">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Botón de Envío */}
      <Button
        type="submit"
        className="login-button"
        disabled={isLoading || Object.keys(errors).some(key => errors[key as keyof FormErrors])}
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
    </form>
  );
}

export default LoginForm;
