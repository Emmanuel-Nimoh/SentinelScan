import { PieChart, Pie, Cell } from 'recharts';

export default function ComplianceChart({ percentage = 0 }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const data = [
    { name: 'Compliant', value: clamped },
    { name: 'Remaining', value: 100 - clamped },
  ];
  // eslint-disable-next-line no-nested-ternary
  const color = clamped >= 80 ? '#16a34a' : clamped >= 50 ? '#eab308' : '#dc2626';

  return (
    <div className="relative w-40 h-40 shrink-0">
      <PieChart width={160} height={160}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          innerRadius={60}
          outerRadius={75}
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="#e2e8f0" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-900">{Math.round(clamped)}%</span>
        <span className="text-xs text-slate-500">Compliant</span>
      </div>
    </div>
  );
}
