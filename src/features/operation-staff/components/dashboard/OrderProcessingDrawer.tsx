import React, { useEffect } from 'react';
import DrawerOverlay from './DrawerOverlay';
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import DrawerFooter from './DrawerFooter';
import { useOrderDrawerStore } from '@/features/operation-staff/store/orderDrawerStore.ts';
import { useProductionStore } from '@/features/operation-staff/store/productionStore.ts';

const OrderProcessingDrawer: React.FC = () => {
  const { isOpen, selectedOrder, closeDrawer } = useOrderDrawerStore();
  const finishOrder = useProductionStore((state) => state.finishOrder);
  const startPackaging = useProductionStore((state) => state.startPackaging);
  const handoverToCarrier = useProductionStore((state) => state.handoverToCarrier);
  const processingOrders = useProductionStore((state) => state.processingOrders);

  // Keep drawer in sync with store updates
  const currentOrder = selectedOrder
    ? processingOrders.find((o) => o.orderId === selectedOrder.orderId) || selectedOrder
    : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDrawer]);

  const handleCompleteProcessing = () => {
    if (currentOrder) {
      finishOrder(currentOrder.orderId)
        .then(() => {
          console.log('Order production completed:', currentOrder.orderId);
        })
        .catch((error) => {
          console.error('Failed to complete order:', error);
        });
    }
  };

  const handleStartPackaging = () => {
    if (currentOrder) {
      startPackaging(currentOrder.orderId)
        .then(() => {
          console.log('Packaging started:', currentOrder.orderId);
        })
        .catch((error) => {
          console.error('Failed to start packaging:', error);
        });
    }
  };

  const handleHandoverToCarrier = (trackingNumber: string) => {
    if (currentOrder) {
      handoverToCarrier(currentOrder.orderId, trackingNumber)
        .then(() => {
          console.log('Handed over to carrier:', currentOrder.orderId, trackingNumber);
        })
        .catch((error) => {
          console.error('Failed to handover:', error);
        });
    }
  };

  return (
    <DrawerOverlay isOpen={isOpen} onClose={closeDrawer}>
      {currentOrder && (
        <>
          <DrawerHeader order={currentOrder} onClose={closeDrawer} />
          <DrawerContent orderId={currentOrder.orderId} isOpen={isOpen} />
          <DrawerFooter
            onCompleteProcessing={handleCompleteProcessing}
            onStartPackaging={handleStartPackaging}
            onHandoverToCarrier={handleHandoverToCarrier}
            orderStatus={currentOrder.orderStatus}
            trackingNumber={currentOrder.trackingNumber}
          />
        </>
      )}
    </DrawerOverlay>
  );
};

export default OrderProcessingDrawer;
