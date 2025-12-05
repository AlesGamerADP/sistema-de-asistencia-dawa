'use client';

import { Button } from "../ui/button";
import useAuthStore from "../../store/useAuthStore";
import { Building2, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminTopbarProps {
  title: string;
  subtitle: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  const { logout } = useAuthStore();
  
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y título */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Building2 size={20} />
              <span className="text-sm">EISB&M</span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">{title}</h1>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                <User size={14} />
                <p className="truncate">{subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Botón logout */}
          <Button 
            variant="outline"
            className="flex items-center gap-2 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors" 
            onClick={logout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

