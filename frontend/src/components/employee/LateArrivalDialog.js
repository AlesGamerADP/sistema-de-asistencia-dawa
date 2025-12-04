// src/components/employee/LateArrivalDialog.js
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export function LateArrivalDialog({ isOpen, onClose, scheduledTime, actualTime, minutesLate, onConfirm }) {
  const [justificacion, setJustificacion] = useState('');

  const handleConfirm = () => {
    if (!justificacion.trim()) {
      return;
    }
    onConfirm(justificacion);
    setJustificacion('');
    onClose();
  };

  const handleCancel = () => {
    setJustificacion('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-5 w-5" />
            Llegada Tarde
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-yellow-700 dark:text-yellow-300 font-medium">Hora Esperada</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{scheduledTime}</p>
                </div>
                <div>
                  <p className="text-yellow-700 dark:text-yellow-300 font-medium">Hora de Llegada</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{actualTime}</p>
                </div>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Llegas <strong>{minutesLate} minutos tarde</strong>. Por favor, proporciona una justificación.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación *</Label>
              <textarea
                id="justificacion"
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Ejemplo: Tráfico pesado en la carretera principal..."
                required
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!justificacion.trim()}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Registrar con Justificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
