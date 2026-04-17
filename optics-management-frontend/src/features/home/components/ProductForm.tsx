import { useState } from 'react';
import { ShoppingBag, Info, CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { useCartStore } from '@/features/cart/store/useCartStore';
import PrescriptionWidget from './PrescriptionModal';
import { useProduct } from '../hooks/useProducts';
import { useLenses } from '@/features/manager/hooks/useLense';
import type { LensProduct } from '@/features/manager/types/lens';
// Import hook lấy danh sách variant
import { useProductVariants } from '../hooks/useProductVariants';
import type { ProductImage, ProductVariant } from '../types/product-type';
import { toast } from 'sonner';

export default function ProductForm({ productId }: { productId: string }) {
  // --- STATE GIAO DIỆN ---
  const [isLensSelectionOpen, setIsLensSelectionOpen] = useState(true);
  const [expandedLensId, setExpandedLensId] = useState<string | null>(null);

  // Phân trang tròng kính
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // --- FETCH DATA ---
  const { data: product, isLoading: isProductLoading } = useProduct(productId);
  const { lenses, isLoading: isLensesLoading } = useLenses();
  const { data: variants = [], isLoading: isVariantsLoading } = useProductVariants(productId);

  // --- LOGIC PHÂN TRANG LENS ---
  const totalLenses = lenses?.length || 0;
  const totalPages = Math.ceil(totalLenses / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaginatedLenses = lenses?.slice(startIndex, startIndex + itemsPerPage) || [];

  // --- STORES ---
  const { selectedLensId, setLensId, prescription, resetPrescription } = usePrescriptionStore();
  const { addToCart } = useCartStore();

  const currentLens = lenses?.find((l: LensProduct) => l.id === selectedLensId);

  // --- LOGIC CHỌN VARIANT (DERIVED STATE) ---
  // Chỉ lưu ID của variant được chọn
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Suy luận variant object dựa trên ID hoặc lấy cái đầu tiên
  const selectedVariant = selectedVariantId
    ? variants.find((v) => v.id === selectedVariantId) || variants[0]
    : variants[0] || null;

  // --- TÍNH TỔNG TIỀN ---
  const basePrice = selectedVariant?.price || 0;
  const lensPrice = currentLens?.price || 0;
  const totalPrice = basePrice + lensPrice;

  // --- HANDLER: ADD TO CART TRỰC TIẾP ---
  const handleAddToCart = () => {
    if (!product) return;

    // Validate 1: Bắt buộc chọn gọng
    if (!selectedVariant) {
      toast.error('Vui lòng chọn phiên bản gọng kính!');
      return;
    }

    // --- KIỂM TRA DỮ LIỆU ĐƠN THUỐC ---
    const isValueEmpty = (val: unknown) => {
      if (val === null || val === undefined) return true;
      const strVal = String(val).trim().toLowerCase();
      // Bổ sung thêm các trường hợp rỗng phổ biến
      return ['', '0', '0.00', '+0.00', '-0.00', '0.0', 'plan', 'none'].includes(strVal);
    };

    const isOdHasData = Boolean(
      prescription?.od && Object.values(prescription.od).some((val) => !isValueEmpty(val)),
    );
    const isOsHasData = Boolean(
      prescription?.os && Object.values(prescription.os).some((val) => !isValueEmpty(val)),
    );

    const hasPrescriptionData = Boolean(
      prescription?.imageUrl ||
      (prescription?.notes && String(prescription.notes).trim() !== '') ||
      isOdHasData ||
      isOsHasData,
    );
    const finalOrderType: 'buy-now' | 'pre-order' | 'custom' =
      selectedVariant.orderItemType === 'PRE_ORDER'
        ? 'pre-order'
        : hasPrescriptionData
          ? 'custom'
          : 'buy-now';

    // --- ĐIỀU KIỆN CHẶN TỐI THƯỢNG ---
    // Thay vì check ID (dễ bị dính chuỗi 'null' ảo), ta check thẳng object currentLens.
    // Nếu currentLens không tồn tại -> Chắc chắn chưa chọn tròng kính hợp lệ!
    const isLensNotSelected = !currentLens;

    // Validate 2: NẾU có đơn thuốc THÌ BẮT BUỘC phải có Tròng kính hợp lệ
    if (hasPrescriptionData && isLensNotSelected) {
      toast.error('Bạn đã nhập thông số mắt hoặc đơn thuốc. Vui lòng chọn Tròng kính phù hợp!');
      setIsLensSelectionOpen(true); // Mở lại tab chọn tròng

      // Cuộn màn hình xuống khu vực chọn tròng kính
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

      return; // CHẶN LẠI NGAY LẬP TỨC
    }

    // --- TIẾN HÀNH THÊM VÀO GIỎ HÀNG ---
    const images = Array.isArray(product.imageUrl)
      ? product.imageUrl.map((imgObj: ProductImage) => imgObj.imageUrl)
      : [];
    const safeProductImage =
      images.length > 0
        ? images[0]
        : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800';

    const prescriptionToSave = hasPrescriptionData
      ? {
          imageUrl: prescription.imageUrl || null,
          notes: prescription.notes || '',
          od: { ...prescription.od },
          os: { ...prescription.os },
        }
      : null;

    const cartPayload = {
      productId: selectedVariant.id,
      name: `${product.name} - ${selectedVariant.colorName || 'Mặc định'} (${selectedVariant.sizeLabel || ''})`,
      price: totalPrice,
      image: safeProductImage,
      quantity: 1,
      lensId: currentLens?.id,
      orderType: finalOrderType,
      prescription: prescriptionToSave,
    };

    addToCart(cartPayload);

    setTimeout(() => {
      resetPrescription();
      setIsLensSelectionOpen(true);
    }, 200);

    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };
  if (isProductLoading)
    return (
      <div className="p-10 text-center animate-pulse text-gray-400">
        Đang tải thông tin sản phẩm...
      </div>
    );

  return (
    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-8 mt-8">
      {/* 1. CHỌN PHIÊN BẢN (GẮN LUÔN Ở ĐÂY) */}
      <div className="space-y-3">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-sm font-bold text-[#4A8795] uppercase tracking-wider">
            1. Chọn phiên bản gọng
          </h3>
        </div>

        {isVariantsLoading ? (
          <div className="animate-pulse h-24 bg-gray-200 rounded-xl w-full" />
        ) : variants.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Sản phẩm hiện chưa có phân loại.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {variants.map((variant: ProductVariant) => {
              const isSelected = selectedVariant?.id === variant.id;

              // Xác định trạng thái để hiển thị màu sắc cho phù hợp
              const isPreOrder = variant.orderItemType === 'PRE_ORDER';

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`relative flex items-start gap-4 p-4 w-full text-left rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-[#4A8795] bg-teal-50/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* ICON CHECK */}
                  <div className="mt-0.5 shrink-0 text-[#4A8795]">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 fill-[#4A8795] text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* THÔNG TIN VARIANT (MÀU + SIZE) */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base uppercase tracking-wide">
                      {variant.colorName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                        Size {variant.sizeLabel}
                      </span>
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        {variant.lensWidthMm}-{variant.bridgeWidthMm}-{variant.templeLengthMm} mm
                      </span>
                      {variant.frameFinish && (
                        <>
                          <span className="text-gray-300 text-xs">•</span>
                          <span className="text-xs text-gray-500">{variant.frameFinish}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CỘT PHẢI: GIÁ + TRẠNG THÁI HÀNG */}
                  <div className="text-right flex flex-col items-end shrink-0 gap-1.5">
                    <p className="font-bold text-[#4A8795] text-base">
                      {variant.price.toLocaleString('vi-VN')} ₫
                    </p>
                    {/* UI TRẠNG THÁI */}
                    {isPreOrder ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 rounded-sm border border-orange-200">
                        Đặt trước
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 rounded-sm border border-green-200">
                        Có sẵn
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. PRESCRIPTION */}
      <div>
        <h3 className="text-sm font-bold text-[#4A8795] uppercase mb-3">2. Đơn thuốc</h3>
        <PrescriptionWidget />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#4A8795] uppercase">3. Lựa chọn thấu kính</h3>
          {isLensSelectionOpen && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-gray-500">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {isLensesLoading ? (
          <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
        ) : (
          <div className="relative">
            {/* 🚀 TRẠNG THÁI THU GỌN: Chỉ hiện khi khách ĐÃ thực hiện hành động chọn (ID có thể là null hoặc string) */}
            {!isLensSelectionOpen && (
              <div className="bg-white border-2 border-[#4A8795] rounded-xl p-4 flex justify-between items-center animate-in fade-in slide-in-from-top-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#4A8795]" />
                  <div>
                    <p className="text-gray-900 font-bold">
                      {currentLens ? currentLens.name : 'Chỉ mua gọng (Không kèm tròng)'}
                    </p>
                    <p className="text-[#4A8795] text-sm font-medium">
                      {currentLens
                        ? currentLens.price === 0
                          ? 'Miễn phí'
                          : `+ ${currentLens.price.toLocaleString('vi-VN')} ₫`
                        : 'Sử dụng tròng mẫu mặc định'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Nếu đang là một tròng kính cụ thể thì mới hiện nút "Bỏ chọn" để về null */}
                  {selectedLensId !== null && (
                    <button
                      onClick={() => setLensId(null)}
                      className="text-sm font-medium text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Bỏ chọn
                    </button>
                  )}
                  <button
                    onClick={() => setIsLensSelectionOpen(true)}
                    className="text-sm font-medium text-gray-500 hover:text-[#4A8795] transition-colors"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>
            )}

            {/* 🚀 TRẠNG THÁI MỞ: Ép khách phải chọn 1 trong các option dưới đây */}
            {isLensSelectionOpen && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-300">
                {/* LỰA CHỌN NULL: Khách phải click vào đây nếu không muốn lấy tròng */}
                <div
                  className={`border-2 rounded-xl bg-white cursor-pointer transition-all ${selectedLensId === null ? 'border-[#4A8795] shadow-sm bg-teal-50/10' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => {
                    setLensId(null);
                    setIsLensSelectionOpen(false); // Chỉ đóng khi khách đã chọn
                  }}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedLensId === null ? 'border-[#4A8795]' : 'border-gray-300'}`}
                    >
                      {selectedLensId === null && (
                        <div className="w-2.5 h-2.5 bg-[#4A8795] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold ${selectedLensId === null ? 'text-[#4A8795]' : 'text-gray-900'}`}
                      >
                        Chỉ mua gọng (Không kèm tròng)
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Sử dụng tròng nhựa mẫu mặc định của nhà sản xuất.
                      </p>
                    </div>
                  </div>
                </div>

                {/* DANH SÁCH LENS: Khách click vào ID bất kỳ */}
                {currentPaginatedLenses.map((lens: LensProduct) => (
                  <div
                    key={lens.id}
                    className={`border-2 rounded-xl bg-white cursor-pointer transition-all ${selectedLensId === lens.id ? 'border-[#4A8795] shadow-sm bg-teal-50/10' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => {
                      setLensId(lens.id);
                      setIsLensSelectionOpen(false); // Đóng lại sau khi chọn thành công
                    }}
                  >
                    <div className="p-4 flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedLensId === lens.id ? 'border-[#4A8795]' : 'border-gray-300'}`}
                      >
                        {selectedLensId === lens.id && (
                          <div className="w-2.5 h-2.5 bg-[#4A8795] rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4
                            className={`font-bold ${selectedLensId === lens.id ? 'text-[#4A8795]' : 'text-gray-900'}`}
                          >
                            {lens.name}
                          </h4>
                          <span className="font-bold text-gray-900 whitespace-nowrap ml-2">
                            {lens.price === 0
                              ? 'Included'
                              : `+${lens.price.toLocaleString('vi-VN')}đ`}
                          </span>
                        </div>
                        {/* Phần info mở rộng giữ nguyên */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedLensId(expandedLensId === lens.id ? null : lens.id);
                          }}
                          className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"
                        >
                          <Info className="w-3.5 h-3.5" />
                          {expandedLensId === lens.id ? 'Đóng' : 'Thông số'}
                        </button>
                      </div>
                    </div>
                    {expandedLensId === lens.id && (
                      <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 ml-8 animate-in slide-in-from-top-1">
                        <p>
                          <span className="font-semibold text-gray-900">Chất liệu:</span>{' '}
                          {lens.material || 'Tiêu chuẩn'}
                        </p>
                        <p>{lens.description || 'Không có mô tả chi tiết.'}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. HIỂN THỊ TỔNG TIỀN VÀ NÚT MUA HÀNG TRỰC TIẾP */}
      <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng thanh toán</p>
            {selectedVariant && (
              <p className="text-xs text-gray-400 mt-0.5">
                Gọng: {basePrice.toLocaleString()}đ{' '}
                {currentLens ? `+ Tròng: ${lensPrice.toLocaleString()}đ` : ''}
              </p>
            )}
          </div>
          <p className="text-2xl font-black text-[#1e2575]">
            {totalPrice.toLocaleString('vi-VN')} ₫
          </p>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full h-14 text-lg font-bold bg-[#1e2575] hover:bg-[#151b54] shadow-lg transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  );
}
