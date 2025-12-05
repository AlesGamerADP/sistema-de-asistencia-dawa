import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { SupervisorDashboard } from './components/SupervisorDashboard';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'employee' | 'supervisor';
  department?: 'Contabilidad' | 'TI' | 'Técnicos' | 'Ingenieros';
  employmentType?: 'Full-time' | 'Part-time';
  scheduledStartTime?: string; // Hora de inicio asignada (formato HH:MM)
  scheduledEndTime?: string;   // Hora de fin asignada (formato HH:MM)
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime?: string;
  totalHours: number;
  description: string;
  hasIncident: boolean;
  incidentReason?: string;
  isLate: boolean;
  lateReason?: string;
  isEarlyExit: boolean;
  earlyExitReason?: string;
  deleted: boolean;
  deletedReason?: string;
  deletedBy?: string;
  deletedAt?: string;
}

// Datos iniciales de usuarios (solo para login inicial)
const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'jperez',
    name: 'Juan Pérez',
    role: 'employee',
    department: 'TI',
    employmentType: 'Full-time',
    scheduledStartTime: '09:00',
    scheduledEndTime: '17:00'
  },
  {
    id: '2',
    username: 'mgarcia',
    name: 'María García',
    role: 'employee',
    department: 'Contabilidad',
    employmentType: 'Full-time',
    scheduledStartTime: '08:30',
    scheduledEndTime: '16:30'
  },
  {
    id: '3',
    username: 'supervisor',
    name: 'Carlos Rodríguez',
    role: 'supervisor'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Suprimir errores de MetaMask y otros proveedores de wallet
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('MetaMask') ||
        event.message.includes('ethereum') ||
        event.message.includes('wallet')
      )) {
        event.preventDefault();
        console.log('Error de wallet suprimido (no afecta la aplicación)');
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && (
        event.reason.message.includes('MetaMask') ||
        event.reason.message.includes('ethereum') ||
        event.reason.message.includes('wallet')
      )) {
        event.preventDefault();
        console.log('Rechazo de promesa de wallet suprimido (no afecta la aplicación)');
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    // Cargar usuarios
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries));
    } else {
      // Datos de ejemplo iniciales - más registros para mostrar mejor el resumen
      const today = new Date();
      const getDateString = (daysAgo: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
      };

      const initialEntries: TimeEntry[] = [
        // Juan Pérez - Esta semana
        {
          id: '1',
          userId: '1',
          userName: 'Juan Pérez',
          date: getDateString(0), // Hoy
          startTime: '09:00',
          endTime: '17:00',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '2',
          userId: '1',
          userName: 'Juan Pérez',
          date: getDateString(1), // Ayer
          startTime: '09:15',
          endTime: '18:00',
          totalHours: 8.75,
          description: '',
          hasIncident: false,
          isLate: true,
          lateReason: 'Tráfico en la autopista',
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '3',
          userId: '1',
          userName: 'Juan Pérez',
          date: getDateString(2),
          startTime: '09:00',
          endTime: '17:00',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '4',
          userId: '1',
          userName: 'Juan Pérez',
          date: getDateString(3),
          startTime: '09:00',
          endTime: '16:30',
          totalHours: 7.5,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: true,
          earlyExitReason: 'Cita médica',
          deleted: false
        },
        // María García - Esta semana
        {
          id: '5',
          userId: '2',
          userName: 'María García',
          date: getDateString(0), // Hoy
          startTime: '08:30',
          endTime: '16:30',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '6',
          userId: '2',
          userName: 'María García',
          date: getDateString(1), // Ayer
          startTime: '08:30',
          endTime: '16:30',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '7',
          userId: '2',
          userName: 'María García',
          date: getDateString(2),
          startTime: '08:30',
          endTime: '17:00',
          totalHours: 8.5,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '8',
          userId: '2',
          userName: 'María García',
          date: getDateString(3),
          startTime: '08:30',
          endTime: '16:30',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        // Registros de semanas anteriores
        {
          id: '9',
          userId: '1',
          userName: 'Juan Pérez',
          date: getDateString(7), // Semana pasada
          startTime: '09:00',
          endTime: '17:00',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        },
        {
          id: '10',
          userId: '2',
          userName: 'María García',
          date: getDateString(7), // Semana pasada
          startTime: '08:30',
          endTime: '16:30',
          totalHours: 8,
          description: '',
          hasIncident: false,
          isLate: false,
          isEarlyExit: false,
          deleted: false
        }
      ];
      setTimeEntries(initialEntries);
      localStorage.setItem('timeEntries', JSON.stringify(initialEntries));
    }
  }, []);

  // Guardar timeEntries en localStorage cuando cambien
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    }
  }, [timeEntries]);

  // Guardar usuarios en localStorage cuando cambien
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const handleLogin = (username: string, password: string): boolean => {
    // Autenticación simulada
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString()
    };
    setUsers([...users, user]);
  };

  const handleUpdateUser = (userId: string, updatedUser: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleClockIn = (lateReason?: string) => {
    if (!currentUser) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Verificar si llega tarde (más de 15 minutos)
    let isLate = false;
    if (currentUser.scheduledStartTime) {
      const [scheduledHour, scheduledMin] = currentUser.scheduledStartTime.split(':').map(Number);
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      
      const scheduledMinutes = scheduledHour * 60 + scheduledMin;
      const currentMinutes = currentHour * 60 + currentMin;
      
      // Más de 15 minutos tarde
      if (currentMinutes > scheduledMinutes + 15) {
        isLate = true;
      }
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      date: today,
      startTime: currentTime,
      endTime: undefined,
      totalHours: 0,
      description: '',
      hasIncident: false,
      isLate,
      lateReason: isLate ? lateReason : undefined,
      isEarlyExit: false,
      deleted: false
    };

    setTimeEntries([...timeEntries, newEntry]);
  };

  const handleClockOut = (incidentReason?: string, earlyExitReason?: string) => {
    if (!currentUser) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // Buscar si hay una entrada para hoy
    const todayEntryIndex = timeEntries.findIndex(
      e => e.userId === currentUser.id && e.date === today && !e.deleted
    );

    if (todayEntryIndex !== -1) {
      // Actualizar la entrada existente
      const updatedEntries = [...timeEntries];
      const entry = updatedEntries[todayEntryIndex];
      
      const [startHour, startMin] = entry.startTime.split(':').map(Number);
      const [endHour, endMin] = currentTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const hours = (endMinutes - startMinutes) / 60;

      // Verificar si sale temprano
      let isEarlyExit = false;
      if (currentUser.scheduledEndTime) {
        const [scheduledEndHour, scheduledEndMin] = currentUser.scheduledEndTime.split(':').map(Number);
        const scheduledEndMinutes = scheduledEndHour * 60 + scheduledEndMin;
        
        // Sale antes de su horario
        if (endMinutes < scheduledEndMinutes) {
          isEarlyExit = true;
        }
      }

      updatedEntries[todayEntryIndex] = {
        ...entry,
        endTime: currentTime,
        totalHours: Math.max(0, Math.round(hours * 100) / 100),
        isEarlyExit,
        earlyExitReason: isEarlyExit ? earlyExitReason : undefined
      };

      setTimeEntries(updatedEntries);
    } else {
      // No hay entrada, crear una con incidente
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        date: today,
        startTime: currentTime,
        endTime: currentTime,
        totalHours: 0,
        description: '',
        hasIncident: true,
        incidentReason: incidentReason || 'Salida sin entrada registrada',
        isLate: false,
        isEarlyExit: false,
        deleted: false
      };

      setTimeEntries([...timeEntries, newEntry]);
    }
  };

  const handleDeleteTimeEntry = (entryId: string, reason: string) => {
    if (!currentUser || currentUser.role !== 'supervisor') return;

    setTimeEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              deleted: true,
              deletedReason: reason,
              deletedBy: currentUser.name,
              deletedAt: new Date().toISOString()
            }
          : entry
      )
    );
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'supervisor') {
    return (
      <SupervisorDashboard
        user={currentUser}
        users={users}
        timeEntries={timeEntries}
        onLogout={handleLogout}
        onDeleteEntry={handleDeleteTimeEntry}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    );
  }

  return (
    <EmployeeDashboard
      user={currentUser}
      timeEntries={timeEntries.filter(e => e.userId === currentUser.id)}
      onLogout={handleLogout}
      onClockIn={handleClockIn}
      onClockOut={handleClockOut}
    />
  );
}