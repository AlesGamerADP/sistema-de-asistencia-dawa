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

interface LateArrivalDialogProps {
  open: boolean;
  scheduledTime: string;
  actualTime: string;
  minutesLate: number;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function LateArrivalDialog({ 
  open, 
  scheduledTime, 
  actualTime, 
  minutesLate,
  onConfirm, 
  onCancel 
}: LateArrivalDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Error', {
        description: 'Debes explicar el motivo de tu retraso'
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
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            Llegada Tardía Detectada
          </DialogTitle>
          <DialogDescription>
            Has llegado {minutesLate} minutos tarde de tu horario asignado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-orange-700 font-medium">Hora Asignada:</p>
                <p className="text-orange-600">{scheduledTime}</p>
              </div>
              <div>
                <p className="text-orange-700 font-medium">Hora de Llegada:</p>
                <p className="text-orange-600">{actualTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Esta justificación será visible para tu supervisor. Por favor, explica el motivo de tu retraso.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="late-reason">Justificación del Retraso *</Label>
            <Textarea
              id="late-reason"
              placeholder="Ejemplo: Tráfico intenso en la vía principal..."
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
          <Button onClick={handleConfirm} className="bg-orange-600 hover:bg-orange-700">
            Confirmar Entrada
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}