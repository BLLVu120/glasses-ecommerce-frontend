import React from 'react';
import { AlertTriangle, FileText, Package } from 'lucide-react';
import type { KPIData } from '@/features/operation-staff/types/types';

interface KPICardProps {
  data: KPIData;
}

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const getVariantStyles = () => {
    switch (data.variant) {
      case 'critical':
        return {
          border: 'border-red-100 dark:border-red-900/30',
          icon: 'text-red-500',
          title: 'text-red-600 dark:text-red-400 font-bold',
          progress: 'bg-red-500',
        };
      case 'success':
        return {
          border: 'border-emerald-100 dark:border-emerald-900/30',
          icon: 'text-emerald-500',
          title: 'text-emerald-600 dark:text-emerald-400 font-bold',
          progress: 'bg-emerald-500',
        };
      default:
        return {
          border: 'border-slate-200 dark:border-slate-700',
          icon: 'text-slate-400',
          title: 'text-slate-500 dark:text-slate-400',
          progress: 'bg-slate-400',
        };
    }
  };

  const getIcon = () => {
    switch (data.icon) {
      case 'warning':
        return <AlertTriangle />;
      case 'inventory':
        return <Package />;
      default:
        return <FileText />;
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-white dark:bg-[#1a262d] p-5 rounded-xl border ${styles.border} shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group`}
    >
      <div
        className={`absolute right-0 top-0 p-4 opacity-40 group-hover:opacity-80 transition-opacity ${styles.icon}`}
      >
        <div className="w-16 h-16">{getIcon()}</div>
      </div>

      <h3 className={`${styles.title} text-sm z-10 flex items-center gap-1`}>
        {data.title}
        {data.variant === 'critical' && (
          <span className="animate-pulse bg-red-100 text-red-600 rounded-full p-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
        )}
      </h3>

      <div className="flex items-end gap-2 z-10">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{data.value}</span>
        <span className="text-xs text-slate-500 mb-1.5 font-medium">{data.unit}</span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
        <div
          className={`${styles.progress} h-full rounded-full`}
          style={{ width: `${data.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default KPICard;
