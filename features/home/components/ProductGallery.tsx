import { useState, lazy, Suspense, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Tag, Box, Glasses, Layout, User, Target, Wrench, Scale, X, Loader2, RotateCcw } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';

const GlassesModelViewer = lazy(() => import('@/components/common/GlassesModelViewer'));
// Thêm interface cho object hình ảnh của Product
interface ProductImage {
  imageUrl: string;
}

export default function ProductGallery({ productId }: { productId: string }) {
  // 1. Lấy dữ liệu từ Hook
  const { data: product, isLoading } = useProduct(productId);

  // 2. State cho thumbnail (lưu trữ URL string)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [view3DOpen, setView3DOpen] = useState(false);

  const proxyUrl = useCallback((url: string) => {
    const s3Host = 'https://optics-management-storage.s3.amazonaws.com';
    if (url.startsWith(s3Host)) return url.replace(s3Host, '/s3-proxy');
    return url;
  }, []);

  // 3. Loading Skeleton
  if (isLoading || !product) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 👇 FIX LOGIC HIỂN THỊ ẢNH
  // 4a. Bóc tách mảng object thành mảng các đường link (string)
  const images = product.imageUrl?.map((imgObj: ProductImage) => imgObj.imageUrl) || [];

  // 4b. Link dự phòng an toàn
  const fallbackImg =
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800';

  // 4c. Xác định ảnh active (ưu tiên ảnh đã click -> ảnh đầu tiên -> ảnh dự phòng)
  const activeImage = selectedImage || (images.length > 0 ? images[0] : fallbackImg);

  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-product-in {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* --- VÙNG HIỂN THỊ ẢNH CHÍNH --- */}
      <div className="relative bg-gradient-to-b from-[#F8FAFB] to-[#F1F4F6] rounded-3xl overflow-hidden aspect-square flex items-center justify-center group border border-white shadow-inner">
        <img
          key={activeImage}
          src={activeImage}
          alt={product.name}
          className="w-4/5 object-contain mix-blend-multiply transition-all duration-700 group-hover:scale-110 animate-product-in"
          // Chống lỗi link S3 chết
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
            e.currentTarget.onerror = null;
          }}
        />

        {/* Action buttons */}
        <div className="absolute bottom-6 flex items-center gap-3">
          {product.modelUrl && (
            <button
              onClick={() => setView3DOpen(true)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full shadow-xl hover:bg-violet-600 hover:text-white transition-all active:scale-95 text-sm font-bold text-violet-600 border border-white/50 group/btn"
            >
              <Box className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
              View in 3D
            </button>
          )}
        </div>
      </div>

      {/* --- DANH SÁCH ẢNH THUMBNAILS --- */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {images.map((imgStr: string, index: number) => {
            const isActive = activeImage === imgStr;
            return (
              <div
                key={`${productId}-${index}`}
                onClick={() => setSelectedImage(imgStr)}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-white border-2 cursor-pointer flex items-center justify-center transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? 'border-[#4A8795] shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                  }`}
              >
                <img
                  src={imgStr}
                  className="w-5/6 object-contain mix-blend-multiply"
                  alt={`Thumb ${index}`}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* --- THÔNG SỐ KỸ THUẬT (BENTO GRID UI) --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Thông số chi tiết</h3>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-widest rounded-full">
              Specs
            </span>
          </div>
        </div>

        {/* Lưới Grid 2 cột (Tự động xuống 1 cột trên điện thoại nhỏ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: 'Thương hiệu', value: product.brand, icon: Tag },
            { label: 'Chất liệu', value: product.frameMaterial, icon: Box },
            { label: 'Kiểu dáng', value: product.shape, icon: Glasses },
            { label: 'Loại gọng', value: product.frameType, icon: Layout },
            { label: 'Giới tính', value: product.gender, icon: User },
            { label: 'Đệm mũi', value: product.nosePadType, icon: Target },
            { label: 'Bản lề', value: product.hingeType, icon: Wrench },
            {
              label: 'Trọng lượng',
              value: product.weightGram ? `${product.weightGram}g` : null,
              icon: Scale,
            },
          ]
            .filter((item) => item.value)
            .map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFB] border border-transparent hover:border-[#4A8795]/20 hover:bg-white hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300"
                >
                  {/* Cột trái: Icon */}
                  <div className="w-10 h-10 flex shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm group-hover:text-[#4A8795] group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </div>

                  {/* Cột phải: Text */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-0.5">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900 capitalize truncate">
                      {item.value?.toString().replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* View in 3D Modal */}
      {view3DOpen && product.modelUrl && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-lg animate-in fade-in duration-300">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Box className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-gray-900 font-black text-base tracking-tight">View in 3D</h2>
                <p className="text-gray-500 text-xs">{product.name}</p>
              </div>
            </div>
            <button
              onClick={() => setView3DOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3D Viewer */}
          <div className="w-full max-w-3xl aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-2xl border border-gray-200">
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                  <p className="text-gray-500 text-sm font-semibold">Loading 3D model...</p>
                </div>
              }
            >
              <GlassesModelViewer modelUrl={proxyUrl(product.modelUrl)} />
            </Suspense>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 flex items-center gap-6 text-gray-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Drag to rotate
            </span>
            <span>Scroll to zoom</span>
            <span>Right-click to pan</span>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
