import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  ArrowLeft,
  ImageIcon,
  Package,
  Tag,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  useFilteredVariants,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
} from '../../hooks/useVariants';
import VariantModal from '../../page/products/VariantModal';
import type { ProductVariant } from '../../types/types';

// --- Helper Hook: Debounce để tránh spam API khi gõ search ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ProductVariantManagePage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // --- States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce searchTerm 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Lấy dữ liệu từ API thông qua hook có filter ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isFetching,
  } = useFilteredVariants(productId!, {
    page: 0,
    size: 100, // Lấy tạm 100, bạn có thể tích hợp phân trang thật sau
    q: debouncedSearchTerm || undefined, // Truyền keyword để backend tìm kiếm
  });

  // Bóc tách mảng an toàn từ object phân trang (giả sử API trả về { items: [], totalElements: 0 })
  const filteredVariants = paginatedData?.items || [];
  const totalVariants = paginatedData?.totalElements || filteredVariants.length;

  // --- Mutations ---
  const createMutation = useCreateVariant(productId!);
  const updateMutation = useUpdateVariant(productId!);
  const deleteMutation = useDeleteVariant(productId!);

  useEffect(() => {
    const handleClickGlobal = () => setOpenActionId(null);
    window.addEventListener('click', handleClickGlobal);
    return () => window.removeEventListener('click', handleClickGlobal);
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleOpenAdd = () => {
    setEditingVariant(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
    setOpenActionId(null);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
  };

  const handleSubmit = (form: Partial<ProductVariant>) => {
    if (editingVariant) {
      updateMutation.mutate(
        { variantId: editingVariant.id, payload: form },
        { onSuccess: handleCloseModal },
      );
    } else {
      createMutation.mutate(form, { onSuccess: handleCloseModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa biến thể này không?')) {
      deleteMutation.mutate(id, { onSuccess: () => setOpenActionId(null) });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const getStatusBadge = (status: string) =>
    status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-slate-100 text-slate-500 border-slate-200';

  const getOrderTypeBadge = (type: string) =>
    type === 'IN_STOCK'
      ? 'bg-sky-50 text-sky-700 border-sky-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white p-8 font-sans text-slate-800 animate-in fade-in duration-700">
      {/* TIÊU ĐỀ (HEADER) */}
      <div className="flex flex-col gap-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách sản phẩm
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Biến thể sản phẩm
              </h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 tracking-wide">
                ID: {productId}
              </span>
            </div>
            <p className="text-slate-500 text-base">
              Quản lý các biến thể, giá cả và kho hàng cho sản phẩm này.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-slate-800 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm biến thể</span>
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col min-h-[600px]">
        {/* THANH CÔNG CỤ (TOOLBAR) */}
        <div className="px-8 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isFetching && searchTerm === debouncedSearchTerm ? (
                <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              )}
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Kết quả: <span className="text-slate-900 font-bold">{totalVariants}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-x-auto relative">
          {/* Overlay loading mờ mờ khi đang filter */}
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10" />
          )}

          {isError ? (
            <div className="flex flex-col items-center justify-center h-80">
              <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
              <p className="font-semibold text-slate-700">Không thể tải dữ liệu biến thể</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-80">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
              <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Màu sắc & Hoàn thiện
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Variant ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Kích thước (mm)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Giá bán
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    Loại kho
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {filteredVariants.length > 0 ? (
                  filteredVariants.map((variant: ProductVariant, index: number) => (
                    <tr
                      key={variant.id}
                      className="group hover:bg-slate-50/80 transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* 1. MÀU SẮC & HOÀN THIỆN */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                              {variant.colorName}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Tag className="w-3 h-3 text-slate-400" />
                              {variant.frameFinish && (
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                                  {variant.frameFinish}
                                </span>
                              )}
                              {variant.sizeLabel && (
                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                                  {variant.sizeLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. VARIANT ID */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                            {(variant.id ?? '').slice(0, 8)}...
                          </span>
                          <button
                            onClick={() => handleCopyId(variant.id)}
                            title="Sao chép ID đầy đủ"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            {copiedId === variant.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. KÍCH THƯỚC CHI TIẾT */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                          <span>
                            Tròng:{' '}
                            <span className="font-semibold text-slate-900">
                              {variant.lensWidthMm}mm
                            </span>
                          </span>
                          <span>
                            Cầu:{' '}
                            <span className="font-semibold text-slate-900">
                              {variant.bridgeWidthMm}mm
                            </span>
                          </span>
                          <span>
                            Càng:{' '}
                            <span className="font-semibold text-slate-900">
                              {variant.templeLengthMm}mm
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* 4. GIÁ CẢ */}
                      <td className="px-6 py-5 align-middle">
                        <div className="flex items-center gap-1 font-bold text-slate-800 text-[15px]">
                          {Number(variant.price ?? 0).toLocaleString('vi-VN')}
                          <span className="text-xs font-medium text-slate-400 underline decoration-slate-300">
                            đ
                          </span>
                        </div>
                      </td>

                      {/* 5. LOẠI ĐƠN HÀNG */}
                      <td className="px-6 py-5 align-middle text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getOrderTypeBadge(
                            variant.orderItemType,
                          )}`}
                        >
                          {variant.orderItemType === 'IN_STOCK' ? 'Có sẵn' : 'Đặt trước'}
                        </span>
                      </td>

                      {/* 6. TRẠNG THÁI */}
                      <td className="px-6 py-5 align-middle text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border gap-1.5 ${getStatusBadge(
                            variant.status,
                          )}`}
                        >
                          {variant.status === 'ACTIVE' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                          {variant.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                      </td>

                      {/* 7. THAO TÁC */}
                      <td className="px-6 py-5 align-middle text-center">
                        <div className="flex items-center justify-center">
                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() =>
                                setOpenActionId(openActionId === variant.id ? null : variant.id)
                              }
                              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                                openActionId === variant.id
                                  ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-100 shadow-sm'
                                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {openActionId === variant.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 py-1.5 text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Tùy chọn
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleOpenEdit(variant)}
                                  className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors font-medium"
                                >
                                  <Edit className="w-4 h-4" /> Chỉnh sửa
                                </button>
                                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                <button
                                  onClick={() => handleDelete(variant.id)}
                                  disabled={deleteMutation.isPending}
                                  className="w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium disabled:opacity-50"
                                >
                                  {deleteMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                  Xóa biến thể
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                          <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          Không tìm thấy biến thể
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {debouncedSearchTerm
                            ? 'Không có kết quả nào phù hợp với tìm kiếm của bạn.'
                            : 'Hãy thêm biến thể đầu tiên để bắt đầu bán hàng.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <VariantModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        variant={editingVariant}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProductVariantManagePage;
