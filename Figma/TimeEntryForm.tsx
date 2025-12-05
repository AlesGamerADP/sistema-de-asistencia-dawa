import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface TimeEntryFormProps {
  onSubmit: (entry: {
    date: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    description: string;
  }) => void;
  onCancel: () => void;
}

export function TimeEntryForm({ onSubmit, onCancel }: TimeEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return (endMinutes - startMinutes) / 60;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalHours = calculateHours(startTime, endTime);

    if (totalHours <= 0) {
      toast.error('Error', {
        description: 'La hora de fin debe ser posterior a la hora de inicio'
      });
      return;
    }

    if (totalHours > 24) {
      toast.error('Error', {
        description: 'El total de horas no puede exceder 24 horas'
      });
      return;
    }

    onSubmit({
      date,
      startTime,
      endTime,
      totalHours: Math.round(totalHours * 100) / 100,
      description
    });

    toast.success('Registro agregado exitosamente');
  };

  const totalHours = calculateHours(startTime, endTime);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Horas</CardTitle>
        <CardDescription>Completa el formulario para registrar tus horas trabajadas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total de Horas</Label>
              <div className="flex items-center h-10 px-3 bg-gray-50 rounded-md border">
                <span>{totalHours > 0 ? `${totalHours.toFixed(2)} horas` : '- -'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las actividades realizadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Guardar Registro
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
