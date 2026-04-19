import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi, type Order } from '../../api/order-api';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchDetail = async () => {
      const data = await orderApi.getOrderDetail(orderId);
      setOrder(data);
    };
    fetchDetail();
  }, [orderId]);

  if (!order) {
    return <div className="p-6">Đang tải chi tiết đơn...</div>;
  }


  const handleReject = async () => {
    if (!orderId) return;
    const confirmed = window.confirm(
      'Bạn có chắc muốn yêu cầu khách hàng gửi lại đơn? Đơn hàng sẽ chuyển sang trạng thái ON_HOLD.',
    );
    if (!confirmed) return;

    setVerifying(true);
    try {
      await orderApi.verifyOrder(orderId, false);
      showToast('Đã yêu cầu khách hàng gửi lại thành công!', 'success');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Lỗi:', error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.', 'error');
    } finally {
      setVerifying(false);
    }
  };

const handleReject = async () => {
    if (!orderId) return;
    const confirmed = window.confirm(
      'Bạn có chắc muốn yêu cầu khách hàng gửi lại đơn? Đơn hàng sẽ chuyển sang trạng thái ON_HOLD.',
    );
    if (!confirmed) return;

    setVerifying(true);
    try {
      await orderApi.verifyOrder(orderId, false);
      showToast('Đã yêu cầu khách hàng gửi lại thành công!', 'success');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Lỗi:', error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleApprove = async () => {
    if (!orderId) return;
    setVerifying(true);
    try {
      await orderApi.verifyOrder(orderId, true);
      showToast('Đã xác nhận và chuyển vận hành!', 'success');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Lỗi xác nhận đơn:', error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.', 'error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:underline">
        ← Quay lại
      </button>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border">
            <h3 className="font-semibold mb-3">Khách hàng</h3>
            <p className="font-medium">{order.phoneNumber}</p>
            <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-8 bg-white p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Order Items</h3>

          {order.items.map((item) => {
            const p = item.prescription;

            return (
              <div key={item.orderItemId} className="border rounded-lg p-4 mb-6 space-y-4">
                {/* ITEM INFO */}
                <div>
                  <p className="font-medium">Variant ID: {item.productVariantId}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Unit Price: {item.unitPrice}</p>
                  <p className="text-sm text-gray-500">Total: {item.totalPrice}</p>
                </div>

                {/* PRESCRIPTION */}
                {p && (
                  <>
                    {p.imageUrl && (
                      <div>
                        <p className="font-medium mb-2">Prescription Image</p>
                        <img
                          src={p.imageUrl}
                          alt="Prescription"
                          className="w-full max-w-md rounded-lg border"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mt-2">Mắt phải (OD)</h4>
                      <p>
                        SPH: {p.odSphere} | CYL: {p.odCylinder} | AXIS: {p.odAxis}
                      </p>

                      <h4 className="font-medium mt-2">Mắt trái (OS)</h4>
                      <p>
                        SPH: {p.osSphere} | CYL: {p.osCylinder} | AXIS: {p.osAxis}
                      </p>

export { SidebarContext };

export { SidebarContext };

                      <p className="text-sm text-gray-500 mt-2">Note: {p.note}</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReject}
              disabled={verifying}
              className="flex-1 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
            >
              {verifying ? 'Đang xử lý...' : 'Yêu cầu gửi lại'}
            </button>

            <button
              onClick={handleApprove}
              disabled={verifying}
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {verifying ? 'Đang xử lý...' : 'Xác nhận & Chuyển vận hành'}

 {verifying ? 'Đang xử lý...' : 'Xác nhận & Chuyển vận hành'}

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
