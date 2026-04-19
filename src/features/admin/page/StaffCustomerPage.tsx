// src/features/users/pages/StaffCustomerPage.tsx
import { useState } from 'react';
import { Trash2, Loader2, ShieldCheck, X, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { useUsers, useAssignRole } from '../hooks/useUsers';

type StaffRole = 'SALE' | 'OPERATION' | 'SHIPPER' | 'MANAGER' | 'ADMIN';

const STAFF_ROLES: { key: StaffRole; label: string; color: string }[] = [
  { key: 'ADMIN', label: 'Admin', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { key: 'MANAGER', label: 'Manager', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { key: 'SALE', label: 'Sale', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { key: 'OPERATION', label: 'Operation', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { key: 'SHIPPER', label: 'Shipper', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
];

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-70">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// 🚀 REUSABLE MODAL CHO CẢ NHÂN VIÊN VÀ KHÁCH HÀNG
const AssignRoleModal = ({
  user,
  onClose,
  onSuccess,
}: {
  user: any;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) => {
  const assignMutation = useAssignRole();
  const [error, setError] = useState<string | null>(null);

  // Đổi kiểu của tham số role thành string để nhận cả 'CUSTOMER'
  const handleAssign = (role: string) => {
    setError(null);
    assignMutation.mutate(
      { userId: user.id, role: role },
      {
        onSuccess: () => {
          onSuccess(`Đã cập nhật quyền của ${user.username} thành ${role}!`);
          onClose();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            'Cập nhật quyền thất bại. Vui lòng thử lại!';
          setError(message);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Cập nhật vai trò</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Chọn vai trò mới cho <span className="font-semibold text-slate-700">{user.username}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          {/* Render các role của Staff */}
          {STAFF_ROLES.map((roleObj) => (
            <button
              key={roleObj.key}
              onClick={() => handleAssign(roleObj.key)}
              disabled={assignMutation.isPending}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${roleObj.color}`}
            >
              <span>{roleObj.label}</span>
              {assignMutation.isPending && assignMutation.variables?.role === roleObj.key ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </button>
          ))}

          <div className="my-2 border-t border-slate-100"></div>

          {/* Nút riêng biệt để chuyển về Customer */}
          <button
            onClick={() => handleAssign('CUSTOMER')}
            disabled={assignMutation.isPending}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <span>Khách hàng (Customer)</span>
            {assignMutation.isPending && assignMutation.variables?.role === 'CUSTOMER' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={assignMutation.isPending}
          className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
};

const StaffView = () => {
  const [activeRole, setActiveRole] = useState<StaffRole>('SALE');
  const { data: staffList = [], isLoading } = useUsers(activeRole);
  const assignMutation = useAssignRole();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // State để lưu nhân viên đang được chọn đổi role
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (staff: any) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xoá nhân viên "${staff.username}"?\nHọ sẽ được chuyển thành Customer.`,
      )
    ) {
      assignMutation.mutate(
        { userId: staff.id, role: 'CUSTOMER' },
        {
          onSuccess: () => showToast(`Đã chuyển "${staff.username}" thành Customer!`, 'success'),
          onError: (error: any) =>
            showToast(error?.response?.data?.message || 'Thao tác thất bại, thử lại!', 'error'),
        },
      );
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Tái sử dụng AssignRoleModal cho Nhân viên */}
      {selectedStaff && (
        <AssignRoleModal
          user={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Sub-tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-slate-100 overflow-x-auto">
        {STAFF_ROLES.map((role) => (
          <button
            key={role.key}
            onClick={() => setActiveRole(role.key)}
            className={`px-5 py-2 text-sm font-semibold rounded-t-lg transition-all border-b-2 -mb-px whitespace-nowrap ${
              activeRole === role.key
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nhân viên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Không có nhân viên nào
                  </td>
                </tr>
              ) : (
                staffList.map((staff: any) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{staff.username}</td>
                    <td className="px-6 py-4 text-slate-600">{staff.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          STAFF_ROLES.find((r) => r.key === activeRole)?.color.replace(/hover:[^\s]+/g, '') ||
                          'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {activeRole}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          disabled={assignMutation.isPending}
                          title="Đổi vai trò"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(staff)}
                          disabled={assignMutation.isPending}
                          title="Xoá nhân viên (chuyển thành Customer)"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {assignMutation.isPending &&
                          assignMutation.variables?.userId === staff.id &&
                          assignMutation.variables?.role === 'CUSTOMER' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CustomerView = () => {
  const { data: customerList = [], isLoading } = useUsers('CUSTOMER');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {selectedCustomer && (
        <AssignRoleModal
          user={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customerList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  Không có khách hàng nào
                </td>
              </tr>
            ) : (
              customerList.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{customer.username}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                      Customer
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Nâng quyền
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const StaffCustomerPage = () => {
  const [activeTab, setActiveTab] = useState<'staff' | 'customer'>('staff');

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-1">Quản lý nhân viên và khách hàng</p>
        </div>
      </div>

      {/* Main tabs */}
      <div className="mb-6 flex gap-1 bg-slate-200/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Nhân viên
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'customer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          Khách hàng
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'staff' ? <StaffView /> : <CustomerView />}
      </div>
    </div>
  );
};

export default StaffCustomerPage;