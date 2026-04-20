import { useState } from 'react';
import { Trash2, Loader2, ShieldCheck, X, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { useUsers, useAssignRole } from '../hooks/useUsers';

type StaffRole = 'SALE' | 'OPERATION' | 'SHIPPER' | 'MANAGER' | 'ADMIN';

interface AdminUser {
  id: string;
  username: string;
  email?: string;
}

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
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}
  >
    {type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:opacity-70">
      <X className="h-4 w-4" />
    </button>
  </div>
);

const AssignRoleModal = ({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUser;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) => {
  const assignMutation = useAssignRole();
  const [error, setError] = useState<string | null>(null);

  const handleAssign = (role: string) => {
    setError(null);
    assignMutation.mutate(
      { userId: user.id, role },
      {
        onSuccess: () => {
          onSuccess(`Da cap nhat quyen cua ${user.username} thanh ${role}!`);
          onClose();
        },
        onError: () => {
          setError('Cap nhat quyen that bai. Vui long thu lai!');
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cap nhat vai tro</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Chon vai tro moi cho <span className="font-semibold text-slate-700">{user.username}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-slate-100">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          {STAFF_ROLES.map((roleObj) => (
            <button
              key={roleObj.key}
              onClick={() => handleAssign(roleObj.key)}
              disabled={assignMutation.isPending}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${roleObj.color}`}
            >
              <span className="flex items-center justify-between">
                <span>{roleObj.label}</span>
                {assignMutation.isPending && assignMutation.variables?.role === roleObj.key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
              </span>
            </button>
          ))}

          <div className="my-2 border-t border-slate-100"></div>

          <button
            onClick={() => handleAssign('CUSTOMER')}
            disabled={assignMutation.isPending}
            className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-200 disabled:opacity-50"
          >
            <span className="flex items-center justify-between">
              <span>Khach hang (Customer)</span>
              {assignMutation.isPending && assignMutation.variables?.role === 'CUSTOMER' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
            </span>
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={assignMutation.isPending}
          className="mt-4 w-full py-2 text-sm text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-50"
        >
          Huy
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
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (staff: AdminUser) => {
    if (window.confirm(`Ban co chac muon xoa nhan vien "${staff.username}"?`)) {
      assignMutation.mutate(
        { userId: staff.id, role: 'CUSTOMER' },
        {
          onSuccess: () => showToast(`Da chuyen "${staff.username}" thanh Customer!`, 'success'),
          onError: () => showToast('Thao tac that bai, thu lai!', 'error'),
        },
      );
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {selectedStaff && (
        <AssignRoleModal
          user={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      <div className="overflow-x-auto border-b border-slate-100 px-6 pt-4">
        <div className="flex gap-1 overflow-x-auto">
          {STAFF_ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className={`-mb-px whitespace-nowrap rounded-t-lg border-b-2 px-5 py-2 text-sm font-semibold transition-all ${
                activeRole === role.key
                  ? 'border-slate-900 bg-white text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Nhan vien</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Email</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Vai tro</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Hanh dong
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Khong co nhan vien nao
                  </td>
                </tr>
              ) : (
                staffList.map((staff: AdminUser) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{staff.username}</td>
                    <td className="px-6 py-4 text-slate-600">{staff.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          STAFF_ROLES.find((r) => r.key === activeRole)?.color.replace(
                            /hover:[^\s]+/g,
                            '',
                          ) || 'bg-slate-50 text-slate-600'
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
                          title="Doi vai tro"
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(staff)}
                          disabled={assignMutation.isPending}
                          title="Xoa nhan vien"
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          {assignMutation.isPending &&
                          assignMutation.variables?.userId === staff.id &&
                          assignMutation.variables?.role === 'CUSTOMER' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
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
  const [selectedCustomer, setSelectedCustomer] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Khach hang</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Trang thai</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">
                Hanh dong
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customerList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  Khong co khach hang nao
                </td>
              </tr>
            ) : (
              customerList.map((customer: AdminUser) => (
                <tr key={customer.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{customer.username}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                      Customer
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="ml-auto flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Nang quyen
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quan ly nguoi dung</h1>
          <p className="mt-1 text-slate-500">Quan ly nhan vien va khach hang</p>
        </div>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-xl bg-slate-200/50 p-1">
        <button
          onClick={() => setActiveTab('staff')}
          className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
            activeTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Nhan vien
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
            activeTab === 'customer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Khach hang
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {activeTab === 'staff' ? <StaffView /> : <CustomerView />}
      </div>
    </div>
  );
};

export default StaffCustomerPage;