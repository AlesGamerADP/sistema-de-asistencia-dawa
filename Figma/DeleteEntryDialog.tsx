import { useState, useEffect } from 'react';
import { TimeEntry } from '../App';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DeleteEntryDialogProps {
  entry: TimeEntry | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function DeleteEntryDialog({ entry, onConfirm, onCancel }: DeleteEntryDialogProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!entry) {
      setReason('');
    }
  }, [entry]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Error', {
        description: 'Debes proporcionar una observación para eliminar el registro'
      });
      return;
    }

    onConfirm(reason);
    setReason('');
    toast.success('Registro eliminado exitosamente');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Eliminar Registro
          </DialogTitle>
          <DialogDescription>
            Esta acción marcará el registro como eliminado. Debes proporcionar una observación.
          </DialogDescription>
        </DialogHeader>

        {entry && (
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">Empleado:</p>
                  <p>{entry.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha:</p>
                  <p>{formatDate(entry.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horario:</p>
                  <p>{entry.startTime} - {entry.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total:</p>
                  <p>{entry.totalHours} horas</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Observación *</Label>
              <Textarea
                id="reason"
                placeholder="Explica el motivo de la eliminación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Esta observación será visible en el historial de registros eliminados
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirmar Eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
