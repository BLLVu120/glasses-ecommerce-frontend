import { useState } from 'react';
import { ShoppingBag, Info, CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { useCartStore } from '@/features/cart/store/useCartStore';
import PrescriptionWidget from './PrescriptionModal';
import { useProduct } from '../hooks/useProducts';
import { useLenses } from '../hooks/useLenses';
import { useProductVariants } from '../hooks/useProductVariants';
import type { LensProduct, ProductImage, ProductVariant } from '../types/product-type';
import { toast } from 'sonner';

// ============================================
// HELPER FUNCTIONS: Kiểm tra dữ liệu đơn thuốc
// ============================================

/**
 * Kiểm tra một giá trị có rỗng hay không
 * Các giá trị rỗng bao gồm: null, undefined, chuỗi rỗng, "0", "plan", "none", etc.
 */
const isValueEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  const strVal = String(val).trim().toLowerCase();
  return ['', '0', '0.00', '+0.00', '-0.00', '0.0', 'plan', 'none'].includes(strVal);
};

/**
 * Kiểm tra một mắt (OD/OS) có dữ liệu hay không
 * Trả về true nếu có ít nhất một trường không rỗng
 */
const eyeHasData = (
  eye?: {
    sphere?: string;
    cylinder?: string;
    axis?: string;
    add?: string;
    pd?: string;
  },
): boolean =>
  Boolean(eye && Object.values(eye).some((val) => !isValueEmpty(val)));

/**
 * Tạo cart payload từ sản phẩm + variant + đơn thuốc
 * Xử lý logic tách image, xây dựng tên sản phẩm, và đóng gói đơn thuốc
 */
const createCartPayload = (
  product: { name: string; imageUrl: ProductImage[] },
  selectedVariant: ProductVariant,
  currentLens: LensProduct | undefined,
  totalPrice: number,
  hasPrescriptionData: boolean,
  prescription: {
    imageUrl: string | null;
    notes: string;
    od: { sphere?: string; cylinder?: string; axis?: string; add?: string; pd?: string };
    os: { sphere?: string; cylinder?: string; axis?: string; add?: string; pd?: string };
  },
  finalOrderType: 'buy-now' | 'pre-order' | 'custom',
) => {
  // Tách danh sách ảnh từ product object
  const images = Array.isArray(product.imageUrl)
    ? product.imageUrl.map((imgObj: ProductImage) => imgObj.imageUrl)
    : [];

  // Chọn ảnh đầu tiên nếu có, không thì dùng fallback
  const safeProductImage =
    images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800';

  // Sao chép đơn thuốc nếu có, nếu không để null
  const prescriptionToSave = hasPrescriptionData
    ? {
        imageUrl: prescription.imageUrl || null,
        notes: prescription.notes || '',
        od: {
          sphere: prescription.od?.sphere ?? '',
          cylinder: prescription.od?.cylinder ?? '',
          axis: prescription.od?.axis ?? '',
          add: prescription.od?.add ?? '',
          pd: prescription.od?.pd ?? '',
        },
        os: {
          sphere: prescription.os?.sphere ?? '',
          cylinder: prescription.os?.cylinder ?? '',
          axis: prescription.os?.axis ?? '',
          add: prescription.os?.add ?? '',
          pd: prescription.os?.pd ?? '',
        },
      }
    : null;

  // Tạo tên sản phẩm đầy đủ: [Tên] - [Màu] ([Size])
  return {
    productId: selectedVariant.id,
    name: `${product.name} - ${selectedVariant.colorName || 'Mặc định'} (${selectedVariant.sizeLabel || ''})`,
    price: totalPrice,
    image: safeProductImage,
    quantity: 1,
    lensId: currentLens?.id,
    orderType: finalOrderType,
    prescription: prescriptionToSave,
  };
};

export default function ProductForm({ productId }: { productId: string }) {
  // ============================================
  // STATE: Giao diện & Phân trang
  // ============================================

  /** Điều khiển mở/đóng danh sách chọn tròng kính */
  const [isLensSelectionOpen, setIsLensSelectionOpen] = useState(true);

  /** Lưu ID tròng kính nào đang xem thông tin chi tiết */
  const [expandedLensId, setExpandedLensId] = useState<string | null>(null);

  /** Trang hiện tại khi phân trang danh sách tròng kính */
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================
  // DATA FETCHING: Tải dữ liệu từ API
  // ============================================

  const { data: product, isLoading: isProductLoading } = useProduct(productId);
  const { lenses, isLoading: isLensesLoading } = useLenses();
  const { data: variants = [], isLoading: isVariantsLoading } = useProductVariants(productId);

  // ============================================
  // STATE: Lựa chọn của người dùng
  // ============================================

  /** Lưu ID variant gọng được chọn */
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // ============================================
  // DERIVED STATE: Tính toán từ state hiện tại
  // ============================================

  /** Số lượng tròng kính hiển thị trên mỗi trang */
  const itemsPerPage = 3;

  /** Tổng số trang phân trang */
  const totalPages = Math.ceil((lenses?.length || 0) / itemsPerPage);

  /** Chỉ số bắt đầu trong mảng lenses */
  const startIndex = (currentPage - 1) * itemsPerPage;

  /** Mảng tròng kính của trang hiện tại */
  const currentPaginatedLenses = lenses?.slice(startIndex, startIndex + itemsPerPage) || [];

  /** Variant gọng được chọn (lấy từ ID hoặc mặc định variant đầu tiên) */
  const selectedVariant = selectedVariantId
    ? variants.find((v) => v.id === selectedVariantId) || variants[0]
    : variants[0] || null;

  // ============================================
  // STORES: Lấy dữ liệu từ global state
  // ============================================

  const { selectedLensId, setLensId, prescription, resetPrescription } = usePrescriptionStore();
  const { addToCart } = useCartStore();

  /** Tròng kính được chọn dựa vào selectedLensId từ store */
  const currentLens = lenses?.find((l: LensProduct) => l.id === selectedLensId);

  // ============================================
  // PRICING: Tính toán giá
  // ============================================

  const basePrice = selectedVariant?.price || 0;
  const lensPrice = currentLens?.price || 0;
  const totalPrice = basePrice + lensPrice;

  // ============================================
  // PRESCRIPTION VALIDATION: Kiểm tra dữ liệu đơn thuốc
  // ============================================

  /** Có ảnh đơn thuốc từ bác sĩ hay không */
  const hasDoctorPrescriptionImage = Boolean(prescription?.imageUrl?.trim());

  /** Có dữ liệu cả mắt trái lẫn mắt phải hay không */
  const hasBothEyesSpecs = eyeHasData(prescription?.od) && eyeHasData(prescription?.os);

  /** Đơn thuốc hợp lệ khi chọn tròng kính (ảnh hoặc spec cả 2 mắt) */
  const hasRequiredPrescriptionForLens = hasDoctorPrescriptionImage || hasBothEyesSpecs;

  /** Người dùng đã nhập BẤT KỲ dữ liệu đơn thuốc nào hay không */
  const hasAnyPrescriptionData = Boolean(
    hasDoctorPrescriptionImage ||
      eyeHasData(prescription?.od) ||
      eyeHasData(prescription?.os) ||
      (prescription?.notes && String(prescription.notes).trim() !== ''),
  );

  /** Đã chọn tròng kính hay không */
  const isLensSelected = Boolean(currentLens);

  /** Chặn nút "Thêm vào giỏ" nếu chọn tròng nhưng thiếu đơn thuốc */
  const isAddToCartBlockedByPrescriptionRule = isLensSelected && !hasRequiredPrescriptionForLens;

  // ============================================
  // HANDLERS: Xử lý sự kiện chính
  // ============================================

  /**
   * Xử lý thêm sản phẩm vào giỏ hàng
   * 
   * Quy trình:
   * 1. Kiểm tra tất cả điều kiện tiên quyết
   * 2. Xác định loại đơn hàng (buy-now, pre-order, custom)
   * 3. Tạo payload và thêm vào cart store
   * 4. Reset state và hiển thị thông báo thành công
   */
  const handleAddToCart = () => {
    // Bước 1: Kiểm tra sản phẩm tồn tại
    if (!product) return;

    // Bước 2: Kiểm tra gọng kính được chọn
    if (!selectedVariant) {
      toast.error('Vui lòng chọn phiên bản gọng kính!');
      return;
    }

    // Bước 3: Kiểm tra nếu chọn tròng thì PHẢI có đơn đo mắt
    if (isAddToCartBlockedByPrescriptionRule) {
      toast.error(
        'Khi chọn tròng kính, bạn cần tải đơn đo mắt hoặc nhập thông số mắt trái và mắt phải.',
      );
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    // Bước 4: Xác định loại đơn hàng dựa trên trạng thái
    const hasPrescriptionData = hasRequiredPrescriptionForLens;
    const finalOrderType: 'buy-now' | 'pre-order' | 'custom' =
      selectedVariant.orderItemType === 'PRE_ORDER'
        ? 'pre-order' // Nếu gọng là đặt trước
        : hasPrescriptionData
          ? 'custom' // Nếu có đơn thuốc → đơn custom
          : 'buy-now'; // Nếu không có đơn → mua thường

    // Bước 5: Kiểm tra quy tắc cuối cùng - Nếu nhập đơn thuốc phải chọn tròng
    // (Không check ID vì dễ gặp lỗi, check object trực tiếp)
    const isLensNotSelected = !currentLens;
    if (hasAnyPrescriptionData && isLensNotSelected) {
      toast.error('Bạn đã nhập thông số mắt hoặc đơn thuốc. Vui lòng chọn Tròng kính phù hợp!');
      setIsLensSelectionOpen(true); // Mở danh sách tròng để người dùng chọn
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }

    // Bước 6: Tạo payload từ dữ liệu đã xác nhận
    const cartPayload = createCartPayload(
      product,
      selectedVariant,
      currentLens,
      totalPrice,
      hasPrescriptionData,
      prescription,
      finalOrderType,
    );

    // Bước 7: Thêm vào giỏ hàng
    addToCart(cartPayload);

    // Bước 8: Reset state sau khi thêm thành công (delay nhẹ để thấy animation)
    setTimeout(() => {
      resetPrescription(); // Xóa thông tin đơn thuốc để sẵn sàng cho sản phẩm tiếp theo
      setIsLensSelectionOpen(true); // Mở lại phần chọn tròng
    }, 200);

    // Bước 9: Hiển thị thông báo thành công
    toast.success('Đã thêm sản phẩm vào giỏ hàng!');
  };
  // ============================================
  // LOADING STATE: Hiển thị khi đang tải dữ liệu sản phẩm
  // ============================================
  if (isProductLoading)
    return (
      <div className="p-10 text-center animate-pulse text-gray-400">
        Đang tải thông tin sản phẩm...
      </div>
    );

  // ============================================
  // JSX: Render giao diện form
  // ============================================
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8 mt-8">
      {/* 
        ========================================
        PHẦN 1: CHỌN PHIÊN BẢN GỌNG KÍNH
        ======================================== 
        
        Cho phép người dùng lựa chọn:
        - Màu sắc
        - Kích thước (Size)
        - Xem đặc tính kỹ thuật (mm)
        
        Hiển thị:
        - Giá gọng
        - Trạng thái (Có sẵn / Đặt trước)
      */}
      <SectionVariants
        isLoading={isVariantsLoading}
        variants={variants}
        selectedVariant={selectedVariant}
        onSelectVariant={setSelectedVariantId}
      />

      {/* 
        ========================================
        PHẦN 2: CHỌN THẤU KÍNH (TRÒNG KÍNH)
        ======================================== 
        
        Cho phép người dùng lựa chọn:
        - Không lấy tròng (chỉ mua gọng)
        - Chọn tròng kính từ danh sách
        
        Bao gồm:
        - Phân trang nếu có nhiều tròng
        - Xem chi tiết từng tròng kính
        - Hiển thị giá tròng (có thể miễn phí)
      */}
      <SectionLenses
        isLoading={isLensesLoading}
        currentPaginatedLenses={currentPaginatedLenses}
        selectedLensId={selectedLensId}
        currentLens={currentLens}
        isLensSelectionOpen={isLensSelectionOpen}
        expandedLensId={expandedLensId}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectLens={setLensId}
        onToggleLensSelection={setIsLensSelectionOpen}
        onToggleExpanded={setExpandedLensId}
        onPageChange={setCurrentPage}
      />

      {/* 
        ========================================
        PHẦN 3: NHẬP THÔNG TIN ĐƠN THUỐC
        ======================================== 
        
        Cho phép người dùng:
        - Tải ảnh đơn thuốc từ bác sĩ
        - Nhập thông số cận + loạn + trục cho từng mắt
        - Thêm ghi chú cho kỹ thuật viên
      */}
      <div>
        <h3 className="mb-3 flex items-center gap-3 text-sm font-black text-gray-900 uppercase tracking-[0.18em]">
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#4A8795]/10 px-2 text-xs font-black text-[#4A8795]">
            3
          </span>
          Đơn thuốc
        </h3>
        <PrescriptionWidget />
      </div>

      {/* 
        ========================================
        PHẦN 4: TỔNG TIỀN & NÚT THANH TOÁN
        ======================================== 
        
        Hiển thị:
        - Chi tiết giá gọng + giá tròng
        - Tổng tiền cần thanh toán
        - Nút "Thêm vào giỏ hàng" với validation
        - Thông báo lỗi nếu chọn tròng nhưng thiếu đơn thuốc
      */}
      <SectionCheckout
        selectedVariant={selectedVariant}
        basePrice={basePrice}
        currentLens={currentLens}
        lensPrice={lensPrice}
        totalPrice={totalPrice}
        isAddToCartBlocked={isAddToCartBlockedByPrescriptionRule}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

// ============================================
// SUB-COMPONENT 1: Lựa chọn phiên bản gọng
// ============================================

interface SectionVariantsProps {
  isLoading: boolean;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (id: string) => void;
}

function SectionVariants({
  isLoading,
  variants,
  selectedVariant,
  onSelectVariant,
}: SectionVariantsProps) {
  return (
    <div className="space-y-3">
      {/* Tiêu đề phần 1 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#4A8795]/10 px-2 text-xs font-black text-[#4A8795]">
            1
          </span>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.18em]">
            Chọn phiên bản gọng
          </h3>
        </div>
      </div>

      {/* Nội dung */}
      {isLoading ? (
        <div className="animate-pulse h-24 bg-gray-100 rounded-2xl w-full" />
      ) : variants.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Sản phẩm hiện chưa có phân loại.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {variants.map((variant: ProductVariant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const isPreOrder = variant.orderItemType === 'PRE_ORDER';

            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant.id)}
                className={`relative flex items-start gap-4 p-4 w-full text-left rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#4A8795]/30 bg-[#4A8795]/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
                    : 'border-gray-200 bg-[#F8FAFB] hover:border-[#4A8795]/20 hover:bg-white'
                }`}
              >
                {/* Icon check */}
                <div className="mt-0.5 shrink-0 text-[#4A8795]">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 fill-[#4A8795] text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                {/* Thông tin variant */}
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-base uppercase tracking-wide">
                    {variant.colorName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-white text-gray-700 rounded-md border border-gray-200">
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

                {/* Giá + Trạng thái */}
                <div className="text-right flex flex-col items-end shrink-0 gap-1.5">
                  <p className="font-bold text-[#4A8795] text-base">
                    {variant.price.toLocaleString('vi-VN')} ₫
                  </p>
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
  );
}

// ============================================
// SUB-COMPONENT 2: Lựa chọn thấu kính (tròng)
// ============================================

interface SectionLensesProps {
  isLoading: boolean;
  currentPaginatedLenses: LensProduct[];
  selectedLensId: string | null;
  currentLens: LensProduct | undefined;
  isLensSelectionOpen: boolean;
  expandedLensId: string | null;
  currentPage: number;
  totalPages: number;
  onSelectLens: (id: string | null) => void;
  onToggleLensSelection: (isOpen: boolean) => void;
  onToggleExpanded: (id: string | null) => void;
  onPageChange: (page: number) => void;
}

function SectionLenses({
  isLoading,
  currentPaginatedLenses,
  selectedLensId,
  currentLens,
  isLensSelectionOpen,
  expandedLensId,
  currentPage,
  totalPages,
  onSelectLens,
  onToggleLensSelection,
  onToggleExpanded,
  onPageChange,
}: SectionLensesProps) {
  return (
    <div>
      {/* Tiêu đề + Phân trang */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#4A8795]/10 px-2 text-xs font-black text-[#4A8795]">
            2
          </span>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.18em]">
            Lựa chọn thấu kính
          </h3>
        </div>

        {/* Phân trang - chỉ hiển thị khi mở danh sách và có nhiều trang */}
        {isLensSelectionOpen && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg bg-white border border-gray-200 text-gray-700 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-500">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg bg-white border border-gray-200 text-gray-700 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Nội dung */}
      {isLoading ? (
        <div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
      ) : (
        <div className="relative">
          {/* 
            TRẠNG THÁI THU GỌN: 
            Hiển thị khi người dùng đã chọn xong (mở: false)
            Cho phép xem tóm tắt lựa chọn và nút "Thay đổi"
          */}
          {!isLensSelectionOpen && (
            <CollapsedLensSelection
              currentLens={currentLens}
              selectedLensId={selectedLensId}
              onToggleOpen={() => onToggleLensSelection(true)}
              onClear={() => onSelectLens(null)}
            />
          )}

          {/* 
            TRẠNG THÁI MỞ: 
            Hiển thị khi người dùng chọn "Thay đổi" (mở: true)
            Buộc người dùng phải chọn 1 trong các option
          */}
          {isLensSelectionOpen && (
            <ExpandedLensSelection
              currentPaginatedLenses={currentPaginatedLenses}
              selectedLensId={selectedLensId}
              expandedLensId={expandedLensId}
              onSelectLens={onSelectLens}
              onToggleExpanded={onToggleExpanded}
              onDone={() => onToggleLensSelection(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-SUB-COMPONENT: Trạng thái thu gọn lens
// ============================================

interface CollapsedLensSelectionProps {
  currentLens: LensProduct | undefined;
  selectedLensId: string | null;
  onToggleOpen: () => void;
  onClear: () => void;
}

function CollapsedLensSelection({
  currentLens,
  selectedLensId,
  onToggleOpen,
  onClear,
}: CollapsedLensSelectionProps) {
  return (
    <div className="bg-white border border-[#4A8795]/30 rounded-2xl p-4 flex justify-between items-center animate-in fade-in slide-in-from-top-2 shadow-sm">
      {/* Thông tin tròng được chọn */}
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

      {/* Các nút hành động */}
      <div className="flex items-center gap-4">
        {/* Nút "Bỏ chọn" - chỉ hiện khi đang chọn tròng cụ thể (không phải null) */}
        {selectedLensId !== null && (
          <button
            onClick={onClear}
            className="text-sm font-medium text-rose-500 hover:text-rose-700 transition-colors"
          >
            Bỏ chọn
          </button>
        )}
        {/* Nút "Thay đổi" - cho phép mở lại danh sách để chọn lại */}
        <button
          onClick={onToggleOpen}
          className="text-sm font-medium text-gray-500 hover:text-[#4A8795] transition-colors"
        >
          Thay đổi
        </button>
      </div>
    </div>
  );
}

// ============================================
// SUB-SUB-COMPONENT: Trạng thái mở lens
// ============================================

interface ExpandedLensSelectionProps {
  currentPaginatedLenses: LensProduct[];
  selectedLensId: string | null;
  expandedLensId: string | null;
  onSelectLens: (id: string | null) => void;
  onToggleExpanded: (id: string | null) => void;
  onDone: () => void;
}

function ExpandedLensSelection({
  currentPaginatedLenses,
  selectedLensId,
  expandedLensId,
  onSelectLens,
  onToggleExpanded,
  onDone,
}: ExpandedLensSelectionProps) {
  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      {/* 
        OPTION 1: Không lấy tròng kính - Chỉ mua gọng
        Khi click, set selectedLensId = null và đóng danh sách
      */}
      <LensOption
        isSelected={selectedLensId === null}
        onSelect={() => {
          onSelectLens(null);
          onDone(); // Đóng danh sách sau khi chọn
        }}
        title="Chỉ mua gọng (Không kèm tròng)"
        subtitle="Sử dụng tròng nhựa mẫu mặc định của nhà sản xuất."
        price={null}
      />

      {/* 
        OPTION 2+: Danh sách tròng kính có sẵn
        Mỗi tròng kính có thể bấm để xem chi tiết
      */}
      {currentPaginatedLenses.map((lens: LensProduct) => (
        <LensOption
          key={lens.id}
          isSelected={selectedLensId === lens.id}
          onSelect={() => {
            onSelectLens(lens.id);
            onDone(); // Đóng danh sách sau khi chọn
          }}
          onToggleDetails={() =>
            onToggleExpanded(expandedLensId === lens.id ? null : lens.id)
          }
          showDetails={expandedLensId === lens.id}
          title={lens.name}
          price={lens.price}
          material={lens.material}
          description={lens.description}
        />
      ))}
    </div>
  );
}

// ============================================
// SUB-SUB-SUB-COMPONENT: Một option tròng kính
// ============================================

interface LensOptionProps {
  isSelected: boolean;
  onSelect: () => void;
  onToggleDetails?: () => void;
  showDetails?: boolean;
  title: string;
  subtitle?: string;
  price: number | null;
  material?: string;
  description?: string;
}

function LensOption({
  isSelected,
  onSelect,
  onToggleDetails,
  showDetails = false,
  title,
  subtitle,
  price,
  material,
  description,
}: LensOptionProps) {
  return (
    <div
      className={`border rounded-2xl bg-[#F8FAFB] cursor-pointer transition-all ${
        isSelected
          ? 'border-[#4A8795]/30 shadow-sm bg-[#4A8795]/5'
          : 'border-gray-200 hover:border-[#4A8795]/20 hover:bg-white'
      }`}
      onClick={onSelect}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Radio button */}
        <div
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            isSelected ? 'border-[#4A8795]' : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 bg-[#4A8795] rounded-full" />
          )}
        </div>

        {/* Thông tin */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4
              className={`font-bold ${
                isSelected ? 'text-[#4A8795]' : 'text-gray-900'
              }`}
            >
              {title}
            </h4>
            {/* Hiển thị giá nếu đó là tròng cụ thể (không phải "chỉ mua gọng") */}
            {price !== null && (
              <span className="font-bold text-gray-900 whitespace-nowrap ml-2">
                {price === 0 ? 'Included' : `+${price.toLocaleString('vi-VN')}đ`}
              </span>
            )}
          </div>

          {/* Subtitle cho option "Chỉ mua gọng" */}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}

          {/* Nút xem thông số chi tiết - chỉ có cho tròng cụ thể */}
          {onToggleDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleDetails();
              }}
              className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"
            >
              <Info className="w-3.5 h-3.5" />
              {showDetails ? 'Đóng' : 'Thông số'}
            </button>
          )}
        </div>
      </div>

      {/* Chi tiết mở rộng khi bấm "Thông số" */}
      {showDetails && (material || description) && (
        <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 ml-8 animate-in slide-in-from-top-1">
          {material && (
            <p>
              <span className="font-semibold text-gray-900">Chất liệu:</span>{' '}
              {material}
            </p>
          )}
          <p>{description || 'Không có mô tả chi tiết.'}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENT 3: Tổng tiền & nút thanh toán
// ============================================

interface SectionCheckoutProps {
  selectedVariant: ProductVariant | null;
  basePrice: number;
  currentLens: LensProduct | undefined;
  lensPrice: number;
  totalPrice: number;
  isAddToCartBlocked: boolean;
  onAddToCart: () => void;
}

function SectionCheckout({
  selectedVariant,
  basePrice,
  currentLens,
  lensPrice,
  totalPrice,
  isAddToCartBlocked,
  onAddToCart,
}: SectionCheckoutProps) {
  return (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
      {/* Hiển thị chi tiết giá */}
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
        {/* Tổng tiền - Highlight màu accent */}
        <p className="text-2xl font-black text-[#4A8795]">
          {totalPrice.toLocaleString('vi-VN')} ₫
        </p>
      </div>

      {/* Nút thêm vào giỏ hàng */}
      <Button
        onClick={onAddToCart}
        disabled={isAddToCartBlocked}
        className="w-full h-14 text-lg font-bold bg-[#4A8795] hover:bg-[#3f7581] shadow-sm transition-all active:scale-[0.98]"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Thêm vào giỏ hàng
      </Button>

      {/* Thông báo lỗi nếu chọn tròng nhưng thiếu đơn thuốc */}
      {isAddToCartBlocked && (
        <p className="mt-3 text-sm font-medium text-rose-600">
          Bạn đã chọn tròng kính. Vui lòng tải đơn đo mắt hoặc nhập thông số cho cả mắt trái và
          mắt phải.
        </p>
      )}
    </div>
  );
}
