// src/components/admin/EmployeesManagement.js
import React, { useState, useEffect, useMemo } from "react";
import { UserPlus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getUsuarios,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getDepartamentos,
} from "../../api/admin";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  ConfirmDialog,
} from "../ui/dialog";
import { toast } from "sonner";

/** Normaliza un usuario del backend a “fila de empleado” para la tabla */
function mapUsuarioToEmpleado(u) {
  const e = u?.empleado || {};
  return {
    id: e.id ?? u.id,
    nombre: e.nombre ?? u.username,
    apellido: e.apellido ?? "",
    puesto: e.puesto ?? "",
    departamento_id: e.departamento_id ?? null,
    departamento: e.departamento || null,
    tipo_empleo: e.tipo_empleo ?? "Full-time",
    hora_entrada: e.hora_entrada ?? "09:00",
    hora_salida: e.hora_salida ?? "18:00",
    estado: e.estado ?? "activo",
    usuario: { username: u.username, rol: u.rol },
  };
}

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal crear/editar
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // confirm eliminar
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, user: null });

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // departamentos
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // form
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    puesto: "",
    departamento_id: "",
    tipo_empleo: "Full-time",
    hora_entrada: "09:00",
    hora_salida: "18:00",
    username: "",
    password: "",
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      puesto: "",
      departamento_id: "",
      tipo_empleo: "Full-time",
      hora_entrada: "09:00",
      hora_salida: "18:00",
      username: "",
      password: "",
    });
  };

  // cargar departamentos
  const loadDepartments = async (emps = []) => {
    try {
      setLoadingDepartments(true);
      const res = await getDepartamentos();
      const data = res?.data?.data || res?.data || [];
      if (Array.isArray(data) && data.length) {
        setDepartments(
          data.map((d) => ({
            id: d.id,
            nombre: d.nombre || String(d.id),
          }))
        );
      } else {
        // derivar por si no existe endpoint
        const derived = Array.from(
          new Set(emps.map((e) => e?.departamento?.nombre).filter(Boolean))
        ).map((name, idx) => ({ id: name || idx + 1, nombre: name || `Dept ${idx + 1}` }));
        setDepartments(derived);
      }
    } catch {
      const derived = Array.from(
        new Set(emps.map((e) => e?.departamento?.nombre).filter(Boolean))
      ).map((name, idx) => ({ id: name || idx + 1, nombre: name || `Dept ${idx + 1}` }));
      setDepartments(derived);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // cargar usuarios -> normalizar a empleados
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await getUsuarios();
      const raw = res?.data?.data || res?.data || [];
      const normalized = (Array.isArray(raw) ? raw : []).map(mapUsuarioToEmpleado);
      setEmployees(normalized);
      loadDepartments(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar empleados");
      setEmployees([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // filtros + búsqueda
  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return employees.filter((emp) => {
      const textPool = [emp.nombre, emp.apellido, emp.puesto, emp.usuario?.username]
        .filter(Boolean)
        .map((t) => String(t).toLowerCase());
      const matchSearch = !term || textPool.some((t) => t.includes(term));
      const matchDept =
        selectedDepartment === "todos" ||
        String(emp.departamento_id ?? emp.departamento?.nombre ?? "") ===
          String(selectedDepartment);
      const matchStatus =
        selectedStatus === "todos" ||
        String(emp.estado || "").toLowerCase() === selectedStatus.toLowerCase();
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  // paginación
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // crear / editar
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido) {
      toast.error("Nombre y apellido son obligatorios");
      return;
    }

    try {
      if (editingUser) {
        // EDITAR
        const payload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          puesto: formData.puesto || null,
          departamento_id: formData.departamento_id
            ? parseInt(formData.departamento_id, 10)
            : null,
          tipo_empleo: formData.tipo_empleo || "Full-time",
          hora_entrada: formData.hora_entrada || "09:00",
          hora_salida: formData.hora_salida || "18:00",
          ...(formData.username && formData.username.trim()
            ? { username: formData.username.trim() }
            : {}),
          ...(formData.password && formData.password.trim()
            ? { password: formData.password.trim() }
            : {}),
        };

        await updateEmpleado(editingUser.id, payload);
        toast.success("Empleado actualizado exitosamente");
      } else {
        // CREAR (tu backend crea empleado + usuario aquí)
        if (!formData.username?.trim() || !formData.password?.trim()) {
          toast.error("Usuario y contraseña son requeridos");
          return;
        }

        const empPayload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          puesto: formData.puesto || null,
          departamento_id: formData.departamento_id
            ? parseInt(formData.departamento_id, 10)
            : null,
          tipo_empleo: formData.tipo_empleo || "Full-time",
          hora_entrada: formData.hora_entrada || "09:00",
          hora_salida: formData.hora_salida || "18:00",
          username: formData.username.trim(),
          password: formData.password.trim(),
        };

        await createEmpleado(empPayload);
        toast.success("Empleado creado exitosamente");
      }

      // cerrar y refrescar
      setShowAddDialog(false);
      setEditingUser(null);
      resetForm();
      await loadEmployees();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error al guardar empleado";
      toast.error(msg);
      console.error("Guardar empleado error:", error?.response?.data || error);
    }
  };

  const handleEdit = (row) => {
    setEditingUser(row);
    setFormData({
      nombre: row.nombre || "",
      apellido: row.apellido || "",
      puesto: row.puesto || "",
      departamento_id: row.departamento_id || "",
      tipo_empleo: row.tipo_empleo || "Full-time",
      hora_entrada: row.hora_entrada || "09:00",
      hora_salida: row.hora_salida || "18:00",
      username: row.usuario?.username || "",
      password: "",
    });
    setShowAddDialog(true);
  };

  const handleDelete = (row) => setDeleteConfirm({ open: true, user: row });

  const confirmDelete = async () => {
    const { user } = deleteConfirm;
    if (!user) return;
    try {
      await deleteEmpleado(user.id);
      toast.success(`${user.nombre} ${user.apellido} eliminado`);
      loadEmployees();
    } catch (e) {
      console.error(e);
      toast.error("Error al eliminar empleado");
    }
  };

  const getDepartmentColor = (deptIdOrName) => {
    const dept =
      departments.find((d) => String(d.id) === String(deptIdOrName)) ||
      departments.find((d) => d.nombre === deptIdOrName);
    const colors = {
      Administración: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Recursos Humanos": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      Tecnología: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      Ventas: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      Marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      Operaciones: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      Finanzas: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      Legal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    };
    return colors[dept?.nombre] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  if (loading) {
    return <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">Cargando empleados…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Gestión de Empleados</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Administra los trabajadores de la empresa
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingUser(null);
              setShowAddDialog(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar empleado…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectContent>
              <SelectItem value="todos">Todos los departamentos</SelectItem>
              {departments.map((d) => (
                <SelectItem key={`${d.id}-${d.nombre}`} value={String(d.id)}>
                  {d.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Empleado</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Horario</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No se encontraron empleados
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((u) => {
                  const deptName =
                    departments.find((d) => String(d.id) === String(u.departamento_id))?.nombre ||
                    u?.departamento?.nombre ||
                    "Sin departamento";
                  const rowKey = `${u.id}-${u.usuario?.username ?? ""}`;

                  return (
                    <tr key={rowKey} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                            {(u.nombre || "E")[0]?.toUpperCase()}
                            {(u.apellido || "")[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{u.nombre} {u.apellido}</div>
                            <div className="text-xs text-gray-500">@{u.usuario?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.puesto || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(u.departamento_id ?? deptName)}`}>
                          {deptName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.tipo_empleo}</td>
                      <td className="px-6 py-4 text-sm">{u.hora_entrada} - {u.hora_salida}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (u.estado || "activo") === "activo"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {u.estado || "activo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(u)}>
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(u)}
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredEmployees.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm">
              Mostrando <span className="font-semibold">{startIndex + 1}</span> a{" "}
              <span className="font-semibold">{Math.min(endIndex, filteredEmployees.length)}</span> de{" "}
              <span className="font-semibold">{filteredEmployees.length}</span> empleados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={`page-${p}`}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      currentPage === p
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-6">
              {/* Información personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Apellido *</Label>
                  <Input
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Laboral */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Puesto</Label>
                  <Input
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Departamento</Label>
                  <Select
                    value={formData.departamento_id?.toString() || ""}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        departamento_id: val ? parseInt(val, 10) : null,
                      })
                    }
                  >
                    <SelectContent>
                      <SelectItem value="">Sin departamento</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={`${d.id}-${d.nombre}`} value={String(d.id)}>
                          {d.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Tipo de Empleo</Label>
                  <Select
                    value={formData.tipo_empleo}
                    onValueChange={(val) => setFormData({ ...formData, tipo_empleo: val })}
                  >
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Hora de Entrada</Label>
                  <Input
                    type="time"
                    value={formData.hora_entrada}
                    onChange={(e) => setFormData({ ...formData, hora_entrada: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Hora de Salida</Label>
                  <Input
                    type="time"
                    value={formData.hora_salida}
                    onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
                  />
                </div>
              </div>

              {/* Credenciales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label>Usuario {editingUser ? "" : "*"}</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required={!editingUser}
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <Label>Contraseña {editingUser ? "(opcional)" : "*"}</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingUser(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                {editingUser ? "Actualizar" : "Crear Empleado"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmación eliminar */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, user: null })}
        title="¿Eliminar empleado?"
        description={
          deleteConfirm.user
            ? `Se eliminará a ${deleteConfirm.user.nombre} ${deleteConfirm.user.apellido}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </div>
  );
}
