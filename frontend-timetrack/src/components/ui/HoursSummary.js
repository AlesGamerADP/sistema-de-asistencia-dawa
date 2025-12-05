// src/components/admin/HoursSummary.jsx
import ProgressBar from "./ProgressBar";
export default function HoursSummary({ loading, items=[] }) {
  if (loading) return <div className="bg-white rounded-xl shadow p-6">Cargando resumen…</div>;
  return (
    <section className="flex flex-col gap-4">
      {items.map(emp=>(
        <div key={emp.id} className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white grid place-items-center font-bold">{emp.initials}</div>
            <div className="flex-1">
              <div className="font-semibold">{emp.name}</div>
              <div className="text-xs text-gray-500">{emp.contract} · #{emp.rank} en horas trabajadas</div>
            </div>
            <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">✓ Meta Semanal</span>
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100">Mensual</span>
          </div>
          <div className="mt-3 text-xs text-gray-600 flex justify-between">
            <span>Esta Semana</span><span>{emp.weekHours} / {emp.weekTarget} hrs</span>
          </div>
          <ProgressBar value={emp.weekHours} total={emp.weekTarget} />
          <div className="mt-3 text-xs text-gray-600 flex justify-between">
            <span>Este Mes</span><span>{emp.monthHours} / {emp.monthTarget} hrs</span>
          </div>
          <ProgressBar value={emp.monthHours} total={emp.monthTarget} />
        </div>
      ))}
    </section>
  );
}