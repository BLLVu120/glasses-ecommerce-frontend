import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StockAlert {
  id: string;
  product: string;
  sku: string;
  stock: number;
  threshold: number;
}

const alerts: StockAlert[] = [
  {
    id: '1',
    product: 'Ray-Ban Aviator Classic',
    sku: 'RB-3025-001',
    stock: 5,
    threshold: 10,
  },
  {
    id: '2',
    product: 'Oakley Holbrook',
    sku: 'OO-9102-01',
    stock: 3,
    threshold: 8,
  },
  {
    id: '3',
    product: 'Acuvue Oasys Daily',
    sku: 'ACV-OAS-30',
    stock: 12,
    threshold: 20,
  },
  {
    id: '4',
    product: 'Essilor Varilux X',
    sku: 'ESS-VX-167',
    stock: 8,
    threshold: 15,
  },
];

export function LowStockAlerts() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="font-semibold tracking-tight">Low Stock Alerts</h3>
        <span className="ml-auto text-sm text-muted-foreground">{alerts.length} items</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div>
              <p className="text-sm font-medium">{alert.product}</p>
              <p className="text-xs text-muted-foreground font-mono">{alert.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-destructive">{alert.stock} left</p>
              <p className="text-xs text-muted-foreground">Min: {alert.threshold}</p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full mt-4" size="sm">
        View All Inventory
      </Button>
    </div>
  );
}
