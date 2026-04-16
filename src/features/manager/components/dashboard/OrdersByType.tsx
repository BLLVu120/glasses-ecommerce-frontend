import { Badge } from '@/components/ui/badge';

interface OrderType {
  type: string;
  count: number;
  status: 'preorder' | 'processing' | 'pending' | 'completed';
}

const orderTypes: OrderType[] = [
  { type: 'Stock Orders', count: 47, status: 'completed' },
  { type: 'Pre-orders', count: 23, status: 'preorder' },
  { type: 'Prescription', count: 31, status: 'processing' },
  { type: 'Returns', count: 8, status: 'pending' },
];

const statusStyles = {
  preorder: 'bg-info/10 text-info border-info/20',
  processing: 'bg-status-prescription/10 text-status-prescription border-status-prescription/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-success/10 text-success border-success/20',
};

export function OrdersByType() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-semibold tracking-tight mb-4">Active Orders</h3>
      <div className="space-y-3">
        {orderTypes.map((order) => (
          <div key={order.type} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold tabular-nums">{order.count}</div>
              <div className="text-sm text-muted-foreground">{order.type}</div>
            </div>
            <Badge variant="outline" className={statusStyles[order.status]}>
              {order.status}
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Active</span>
          <span className="text-xl font-bold">109</span>
        </div>
      </div>
    </div>
  );
}
