import { TrendingDown, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
}

export function KPICard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  subtitle,
}: KPICardProps) {
  return (
    <div className="kpi-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          >
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label mt-1">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-2">{subtitle}</div>}
    </div>
  );
}
