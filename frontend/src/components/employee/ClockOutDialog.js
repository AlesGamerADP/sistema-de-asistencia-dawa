// src/components/employee/ClockOutDialog.js
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export function ClockOutDialog({ isOpen, onClose, onConfirm }) {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    if (!motivo.trim()) {
      return;
    }
    onConfirm(motivo);
    setMotivo('');
    onClose();
  };

  const handleCancel = () => {
    setMotivo('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Salida sin Entrada
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                No has registrado tu entrada hoy. Esto se marcará como una <strong>incidencia</strong>.
                Por favor, explica el motivo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de la Incidencia *</Label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Ejemplo: Olvid é marcar mi entrada al llegar..."
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
            disabled={!motivo.trim()}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Registrar Incidencia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
