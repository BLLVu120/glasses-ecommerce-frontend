import { useState } from 'react';
import { toast } from 'sonner';
import { useAffectedOrders, useCreateBatch, useInActivateVariant } from '../../hooks/useRefunds';
import { useFilteredVariants } from '../../hooks/useVariants';
import { fmt } from '@/lib/utils';
import type { Product, ProductVariant } from '../../types/types';
import { useFilteredProducts } from '../../hooks/useProducts';

export function CreateBatchModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);

  // States cho Sản phẩm
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productPage, setProductPage] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // States cho Biến thể
  const [variantPage, setVariantPage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  const [confirmedVariantId, setConfirmedVariantId] = useState<string>('');

  // 1. Hook lấy sản phẩm (kèm phân trang)
  const { data: productsData, isLoading: isLoadingProducts } = useFilteredProducts({
    page: productPage,
    size: 5, // Mỗi trang hiện 5 sản phẩm cho gọn
    q: searchTerm,
  });

  // 2. Hook lấy variant (kèm phân trang)
  const { data: variantsData, isLoading: isLoadingVariants } = useFilteredVariants(
    selectedProductId,
    { page: variantPage, size: 6 }, // Mỗi trang hiện 6 variant (grid 2x3)
  );

  // 3. Hooks Refund
  const { mutateAsync: inactivate, isPending: isActivating } = useInActivateVariant();
  const { mutateAsync: createBatch, isPending: isCreating } = useCreateBatch();
  const { data: affectedItems = [], isFetching: isFetchingOrders } =
    useAffectedOrders(confirmedVariantId);

  const handleInActivate = async () => {
    if (!selectedVariantId) return;
    try {
      await inactivate(selectedVariantId);
      setConfirmedVariantId(selectedVariantId);
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi vô hiệu hóa');
    }
  };

  const handleCreateBatch = async () => {
    try {
      const orderIds = affectedItems.map((item) => item.order.orderId);
      await createBatch(orderIds);
      toast.success('Đã tạo batch hoàn tiền!');
      setTimeout(() => onClose(), 800);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi tạo batch');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Tạo đợt hoàn tiền hàng loạt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-6">
              {/* --- PHẦN 1: CHỌN SẢN PHẨM --- */}
              <section className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    1. Chọn sản phẩm
                  </label>
                  {productsData?.totalPages && productsData.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={productPage === 0}
                        onClick={() => setProductPage((p) => p - 1)}
                        className="p-1 border rounded hover:bg-gray-50 disabled:opacity-30 text-xs"
                      >
                        &lt;
                      </button>
                      <span className="text-[10px] font-medium text-gray-500">
                        Trang {productPage + 1}/{productsData.totalPages}
                      </span>
                      <button
                        disabled={productPage >= productsData.totalPages - 1}
                        onClick={() => setProductPage((p) => p + 1)}
                        className="p-1 border rounded hover:bg-gray-50 disabled:opacity-30 text-xs"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="space-y-1">
                  {isLoadingProducts ? (
                    <div className="py-4 text-center text-xs text-gray-400 animate-pulse">
                      Đang tìm sản phẩm...
                    </div>
                  ) : (
                    productsData?.items?.map((p: Product) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          setSelectedVariantId('');
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border flex items-center justify-between gap-4 ${
                          selectedProductId === p.id
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium shadow-sm'
                            : 'border-transparent hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {/* Bên trái: Thông tin chữ */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="text-[10px] opacity-60 font-normal uppercase tracking-tight">
                            {p.brand} • {p.category}
                          </p>
                        </div>

                        {/* Bên phải: Ảnh sản phẩm */}
                        <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-white">
                          {p.imageUrl && p.imageUrl.length > 0 ? (
                            <img
                              src={p.imageUrl[0].imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </section>

              {/* --- PHẦN 2: CHỌN BIẾN THỂ (CHỈ HIỆN KHI ĐÃ CHỌN SP) --- */}
              {selectedProductId && (
                <section className="space-y-3 pt-4 border-t border-dashed animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      2. Chọn màu sắc / Size
                    </label>
                    {variantsData?.totalPages && variantsData.totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={variantPage === 0}
                          onClick={() => setVariantPage((p) => p - 1)}
                          className="p-1 border rounded hover:bg-gray-50 disabled:opacity-30 text-xs"
                        >
                          &lt;
                        </button>
                        <span className="text-[10px] font-medium text-gray-500">
                          Trang {variantPage + 1}
                        </span>
                        <button
                          disabled={variantPage >= variantsData.totalPages - 1}
                          onClick={() => setVariantPage((p) => p + 1)}
                          className="p-1 border rounded hover:bg-gray-50 disabled:opacity-30 text-xs"
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {isLoadingVariants ? (
                      <div className="col-span-2 py-4 text-center text-xs text-gray-400">
                        Đang tải biến thể...
                      </div>
                    ) : (
                      variantsData?.items?.map((v: ProductVariant) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${
                            selectedVariantId === v.id
                              ? 'border-rose-500 bg-rose-50 text-rose-700 ring-1 ring-rose-500'
                              : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'
                          }`}
                        >
                          <p className="font-bold truncate">{v.colorName}</p>
                          <p className="text-[10px] opacity-60">
                            Size: {v.sizeLabel} | Kho: {v.quantity}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </section>
              )}

              <div className="flex gap-3 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Đóng
                </button>
                <button
                  disabled={!selectedVariantId || isActivating}
                  onClick={handleInActivate}
                  className="flex-[2] py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-40 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
                >
                  {isActivating && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Vô hiệu hóa & Tiếp tục
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase">
                    Phát hiện ảnh hưởng
                  </p>
                  <h4 className="text-xl font-black text-indigo-900">
                    {affectedItems.length} <span className="text-sm font-medium">đơn hàng</span>
                  </h4>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Quay lại sửa
                </button>
              </div>

              {isFetchingOrders ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-400">Đang quét dữ liệu đơn hàng...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                  {affectedItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <span className="font-bold text-gray-700 text-xs">
                        #{item.order.orderId.slice(-8).toUpperCase()}
                      </span>
                      <span className="font-black text-indigo-600 text-xs">
                        {fmt(item.order.paidAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleCreateBatch}
                  disabled={isCreating || affectedItems.length === 0}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'XÁC NHẬN TẠO BATCH'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
