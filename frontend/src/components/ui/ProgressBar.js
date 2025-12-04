// src/components/ui/ProgressBar.jsx
export default function ProgressBar({ value=0, total=100 }) {
  const pct = Math.min(100, Math.round((value/total)*100 || 0));
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full bg-gray-900 dark:bg-indigo-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
