// ProgressChart component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '12px 16px', fontSize: '13px'
      }}>
        <p style={{ color: 'var(--text2)', marginBottom: '8px' }}>{label}</p>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, marginBottom: '4px' }}>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
        <p>Complete at least one assessment to see your progress chart.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c6ff7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f0a06b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f0a06b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="anxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6bd4f0" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6bd4f0" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: '#5a6188', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#5a6188', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text2)' }} />
        <Area type="monotone" dataKey="mood" name="Mood" stroke="#7c6ff7" fill="url(#moodGrad)" strokeWidth={2} dot={{ r: 4, fill: '#7c6ff7' }} />
        <Area type="monotone" dataKey="stress" name="Stress" stroke="#f0a06b" fill="url(#stressGrad)" strokeWidth={2} dot={{ r: 4, fill: '#f0a06b' }} />
        <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke="#6bd4f0" fill="url(#anxGrad)" strokeWidth={2} dot={{ r: 4, fill: '#6bd4f0' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}