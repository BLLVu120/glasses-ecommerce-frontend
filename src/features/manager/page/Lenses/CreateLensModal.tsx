import { useState } from 'react';
import { useLenses } from '../../hooks/useLense';
import type { CreateLensRequest } from '../../types/lens';

interface CreateLensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateLensModal({ isOpen, onClose }: CreateLensModalProps) {
  const { createLens, isCreating } = useLenses();

  const [formData, setFormData] = useState<CreateLensRequest>({
    name: '',
    material: '',
    price: 0,
    description: '',
  });

  // Nếu modal đang đóng thì không render gì cả để nhẹ DOM
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLens(formData, {
      onSuccess: () => {
        // Thành công thì tự đóng modal và xóa trắng form
        onClose();
        setFormData({ name: '', material: '', price: 0, description: '' });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-zinc-900">Thêm tròng kính mới</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 bg-white">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Tên sản phẩm *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
              placeholder="VD: Tròng kính chống ánh sáng xanh"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Chất liệu *</label>
              <input
                required
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                placeholder="VD: Polycarbonate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Giá tiền (₫) *</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Mô tả</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm resize-none"
              placeholder="Nhập mô tả sản phẩm..."
            />
          </div>

          {/* Footer Modal: Buttons */}
          <div className="mt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 font-medium hover:bg-zinc-100 rounded-lg transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-2"
            >
              {isCreating && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isCreating ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
