import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    const success = onLogin(username, password);
    if (!success) {
      setError('Usuario no encontrado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-lg mb-4">
            <Clock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EISB&M</h1>
          <p className="text-slate-600">Sistema de Registro de Horarios</p>
        </div>

        {/* Card de Login */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-slate-900">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="username"
                    placeholder="jperez"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                Ingresar al Sistema
              </Button>
            </form>
            
            {/* Info de usuarios */}
            <div className="mt-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Usuarios de Prueba</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700">jperez</span>
                  <span className="text-slate-500">• Empleado</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700">mgarcia</span>
                  <span className="text-slate-500">• Empleado</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-slate-700">supervisor</span>
                  <span className="text-slate-500">• Administrador</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © 2025 EISB&M - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
