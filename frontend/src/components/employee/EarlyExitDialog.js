// src/components/employee/EarlyExitDialog.js
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export function EarlyExitDialog({ isOpen, onClose, scheduledTime, actualTime, minutesEarly, onConfirm }) {
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
          <DialogTitle className="flex items-center gap-2 text-purple-600">
            <Clock className="h-5 w-5" />
            Salida Temprana
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-purple-700 dark:text-purple-300 font-medium">Hora Esperada</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{scheduledTime}</p>
                </div>
                <div>
                  <p className="text-purple-700 dark:text-purple-300 font-medium">Hora de Salida</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{actualTime}</p>
                </div>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Sales <strong>{minutesEarly} minutos antes</strong> de tu hora programada. Por favor, proporciona una justificación.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación *</Label>
              <textarea
                id="justificacion"
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Ejemplo: Cita médica urgente..."
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
            className="bg-purple-600 hover:bg-purple-700"
          >
            Registrar con Justificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
