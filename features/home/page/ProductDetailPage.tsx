import { useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import Breadcrumb from '@/components/common/Breadcrumb';
// 🌟 Import đúng tên hook `useProduct` từ file useProducts của bạn
import { useProduct } from '../hooks/useProducts';

export default function ProductDetailPage() {
  // 1. Lấy ID từ URL
  const { productId } = useParams();
  const safeId = productId || '';

  // 2. 🌟 Sử dụng đúng hook `useProduct` đã khai báo
  const { data: product, isLoading } = useProduct(safeId);

  // 3. Cập nhật Breadcrumb: Nếu đang tải thì hiện "Đang tải...", có dữ liệu thì hiện Tên
  const productName = product?.name || (isLoading ? 'Đang tải...' : `Sản phẩm #${safeId}`);

  const breadcrumbItems = [
    { label: 'Cửa hàng', link: '/shop' },
    { label: productName, link: '' }, // 🌟 Hiển thị tên ở đây
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 md:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Cột Trái */}
          <div className="lg:col-span-7">
            {/* Vẫn truyền ID xuống các component con như bình thường */}
            <ProductGallery productId={safeId} />
          </div>

          {/* Cột Phải */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-8">
            <ProductInfo productId={safeId} />

            <ProductForm productId={safeId} />
          </div>
        </div>
      </div>
    </div>
  );
}
