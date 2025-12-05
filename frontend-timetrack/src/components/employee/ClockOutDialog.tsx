import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ClockOutDialogProps {
  open: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function ClockOutDialog({ open, onConfirm, onCancel }: ClockOutDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Error', {
        description: 'Debes explicar el motivo de la incurrencia'
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
            <AlertCircle className="h-5 w-5" />
            Incurrencia Detectada
          </DialogTitle>
          <DialogDescription>
            No has marcado entrada hoy. Por favor explica el motivo de marcar solo la salida.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm">
              Esta incurrencia será visible para el supervisor. Asegúrate de explicar claramente la situación.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident-reason">Observación *</Label>
            <Textarea
              id="incident-reason"
              placeholder="Ejemplo: Olvidé marcar entrada al llegar..."
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
            Confirmar Salida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
