import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardStats {
  grantedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  underReviewClaims: number;
}

interface FraClaimsChartProps {
  stats?: DashboardStats;
}

export default function FraClaimsChart({ stats }: FraClaimsChartProps) {
  if (!stats) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  const data = [
    { name: 'Granted', value: stats.grantedClaims, color: 'hsl(100, 45%, 25%)' },
    { name: 'Pending', value: stats.pendingClaims, color: 'hsl(45, 85%, 45%)' },
    { name: 'Under Review', value: stats.underReviewClaims, color: 'hsl(100, 20%, 60%)' },
    { name: 'Rejected', value: stats.rejectedClaims, color: 'hsl(0, 85%, 60%)' },
  ];

  return (
    <div className="h-64" data-testid="fra-claims-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
