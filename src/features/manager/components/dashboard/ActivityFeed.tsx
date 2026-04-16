import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'order' | 'stock' | 'staff' | 'system';
  message: string;
  timestamp: string;
  isNew?: boolean;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'order',
    message: 'New prescription order #ORD-2847 received',
    timestamp: '2 min ago',
    isNew: true,
  },
  {
    id: '2',
    type: 'stock',
    message: 'Low stock alert: Ray-Ban Aviator Classic (5 units)',
    timestamp: '15 min ago',
    isNew: true,
  },
  {
    id: '3',
    type: 'staff',
    message: 'Sarah M. verified prescription for order #ORD-2845',
    timestamp: '32 min ago',
  },
  {
    id: '4',
    type: 'order',
    message: 'Order #ORD-2843 shipped via FedEx',
    timestamp: '1 hour ago',
  },
  {
    id: '5',
    type: 'system',
    message: 'Daily backup completed successfully',
    timestamp: '2 hours ago',
  },
  {
    id: '6',
    type: 'staff',
    message: 'Mike T. processed 12 orders in Lab Queue',
    timestamp: '3 hours ago',
  },
  {
    id: '7',
    type: 'order',
    message: 'Pre-order #ORD-2840 converted to active order',
    timestamp: '4 hours ago',
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold tracking-tight">Recent Activity</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-0">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div
              className={cn('activity-dot', activity.isNew && 'activity-dot-active pulse-subtle')}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
