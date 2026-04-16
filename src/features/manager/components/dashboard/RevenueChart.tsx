import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const data = [
  { name: 'Jan', revenue: 45000, orders: 120 },
  { name: 'Feb', revenue: 52000, orders: 145 },
  { name: 'Mar', revenue: 48000, orders: 132 },
  { name: 'Apr', revenue: 61000, orders: 168 },
  { name: 'May', revenue: 55000, orders: 155 },
  { name: 'Jun', revenue: 67000, orders: 189 },
  { name: 'Jul', revenue: 72000, orders: 201 },
  { name: 'Aug', revenue: 69000, orders: 195 },
  { name: 'Sep', revenue: 78000, orders: 218 },
  { name: 'Oct', revenue: 82000, orders: 234 },
  { name: 'Nov', revenue: 91000, orders: 258 },
  { name: 'Dec', revenue: 98000, orders: 276 },
];

export function RevenueChart() {
  const formatter: TooltipProps<ValueType, NameType>['formatter'] = (value, name) => {
    if (typeof value !== 'number') return ['—', name];

    return [
      name === 'revenue' ? `$${value.toLocaleString()}` : value,
      name === 'revenue' ? 'Revenue' : 'Orders',
    ];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold tracking-tight">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue for 2024</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-foreground" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Orders</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 0%, 12%)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(0, 0%, 12%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(0, 0%, 90%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={formatter}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(0, 0%, 12%)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="hsl(0, 0%, 55%)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
