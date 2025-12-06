'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { motion } from "framer-motion";
import useAuthStore from "../../../store/useAuthStore";

import AdminTopbar from "../../../components/layout/AdminTopbar";
import StatsHeader from "../../../components/admin/StatsHeader";
import Tabs from "../../../components/admin/Tabs";
import HoursSummary from "../../../components/admin/HoursSummary";
import EmployeesTable from "../../../components/admin/EmployeesTable";
import { EmployeeManagement } from "../../../components/admin/EmployeesManagement";
import ActiveRecordsView from "../../../components/admin/ActiveRecordsView";
import DeletedRecordsView from "../../../components/admin/DeletedRecordsView";

import { getUsuarios, getRegistros, getRegistrosEliminados, createEmpleado, updateEmpleado, deleteEmpleado, createUsuario, getDepartamentos } from "../../../api/admin";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
interface NormalizedRegistro {
  entrada: Date | null;
  salida: Date | null;
  empleadoId: string | number | null;
  nombre: string;
  raw: any;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  employmentType?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  empleado?: any;
}

interface SummaryItem {
  id: string | number;
  initials: string;
  name: string;
  contract: string;
  rank: number;
  weekHours: number;
  weekTarget: number;
  monthHours: number;
  monthTarget: number;
  weekGoalOk: boolean;
}

interface Stats {
  employees: number;
  activeLogs: number;
  deletedLogs: number;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
const parseDate = (v: any): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const firstNonNull = (...vals: any[]): any => vals.find((v) => v !== undefined && v !== null);

// Normaliza un registro del backend a un formato común
function normalizeRegistro(r: any): NormalizedRegistro {
  const entrada =
    parseDate(r.fecha_entrada) ||
    parseDate(r.hora_entrada) ||
    parseDate(r.entrada) ||
    parseDate(r.createdAt) ||
    null;

  const salida =
    parseDate(r.fecha_salida) ||
    parseDate(r.hora_salida) ||
    parseDate(r.salida) ||
    parseDate(r.updatedAt) ||
    null;

  const empleadoId =
    firstNonNull(r.empleado_id, r.empleadoId, r.id_empleado, r.user_id) || null;

  const nombre =
    r.empleado?.nombre && r.empleado?.apellido
      ? `${r.empleado.nombre} ${r.empleado.apellido}`
      : r.empleado?.nombre ||
        r.nombre_empleado ||
        r.nombre ||
        `Empleado ${empleadoId ?? ""}`;

  return { entrada, salida, empleadoId, nombre, raw: r };
}

function horasEntre(entrada: Date | null, salida: Date | null): number {
  if (!entrada || !salida) return 0;
  const ms = Math.max(0, salida.getTime() - entrada.getTime());
  return +(ms / 1000 / 60 / 60).toFixed(2);
}

// semana actual (lunes-domingo)
function isThisWeek(d: Date | null): boolean {
  if (!d) return false;
  const now = new Date();
  const day = now.getDay(); // 0=Dom ... 6=Sab
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return d >= monday && d <= sunday;
}

function isThisMonth(d: Date | null): boolean {
  if (!d) return false;
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

// ────────────────────────────────────────────────────────────
// Componente
// ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("resumen");

  const [stats, setStats] = useState<Stats>({ employees: 0, activeLogs: 0, deletedLogs: 0 });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [deletedLogs, setDeletedLogs] = useState<any[]>([]);
  const [activeRecords, setActiveRecords] = useState<any[]>([]);
  const [deletedRecords, setDeletedRecords] = useState<any[]>([]);

  const loadDashboardData = async () => {
    try {
      const [usuariosRes, registrosRes, eliminadosRes] = await Promise.all([
        getUsuarios(),
        getRegistros(),
        getRegistrosEliminados()
      ]);

      // -------- USUARIOS
      const usuariosData = usuariosRes.data?.data || usuariosRes.data || [];
      const employeesList: Employee[] = usuariosData.map((u: any) => {
        const name = u.empleado
          ? `${u.empleado.nombre} ${u.empleado.apellido}`
          : u.username;

        const email = u.email || `${u.username || "user"}@example.com`;

        return {
          id: u.id,
          name,
          email,
          role: u.rol || "collaborator",
          department: u.empleado?.departamento?.nombre,
          employmentType: u.empleado?.puesto,
          scheduledStartTime: u.empleado?.hora_entrada?.slice(0, 5),
          scheduledEndTime: u.empleado?.hora_salida?.slice(0, 5),
          empleado: u.empleado,
        };
      });

      // -------- REGISTROS ACTIVOS
      const registros = (registrosRes.data?.data || registrosRes.data || []).map(
        normalizeRegistro
      );

      // Activos = entrada sin salida (si tu modelo los maneja así)
      const active = registros.filter((r: NormalizedRegistro) => r.entrada && !r.salida);

      // -------- REGISTROS ELIMINADOS
      const eliminados = eliminadosRes.data?.data || eliminadosRes.data || [];

      // -------- SUMMARY por empleado (semana/mes)
      const mapEmp = new Map<string | number, SummaryItem>();

      for (const r of registros) {
        const empKey = r.empleadoId || r.nombre;
        if (!empKey) continue;

        if (!mapEmp.has(empKey)) {
          const initials = (r.nombre || "EM")
            .split(" ")
            .map((s: string) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          mapEmp.set(empKey, {
            id: empKey,
            initials,
            name: r.nombre || `Empleado ${empKey}`,
            contract: "Part-time", // placeholder si no tienes contrato
            rank: 0,
            weekHours: 0,
            weekTarget: 24,
            monthHours: 0,
            monthTarget: 96,
            weekGoalOk: false,
          });
        }

        const item = mapEmp.get(empKey)!;
        const h = horasEntre(r.entrada, r.salida);

        if (isThisWeek(r.entrada)) item.weekHours += h;
        if (isThisMonth(r.entrada)) item.monthHours += h;
      }

      const summaryArr: SummaryItem[] = Array.from(mapEmp.values())
        .map((x: SummaryItem) => ({
          ...x,
          weekHours: +x.weekHours.toFixed(1),
          monthHours: +x.monthHours.toFixed(1),
          weekGoalOk: x.weekHours >= x.weekTarget,
        }))
        .sort((a: SummaryItem, b: SummaryItem) => b.weekHours - a.weekHours)
        .map((x: SummaryItem, i: number) => ({ ...x, rank: i + 1 }));

      // -------- STATS
      const statsComputed: Stats = {
        employees: employeesList.length,
        activeLogs: active.length,
        deletedLogs: eliminados.length,
      };

      // -------- TABLAS
      const activeLogsRows = active.map((r: NormalizedRegistro) => ({
        id: r.raw?.id || `${r.empleadoId}-${r.entrada?.toISOString?.()}`,
        name: r.nombre,
        date: r.entrada?.toLocaleString?.() || "",
        status: "in",
      }));

      setEmployees(employeesList);
      setSummary(summaryArr);
      setActiveLogs(activeLogsRows);
      setDeletedLogs([]);
      setActiveRecords(registrosRes.data?.data || registrosRes.data || []);
      setDeletedRecords(eliminados);
      setStats(statsComputed);
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar los datos del panel");
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Verificar autenticación y rol
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    
    if (role !== "admin" && role !== "supervisor") {
      router.replace('/dashboard/colaborador');
      return;
    }
    
    let mounted = true;

    (async () => {
      setLoading(true);
      await loadDashboardData();
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, role, router]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminTopbar
        title="Panel de Supervisor"
        subtitle={user?.username || user?.email || "admin"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <StatsHeader loading={loading} stats={stats} />

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "resumen", label: "Resumen de Horas" },
            { key: "empleados", label: "Empleados" },
            { key: "activos", label: "Registros Activos" },
            { key: "eliminados", label: "Eliminados" },
          ]}
        />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {activeTab === "resumen" && <HoursSummary loading={loading} items={summary} />}
          {activeTab === "empleados" && (
            <EmployeeManagement 
              users={employees.map((emp) => ({
                id: emp.id.toString(),
                username: emp.email.split('@')[0] || `user${emp.id}`,
                name: emp.name,
                role: (emp.role === 'admin' ? 'supervisor' : 'employee') as 'employee' | 'supervisor',
                department: emp.department,
                employmentType: emp.employmentType,
                scheduledStartTime: emp.scheduledStartTime,
                scheduledEndTime: emp.scheduledEndTime
              }))}
              onAddUser={async (user) => {
                try {
                  // El backend crea el empleado Y el usuario en una transacción
                  const empleadoData = {
                    nombre: user.name.split(' ')[0] || user.name,
                    apellido: user.name.split(' ').slice(1).join(' ') || '',
                    puesto: user.employmentType || 'Empleado',
                    fecha_contratacion: new Date().toISOString().split('T')[0],
                    estado: 'activo',
                    departamento_id: 1, // Ajustar según el departamento seleccionado
                    hora_entrada: user.scheduledStartTime || '09:00:00',
                    hora_salida: user.scheduledEndTime || '17:00:00',
                    username: user.username,
                    password: user.password || 'cambiarme123'
                  };
                  
                  const response = await createEmpleado(empleadoData);
                  
                  if (response.data) {
                    toast.success('Empleado creado exitosamente');
                    await loadDashboardData();
                  }
                } catch (error: any) {
                  console.error('Error al crear empleado:', error);
                  toast.error(error.response?.data?.message || 'Error al crear empleado');
                }
              }}
              onUpdateUser={async (userId, userData) => {
                try {
                  // Buscar el empleado_id del usuario
                  const usuario = employees.find((emp: any) => emp.id?.toString() === userId);
                  
                  if (!usuario) {
                    toast.error('Usuario no encontrado');
                    return;
                  }
                  
                  // Actualizar datos del empleado
                  const updateData: any = {};
                  
                  if (userData.name) {
                    updateData.nombre = userData.name.split(' ')[0] || userData.name;
                    updateData.apellido = userData.name.split(' ').slice(1).join(' ') || '';
                  }
                  if (userData.employmentType) updateData.puesto = userData.employmentType;
                  if (userData.scheduledStartTime) updateData.hora_entrada = userData.scheduledStartTime + ':00';
                  if (userData.scheduledEndTime) updateData.hora_salida = userData.scheduledEndTime + ':00';
                  
                  await updateEmpleado(usuario.id, updateData);
                  toast.success('Empleado actualizado exitosamente');
                  await loadDashboardData();
                } catch (error: any) {
                  console.error('Error al actualizar empleado:', error);
                  toast.error(error.response?.data?.message || 'Error al actualizar empleado');
                }
              }}
              onDeleteUser={async (userId) => {
                try {
                  const usuario = employees.find((emp: any) => emp.id?.toString() === userId);
                  
                  if (!usuario) {
                    toast.error('Usuario no encontrado');
                    return;
                  }
                  
                  // Eliminar del backend (soft delete: estado -> inactivo)
                  await deleteEmpleado(usuario.id);
                  
                  // Recargar datos para reflejar el cambio
                  await loadDashboardData();
                  
                  toast.success('Empleado eliminado exitosamente');
                } catch (error: any) {
                  console.error('Error al eliminar empleado:', error);
                  toast.error(error.response?.data?.message || 'Error al eliminar empleado');
                }
              }}
            />
          )}
          {activeTab === "activos" && (
            <ActiveRecordsView 
              loading={loading} 
              records={activeRecords} 
              onRefresh={loadDashboardData}
            />
          )}
          {activeTab === "eliminados" && (
            <DeletedRecordsView 
              loading={loading} 
              records={deletedRecords} 
              onRefresh={loadDashboardData}
            />
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}

