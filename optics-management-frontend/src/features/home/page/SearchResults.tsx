import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Breadcrumb from '@/components/common/Breadcrumb';

export const SearchResults = () => {
  // 1. Quản lý URL Params
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get('q') || '';
  const urlGender = searchParams.get('gender') || '';

  // State lưu lại URL cũ để so sánh
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  const [prevUrlGender, setPrevUrlGender] = useState(urlGender);

  // 2. States "Nháp" (Dùng để hiển thị lên giao diện lúc đang thao tác)
  const [draftQ, setDraftQ] = useState(urlQ);
  const [draftGender, setDraftGender] = useState(urlGender);
  const [draftPrice, setDraftPrice] = useState({ min: 0, max: 15000000 });

  // 3. States "Chính thức" (Dùng để gọi API)
  const [page, setPage] = useState(1);
  const size = 9;

  const [appliedQ, setAppliedQ] = useState(urlQ);
  const [appliedGender, setAppliedGender] = useState(urlGender);
  const [appliedPrice, setAppliedPrice] = useState({ min: 0, max: 15000000 });

  const [sortConfig, setSortConfig] = useState<{
    sortBy: string;
    sortDir: 'desc' | 'asc' | undefined;
  }>({
    sortBy: 'id',
    sortDir: 'desc',
  });

  // 🌟 KHỐI LỆNH ĐỒNG BỘ: Nếu URL thay đổi, tự động cập nhật bộ lọc
  if (urlQ !== prevUrlQ || urlGender !== prevUrlGender) {
    setPrevUrlQ(urlQ);
    setPrevUrlGender(urlGender);

    setDraftQ(urlQ);
    setAppliedQ(urlQ);

    setDraftGender(urlGender);
    setAppliedGender(urlGender);

    setPage(1);
  }

  // 4. Gọi hook chỉ với tham số "Chính thức"
  const { data, isLoading, isError, error, isFetching } = useProducts({
    q: appliedQ || undefined,
    gender: appliedGender || undefined,
    sortBy: sortConfig.sortBy,
    sortDir: sortConfig.sortDir,
    page: page - 1,
    size,
    minPrice: appliedPrice.min,
    maxPrice: appliedPrice.max,
  });

  const totalItems = data?.totalElements ?? 0;
  const productList = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  // 5. Các hàm xử lý
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPage(1);

    switch (value) {
      case 'name_asc':
        setSortConfig({ sortBy: 'name', sortDir: 'asc' });
        break;
      default:
        setSortConfig({ sortBy: 'id', sortDir: 'desc' });
        break;
    }
  };

  const handleApplyFilters = () => {
    setAppliedQ(draftQ);
    setAppliedGender(draftGender);
    setAppliedPrice(draftPrice);
    setPage(1);

    const newParams = new URLSearchParams(searchParams);
    if (draftQ) newParams.set('q', draftQ);
    else newParams.delete('q');

    if (draftGender) newParams.set('gender', draftGender);
    else newParams.delete('gender');

    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => {
    const defaultPrice = { min: 0, max: 15000000 };
    setDraftQ('');
    setDraftGender('');
    setDraftPrice(defaultPrice);

    setAppliedQ('');
    setAppliedGender('');
    setAppliedPrice(defaultPrice);
    setPage(1);

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.delete('gender');
    setSearchParams(newParams, { replace: true });
  };

  // 🌟 LOGIC BREADCRUMB ĐỘNG
  const breadcrumbItems = [{ label: 'Cửa hàng', link: '' }];

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="mb-6 md:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="p-20 text-center animate-pulse text-xl text-gray-400">
          Đang tải sản phẩm...
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="mb-6 md:mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="p-20 text-center text-red-500 bg-red-50 rounded-xl">
          <p className="font-bold">Đã xảy ra lỗi tải dữ liệu</p>
          <p className="text-sm">
            ⚠️ {error instanceof Error ? error.message : 'Lỗi không xác định'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      {/* 🌟 1. TOP BAR ĐÃ GỘP: Breadcrumb + Số lượng + Sắp xếp */}
      <div className="mb-8 pb-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Cụm bên trái: Breadcrumb */}
          <div className="flex-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Cụm bên phải: Cố định Số lượng và Sắp xếp */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:justify-end">
            {/* Box Đếm số lượng */}
            <div className="text-[13px] sm:text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border flex-shrink-0">
              Hiển thị <span className="font-bold text-gray-900">{totalItems}</span> sản phẩm
              {isFetching && <span className="ml-2 text-teal-600 animate-pulse">...</span>}
            </div>

            {/* Dropdown Sắp xếp */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 hidden sm:inline-block">Sắp xếp:</span>
              <select
                className="border rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white cursor-pointer"
                onChange={handleSortChange}
                defaultValue="newest"
              >
                <option value="newest">Mới nhất</option>
                <option value="name_asc">Tên: A → Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10">
        {/* Sidebar Filter */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-5 shadow-sm sticky top-24 flex flex-col h-fit">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* --- Lọc Từ Khóa --- */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tìm kiếm</p>
                <input
                  type="text"
                  placeholder="Tên sản phẩm..."
                  value={draftQ}
                  onChange={(e) => setDraftQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleApplyFilters();
                  }}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* --- Lọc Giới Tính --- */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Giới tính</p>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Tất cả' },
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                    { value: 'UNISEX', label: 'Unisex' },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={item.value}
                        checked={draftGender === item.value}
                        onChange={(e) => setDraftGender(e.target.value)}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
                      />
                      <span className="group-hover:text-teal-700 transition">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* --- Lọc Giá --- */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Khoảng giá</p>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    value={draftPrice.min}
                    min={0}
                    max={draftPrice.max}
                    onChange={(e) =>
                      setDraftPrice((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    className="w-full border rounded-md px-2 py-1.5 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={draftPrice.max}
                    min={draftPrice.min}
                    onChange={(e) =>
                      setDraftPrice((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full border rounded-md px-2 py-1.5 text-sm"
                  />
                </div>

                {/* Sliders */}
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="15000000"
                    step="100000"
                    value={draftPrice.min}
                    onChange={(e) =>
                      setDraftPrice((prev) => ({ ...prev, min: Number(e.target.value) }))
                    }
                    className="w-full accent-teal-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="15000000"
                    step="100000"
                    value={draftPrice.max}
                    onChange={(e) =>
                      setDraftPrice((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* --- NÚT ÁP DỤNG --- */}
            <div className="mt-8 pt-4 border-t">
              <button
                onClick={handleApplyFilters}
                disabled={isFetching}
                className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-lg hover:bg-teal-700 transition disabled:bg-teal-400 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
              >
                {isFetching ? 'Đang lọc...' : 'Áp dụng bộ lọc'}
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="lg:col-span-3">
          {productList.length === 0 ? (
            <div className="py-20 text-center text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
              Không tìm thấy sản phẩm nào.
              <button
                onClick={handleResetFilters}
                className="block mx-auto mt-3 text-teal-600 hover:underline text-sm font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}
            >
              {productList.map((product) => {
                const hasPriceRange = product.minPrice > 0 && product.maxPrice > product.minPrice;

                const getGenderBadge = (gender: string) => {
                  switch (gender) {
                    case 'MALE':
                      return {
                        label: 'Nam',
                        style: 'bg-blue-100/80 text-blue-700 border-blue-200',
                      };
                    case 'FEMALE':
                      return { label: 'Nữ', style: 'bg-rose-100/80 text-rose-700 border-rose-200' };
                    case 'UNISEX':
                    default:
                      return {
                        label: 'Unisex',
                        style: 'bg-purple-100/80 text-purple-700 border-purple-200',
                      };
                  }
                };

                const genderBadge = product.gender ? getGenderBadge(product.gender) : null;

                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden relative"
                  >
                    <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                      {genderBadge && (
                        <span
                          className={`absolute top-3 left-3 z-10 backdrop-blur-md text-[10px] font-bold px-2.5 py-1.5 rounded-md shadow-sm border uppercase tracking-wider ${genderBadge.style}`}
                        >
                          {genderBadge.label}
                        </span>
                      )}

                      <img
                        src={
                          product.imageUrl?.[0]?.imageUrl ||
                          'https://images.unsplash.com/photo-1572635196237-14b3f281503f'
                        }
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[11px] text-gray-400 mb-1.5 font-bold tracking-widest uppercase">
                        {product.brand}
                      </p>

                      <h4 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-teal-600 transition-colors duration-200">
                        {product.name}
                      </h4>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.shape && (
                          <span className="text-[11px] font-medium bg-gray-100/80 text-gray-600 px-2 py-1 rounded-md">
                            {product.shape}
                          </span>
                        )}
                        {product.frameMaterial && (
                          <span className="text-[11px] font-medium bg-gray-100/80 text-gray-600 px-2 py-1 rounded-md">
                            {product.frameMaterial}
                          </span>
                        )}
                        {product.frameType && (
                          <span className="text-[11px] font-medium bg-gray-100/80 text-gray-600 px-2 py-1 rounded-md">
                            {product.frameType}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          {hasPriceRange && (
                            <span className="text-[10px] text-gray-400 font-medium uppercase mb-0.5">
                              Giá từ
                            </span>
                          )}
                          <p className="text-teal-700 font-bold text-base">
                            {product.minPrice
                              ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(product.minPrice)
                              : 'Liên hệ'}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50 text-sm font-medium"
              >
                Trang trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3.5 py-1.5 border rounded-md text-sm font-medium ${
                    page === i + 1
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50 text-sm font-medium"
              >
                Trang sau
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
