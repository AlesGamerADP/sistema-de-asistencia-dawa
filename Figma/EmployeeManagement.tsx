import { useState, useMemo } from 'react';
import { User } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { UserPlus, Edit2, Trash2, Search, Briefcase, Clock } from 'lucide-react';

interface EmployeeManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, user: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
}

const departments = ['Contabilidad', 'TI', 'Técnicos', 'Ingenieros'] as const;
const employmentTypes = ['Full-time', 'Part-time'] as const;

export function EmployeeManagement({ users, onAddUser, onUpdateUser, onDeleteUser }: EmployeeManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [employmentFilter, setEmploymentFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'employee' as 'employee' | 'supervisor',
    department: '' as typeof departments[number] | '',
    employmentType: '' as typeof employmentTypes[number] | '',
    scheduledStartTime: '09:00',
    scheduledEndTime: '17:00'
  });

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      role: 'employee',
      department: '',
      employmentType: '',
      scheduledStartTime: '09:00',
      scheduledEndTime: '17:00'
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department || '',
      employmentType: user.employmentType || '',
      scheduledStartTime: user.scheduledStartTime || '09:00',
      scheduledEndTime: user.scheduledEndTime || '17:00'
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${userName}?`)) {
      onDeleteUser(userId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.name || !formData.department || !formData.employmentType) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (editingUser) {
      onUpdateUser(editingUser.id, {
        name: formData.name,
        department: formData.department as typeof departments[number],
        employmentType: formData.employmentType as typeof employmentTypes[number],
        scheduledStartTime: formData.scheduledStartTime,
        scheduledEndTime: formData.scheduledEndTime
      });
      setEditingUser(null);
    } else {
      onAddUser({
        username: formData.username,
        name: formData.name,
        role: formData.role,
        department: formData.department as typeof departments[number],
        employmentType: formData.employmentType as typeof employmentTypes[number],
        scheduledStartTime: formData.scheduledStartTime,
        scheduledEndTime: formData.scheduledEndTime
      });
      setShowAddDialog(false);
    }
    
    resetForm();
  };

  const employees = users.filter(u => u.role === 'employee');

  const filteredEmployees = useMemo(() => {
    return employees.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      const matchesEmployment = employmentFilter === 'all' || user.employmentType === employmentFilter;
      
      return matchesSearch && matchesDepartment && matchesEmployment;
    });
  }, [employees, searchTerm, departmentFilter, employmentFilter]);

  const getDepartmentColor = (department?: string) => {
    switch (department) {
      case 'Contabilidad': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'TI': return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'Técnicos': return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'Ingenieros': return 'border-green-200 bg-green-50 text-green-700';
      default: return '';
    }
  };

  const EmployeeForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de Usuario *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="jperez"
            disabled={!!editingUser}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Juan Pérez"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Área *</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value as typeof departments[number] })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar área" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">Tipo de Empleo *</Label>
          <Select value={formData.employmentType} onValueChange={(value) => setFormData({ ...formData, employmentType: value as typeof employmentTypes[number] })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {employmentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de Entrada</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.scheduledStartTime}
            onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de Salida</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.scheduledEndTime}
            onChange={(e) => setFormData({ ...formData, scheduledEndTime: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => {
          setShowAddDialog(false);
          setEditingUser(null);
          resetForm();
        }}>
          Cancelar
        </Button>
        <Button type="submit">
          {editingUser ? 'Actualizar' : 'Registrar'} Empleado
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Empleados</CardTitle>
              <CardDescription>Administra los trabajadores de la empresa</CardDescription>
            </div>
            <Button onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Dialog for adding employee */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Empleado</DialogTitle>
                <DialogDescription>
                  Complete los datos del nuevo trabajador
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm />
            </DialogContent>
          </Dialog>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nombre o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Área</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtrar por Tipo</Label>
              <Select value={employmentFilter} onValueChange={setEmploymentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {employmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de empleados */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron empleados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDepartmentColor(user.department)}>
                          <Briefcase className="h-3 w-3 mr-1" />
                          {user.department || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.employmentType === 'Full-time' ? 'default' : 'secondary'}>
                          <Clock className="h-3 w-3 mr-1" />
                          {user.employmentType || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.scheduledStartTime} - {user.scheduledEndTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id, user.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumen */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Mostrando {filteredEmployees.length} de {employees.length} empleados
            </div>
            <div className="flex gap-4">
              <span>Full-time: {employees.filter(e => e.employmentType === 'Full-time').length}</span>
              <span>Part-time: {employees.filter(e => e.employmentType === 'Part-time').length}</span>
            </div>
          </div>

          {/* Dialog for editing employee */}
          <Dialog open={!!editingUser} onOpenChange={(open) => {
            if (!open) {
              setEditingUser(null);
              resetForm();
            }
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Empleado</DialogTitle>
                <DialogDescription>
                  Modifica los datos del trabajador
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
