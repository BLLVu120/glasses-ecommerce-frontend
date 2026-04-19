import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAwaitingVerificationOrders } from '../../hook/useOrders';
// Import custom hook bạn vừa tạo

export default function OrderPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Gọi Custom Hook
  const { data, isLoading, isFetching, isError } = useAwaitingVerificationOrders(currentPage, 10);

  // Trích xuất dữ liệu an toàn
  const orders = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Xử lý chuyển trang
  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

 {verifying ? 'Đang xử lý...' : 'Xác nhận & Chuyển vận hành'}

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng tải lại trang!
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng tải lại trang!
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Đơn chờ xác minh</h1>
        <span className="text-sm text-gray-500">
          Tổng cộng: <span className="font-medium text-gray-900">{totalElements}</span> đơn hàng
        </span>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm relative">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b">
            <tr>
              <th className="px-4 py-3 text-left">MÃ ĐƠN</th>
              <th className="px-4 py-3 text-left">SĐT</th>
              <th className="px-4 py-3 text-left">TỔNG TIỀN</th>
              <th className="px-4 py-3 text-left">TRẠNG THÁI</th>
              <th className="px-4 py-3 text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>

          <tbody className="divide-y relative">
            {/* Lớp mờ báo hiệu đang tải khi chuyển trang */}
            {isFetching && !isLoading && (
              <tr className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex justify-center items-center z-10">
                <td className="font-medium text-gray-600">Đang tải dữ liệu...</td>
              </tr>
            )}

            {/* Trạng thái tải lần đầu */}
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  Đang tải đơn hàng...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  Không có đơn nào chờ xác minh
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{order.orderId}</td>
                  <td className="px-4 py-3">{order.phoneNumber}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700 font-medium">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/seller/orders/${order.orderId}`)}
                      className="px-4 py-1.5 border rounded-lg text-sm hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Thanh phân trang */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-900">{currentPage + 1}</span> /{' '}
              <span className="font-medium text-gray-900">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isFetching}
                className="p-1.5 rounded-md border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1 || isFetching}
                className="p-1.5 rounded-md border bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  }; 
    </div>
  );
}
export function AdminDashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}