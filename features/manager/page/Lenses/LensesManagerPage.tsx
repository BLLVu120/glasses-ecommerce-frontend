import { useState } from 'react';
import { useLenses } from '../../hooks/useLense';
import CreateLensModal from './CreateLensModal';

export default function LensesManagerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { lenses, isLoading, isError, error, refetch } = useLenses();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-[3px] border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
        <span className="text-zinc-500 font-medium text-sm animate-pulse">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-red-200 rounded-xl text-center shadow-sm">
        <h2 className="text-red-600 font-bold text-lg mb-2">Đã có lỗi xảy ra</h2>
        <p className="text-red-500/80 mb-6 text-sm">
          {error instanceof Error ? error.message : 'Không thể tải danh sách sản phẩm.'}
        </p>
        <button
          onClick={() => refetch()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors text-sm"
        >
          Tải lại dữ liệu
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Công cụ quản lý */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Quản lý Tròng kính</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Hệ thống hiện có{' '}
            <span className="font-semibold text-zinc-900">{lenses?.length || 0}</span> sản phẩm
          </p>
        </div>

        {/* Nút Thêm mới - Call to Action chính của Admin */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            Xuất file
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm mới
          </button>
        </div>
      </div>

      {/* Vùng Bảng dữ liệu (Data Table) */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Sản phẩm
                </th>
                <th scope="col" className="px-6 py-4">
                  Chất liệu
                </th>
                <th scope="col" className="px-6 py-4">
                  Đơn giá
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {lenses && lenses.length > 0 ? (
                lenses.map((lens) => (
                  <tr key={lens.id} className="hover:bg-zinc-50/50 transition-colors group">
                    {/* Cột Tên & Mô tả */}
                    <td className="px-6 py-4 whitespace-normal min-w-[300px]">
                      <div className="font-semibold text-zinc-900 mb-0.5">{lens.name}</div>
                      <div className="text-zinc-500 text-xs line-clamp-1">{lens.description}</div>
                    </td>

                    {/* Cột Chất liệu */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-bold uppercase tracking-widest">
                        {lens.material}
                      </span>
                    </td>

                    {/* Cột Giá */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">
                        {lens.price.toLocaleString('vi-VN')} ₫
                      </div>
                    </td>

                    {/* Cột Thao tác (Chỉnh sửa / Xóa) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Chưa có sản phẩm nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateLensModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
