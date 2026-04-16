import React, { useState, useCallback, useEffect } from 'react';
import { ScreenSelectOrders } from '@/features/shipper/components/dashboard/ScreenSelectOrders';
import { ScreenDeliveryList } from '@/features/shipper/components/dashboard/ScreenDeliveryList';
import { ScreenOrderDetail } from '@/features/shipper/components/dashboard/ScreenOrderDetail';
import { useShipperStore } from '@/features/shipper/store/shipperStore.ts';

type Screen = 'select' | 'list' | 'detail';

const ShipperDashboardPage: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [startedIds, setStartedIds] = useState<Set<string>>(new Set());
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const readyToShipOrders = useShipperStore((state) => state.readyToShipOrders);
  const acceptedOrders = useShipperStore((state) => state.acceptedOrders);
  const loading = useShipperStore((state) => state.loading);
  const error = useShipperStore((state) => state.error);
  const fetchReadyToShipOrders = useShipperStore((state) => state.fetchReadyToShipOrders);
  const acceptOrders = useShipperStore((state) => state.acceptOrders);
  const fetchAcceptedOrders = useShipperStore((state) => state.fetchAcceptedOrders);
  const startDelivery = useShipperStore((state) => state.startDelivery);
  const confirmDelivered = useShipperStore((state) => state.confirmDelivered);
  const clearError = useShipperStore((state) => state.clearError);

  useEffect(() => {
    if (screen === 'list') {
      fetchAcceptedOrders();
    } else if (screen === 'select') {
      fetchReadyToShipOrders();
    }
  }, [screen, fetchAcceptedOrders, fetchReadyToShipOrders]);

  const toggleOrder = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const confirmRoute = useCallback(async () => {
    if (selectedIds.size > 0) {
      try {
        await acceptOrders(Array.from(selectedIds));
        setScreen('list');
        setSelectedIds(new Set());
      } catch (error) {
        console.error('Failed to accept orders:', error);
      }
    }
  }, [selectedIds, acceptOrders]);

  const startOrder = useCallback(
    async (id: string) => {
      try {
        await startDelivery(id);
        setActiveOrderId(id);
        setStartedIds((prev) => new Set(prev).add(id));
        setScreen('detail');
      } catch (error) {
        console.error('Failed to start delivery:', error);
      }
    },
    [startDelivery],
  );

  const goBackToList = useCallback(() => {
    setScreen('list');
  }, []);

  const completeOrder = useCallback(async () => {
    if (activeOrderId) {
      try {
        await confirmDelivered(activeOrderId);
        setCompletedIds((prev) => new Set(prev).add(activeOrderId));
        setActiveOrderId(null);
        setScreen('list');
      } catch (error) {
        console.error('Failed to confirm delivery:', error);
      }
    }
  }, [activeOrderId, confirmDelivered]);

  const goToDeliveryList = useCallback(() => {
    setScreen('list');
  }, []);

  // const selectedOrders = readyToShipOrders.filter((o) => selectedIds.has(o.orderId));
  const activeOrder = acceptedOrders.find((o) => o.orderId === activeOrderId) || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Error Display */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Screen Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-500">Đang tải...</div>
        </div>
      ) : (
        <>
          {screen === 'select' && (
            <ScreenSelectOrders
              orders={readyToShipOrders}
              selectedIds={selectedIds}
              onToggle={toggleOrder}
              onConfirm={confirmRoute}
              onViewAccepted={goToDeliveryList}
            />
          )}
          {screen === 'list' && (
            <ScreenDeliveryList
              orders={acceptedOrders}
              completedIds={completedIds}
              startedIds={startedIds}
              onStart={startOrder}
              onBack={() => setScreen('select')}
            />
          )}
          {screen === 'detail' && activeOrder && (
            <ScreenOrderDetail
              order={activeOrder}
              onBack={goBackToList}
              onComplete={completeOrder}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ShipperDashboardPage;
