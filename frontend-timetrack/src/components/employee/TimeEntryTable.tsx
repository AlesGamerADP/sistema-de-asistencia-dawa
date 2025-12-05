import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Trash2, AlertCircle } from 'lucide-react';

// Tipos locales
interface TimeEntry {
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

interface TimeEntryTableProps {
  entries: TimeEntry[];
  showUserColumn?: boolean;
  showActions?: boolean;
  onDelete?: (entry: TimeEntry) => void;
}

export function TimeEntryTable({ entries, showUserColumn = false, showActions = false, onDelete }: TimeEntryTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay registros para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showUserColumn && <TableHead>Empleado</TableHead>}
            <TableHead>Fecha</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Total Horas</TableHead>
            <TableHead>Estado</TableHead>
            {showActions && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow 
              key={entry.id} 
              className={
                entry.hasIncident ? 'bg-orange-50' : 
                entry.isLate || entry.isEarlyExit ? 'bg-yellow-50' : 
                ''
              }
            >
              {showUserColumn && <TableCell>{entry.userName}</TableCell>}
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell>{entry.startTime}</TableCell>
              <TableCell>{entry.endTime || '--:--'}</TableCell>
              <TableCell>{entry.totalHours} hrs</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {entry.deleted ? (
                    <Badge variant="destructive" className="cursor-help" title={`Motivo: ${entry.deletedReason || 'N/A'}\nEliminado por: ${entry.deletedBy || 'N/A'}\nFecha: ${entry.deletedAt ? new Date(entry.deletedAt).toLocaleString('es-ES') : '-'}`}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Eliminado
                    </Badge>
                  ) : (
                    <>
                      {/* Estado principal */}
                      {entry.hasIncident ? (
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 cursor-help" title={`Motivo: ${entry.incidentReason || 'N/A'}`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Incurrencia
                        </Badge>
                      ) : !entry.endTime ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          En curso
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Completo
                        </Badge>
                      )}

                      {/* Llegada tardía */}
                      {entry.isLate && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 cursor-help" title={`Justificación: ${entry.lateReason || 'N/A'}`}>
                          ⏰ Tardía
                        </Badge>
                      )}

                      {/* Salida temprana */}
                      {entry.isEarlyExit && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 cursor-help" title={`Justificación: ${entry.earlyExitReason || 'N/A'}`}>
                          ⏰ Temprana
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  {!entry.deleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(entry)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

