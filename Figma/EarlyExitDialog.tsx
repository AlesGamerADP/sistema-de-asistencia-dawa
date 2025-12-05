import { useState } from 'react';
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
import { Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EarlyExitDialogProps {
  open: boolean;
  scheduledTime: string;
  actualTime: string;
  minutesEarly: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function EarlyExitDialog({ 
  open, 
  scheduledTime, 
  actualTime, 
  minutesEarly,
  onConfirm, 
  onCancel 
}: EarlyExitDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Error', {
        description: 'Debes explicar el motivo de tu salida temprana'
      });
      return;
    }

    onConfirm(reason);
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600">
            <Clock className="h-5 w-5" />
            Salida Temprana Detectada
          </DialogTitle>
          <DialogDescription>
            Estás saliendo {minutesEarly} minutos antes de tu horario asignado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-purple-700 font-medium">Hora Asignada:</p>
                <p className="text-purple-600">{scheduledTime}</p>
              </div>
              <div>
                <p className="text-purple-700 font-medium">Hora de Salida:</p>
                <p className="text-purple-600">{actualTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Esta justificación será visible para tu supervisor. Por favor, explica el motivo de tu salida temprana.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="early-exit-reason">Justificación de Salida Temprana *</Label>
            <Textarea
              id="early-exit-reason"
              placeholder="Ejemplo: Cita médica urgente..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700">
            Confirmar Salida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}