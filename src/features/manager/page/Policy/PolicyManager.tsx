'use client';

import { useState, useEffect } from 'react';

import {
  usePolicies,
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
} from '../../hooks/usePolicies';
import type { Policy, PolicyForm } from '../../api/policy-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: PolicyForm = {
  code: '',
  title: '',
  description: '',
  effectiveFrom: '',
  effectiveTo: '',
};

const fmtDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const isActive = (from: string, to: string) => {
  const now = new Date();
  return new Date(from) <= now && now <= new Date(to);
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${
        type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
      }`}
    >
      <span>{type === 'success' ? '✓' : '⚠'}</span>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100 text-lg leading-none">
        ×
      </button>
    </div>
  );
}

// ─── PolicyModal (Create / Edit) ──────────────────────────────────────────────

function PolicyModal({
  policy,
  onClose,
  onSaved,
}: {
  policy: Policy | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<PolicyForm>(
    policy
      ? {
          code: policy.code,
          title: policy.title,
          description: policy.description,
          effectiveFrom: policy.effectiveFrom,
          effectiveTo: policy.effectiveTo,
        }
      : EMPTY_FORM,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const createHook = useCreatePolicy();
  const updateHook = useUpdatePolicy();

  const saving = createHook.loading || updateHook.loading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.title.trim() || !form.effectiveFrom || !form.effectiveTo) {
      setFormError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    setFormError(null);
    try {
      if (policy) {
        await updateHook.run(policy.id, form);
      } else {
        await createHook.run(form);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setFormError(e.message);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition-all';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {policy ? 'Chỉnh sửa chính sách' : 'Tạo chính sách mới'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {policy ? `ID: ${policy.id}` : 'Điền thông tin để tạo chính sách'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {formError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-sm text-rose-700">
              ⚠ {formError}
            </div>
          )}

          <div>
            <label className={labelCls}>
              Mã chính sách <span className="text-rose-500">*</span>
            </label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="VD: POLICY_RETURN_30_DAYS"
              className={inputCls + ' font-mono'}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Viết hoa, dùng dấu gạch dưới, không dấu cách
            </p>
          </div>

          <div>
            <label className={labelCls}>
              Tiêu đề <span className="text-rose-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="VD: Chính sách đổi trả trong 30 ngày"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết chính sách..."
              rows={4}
              className={inputCls + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Hiệu lực từ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="effectiveFrom"
                value={form.effectiveFrom}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                Hiệu lực đến <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="effectiveTo"
                value={form.effectiveTo}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {policy ? 'Lưu thay đổi' : 'Tạo chính sách'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────

function DeleteConfirmModal({
  policy,
  onClose,
  onDeleted,
}: {
  policy: Policy;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { loading, run } = useDeletePolicy();

  const handleDelete = async () => {
    try {
      await run(policy.id);
      onDeleted();
      onClose();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900">Xóa chính sách?</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{policy.title}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Hành động này <span className="font-semibold text-rose-600">không thể hoàn tác</span>.
          Chính sách sẽ bị xóa vĩnh viễn.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PolicyCard ───────────────────────────────────────────────────────────────

function PolicyCard({
  policy,
  onEdit,
  onDelete,
}: {
  policy: Policy;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const active = isActive(policy.effectiveFrom, policy.effectiveTo);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                active
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}
              />
              {active ? 'Đang hiệu lực' : 'Không hiệu lực'}
            </span>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg border border-indigo-100">
              {policy.code}
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-800 leading-snug">{policy.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            bởi {policy.managerUsername} · #{policy.id}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Chỉnh sửa"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Xóa"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {policy.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{policy.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {fmtDate(policy.effectiveFrom)} → {fmtDate(policy.effectiveTo)}
        </div>
        <span className="text-[10px] text-gray-300">{fmtDate(policy.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PolicyManager() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editPolicy, setEditPolicy] = useState<Policy | null>(null);
  const [deletePolicy, setDeletePolicy] = useState<Policy | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const { data, loading, fetch } = usePolicies();

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load lần đầu
  useEffect(() => {
    fetch(0);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetch(page);
  };

  const policies = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  const filtered = policies.filter((p) => {
    const q = searchQ.toLowerCase();
    return (
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const activeCount = policies.filter((p) => isActive(p.effectiveFrom, p.effectiveTo)).length;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal tạo mới */}
      {showCreate && (
        <PolicyModal
          policy={null}
          onClose={() => setShowCreate(false)}
          onSaved={() => {
            fetch(0);
            setCurrentPage(0);
            showToast('Tạo chính sách thành công!', 'success');
          }}
        />
      )}

      {/* Modal chỉnh sửa */}
      {editPolicy && (
        <PolicyModal
          policy={editPolicy}
          onClose={() => setEditPolicy(null)}
          onSaved={() => {
            fetch(currentPage);
            showToast('Cập nhật thành công!', 'success');
          }}
        />
      )}

      {/* Modal xóa */}
      {deletePolicy && (
        <DeleteConfirmModal
          policy={deletePolicy}
          onClose={() => setDeletePolicy(null)}
          onDeleted={() => {
            fetch(0);
            setCurrentPage(0);
            showToast('Đã xóa chính sách!', 'success');
          }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tiêu đề */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý chính sách</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalElements} chính sách ·{' '}
              <span className="text-emerald-600 font-medium">{activeCount} đang hiệu lực</span>
              {totalElements - activeCount > 0 && (
                <span className="text-gray-400">
                  {' '}
                  · {totalElements - activeCount} không hiệu lực
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetch(currentPage)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg border border-gray-200 transition-colors"
              title="Làm mới"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Tạo chính sách
            </button>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 mb-5">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, mã chính sách, mô tả..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
            />
          </div>
        </div>

        {/* Danh sách */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3 text-gray-400">
            <div className="w-7 h-7 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm">Đang tải chính sách...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <svg
              className="w-12 h-12 mb-3 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">
              {searchQ ? 'Không tìm thấy chính sách phù hợp' : 'Chưa có chính sách nào'}
            </p>
            {!searchQ && (
              <button
                onClick={() => setShowCreate(true)}
                className="mt-3 text-sm text-indigo-600 hover:underline font-medium"
              >
                + Tạo chính sách đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <PolicyCard
                key={p.id}
                policy={p}
                onEdit={() => setEditPolicy(p)}
                onDelete={() => setDeletePolicy(p)}
              />
            ))}
          </div>
        )}

        {/* Phân trang */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Trang {currentPage + 1} / {totalPages} · {totalElements} chính sách
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
