import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Mock development index data
const developmentData = [
  { village: 'Gondia', index: 7.2 },
  { village: 'Arjuni', index: 6.8 },
  { village: 'Tirora', index: 5.9 },
  { village: 'Sadak-Arjuni', index: 6.4 },
  { village: 'Deori', index: 7.5 },
];

export default function DevelopmentChart() {
  return (
    <div className="h-64" data-testid="development-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={developmentData}>
          <XAxis 
            dataKey="village" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={[0, 10]} 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value}/10`, 'Development Index']}
          />
          <Bar 
            dataKey="index" 
            fill="hsl(100, 45%, 25%)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
