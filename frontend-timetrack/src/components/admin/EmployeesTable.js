// src/components/admin/EmployeesTable.jsx
import { User, Mail, Calendar, Shield, UserCheck, UserX } from 'lucide-react';

export default function EmployeesTable({ loading, rows=[], mode }) {
  if (loading) return <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6 text-gray-900 dark:text-gray-100">Cargando…</div>;
  if (!rows.length) return <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6 text-gray-900 dark:text-gray-100">Sin datos</div>;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 border-b-2 border-indigo-200 dark:border-gray-600">
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Empleado
                </div>
              </th>
              {mode==="logs" ? (
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Fecha
                  </div>
                </th>
              ) : (
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Correo
                  </div>
                </th>
              )}
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  {mode === "logs" ? "Estado" : "Rol"}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((r, index) => (
              <tr 
                key={r.id} 
                className="hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {r.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {r.name}
                      </div>
                    </div>
                  </div>
                </td>
                {mode==="logs" ? (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                      <Calendar size={16} className="text-indigo-500 dark:text-indigo-400" />
                      {r.date}
                    </div>
                  </td>
                ) : (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <Mail size={16} className="text-indigo-500 dark:text-indigo-400" />
                      {r.email}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    (r.role === 'admin' || r.status === 'activo') 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : (r.role === 'colaborador' || r.status === 'inactivo')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {(r.role === 'admin' || r.status === 'activo') ? (
                      <UserCheck size={14} />
                    ) : (
                      <UserX size={14} />
                    )}
                    {r.role || r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((r) => (
          <div key={r.id} className="p-4 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                {r.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <User size={14} className="flex-shrink-0" />
                  <span className="truncate">{r.name}</span>
                </div>
                
                {mode === "logs" ? (
                  <div className="text-xs text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                    <span>{r.date}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Mail size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{r.email}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    (r.role === 'admin' || r.status === 'activo') 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : (r.role === 'colaborador' || r.status === 'inactivo')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {(r.role === 'admin' || r.status === 'activo') ? (
                      <UserCheck size={12} />
                    ) : (
                      <UserX size={12} />
                    )}
                    {r.role || r.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}