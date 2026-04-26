import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ShieldCheck, Sparkles, Gem, ChevronLeft, ChevronRight } from 'lucide-react';
// Import hook gọi API
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  // 1. Lấy 4 sản phẩm mới nhất từ API
  const { data, isLoading } = useProducts({
    size: 4,
    sortBy: 'id',
    sortDir: 'desc',
  });

  const newArrivals = data?.items || [];

  // 2. Slideshow Banner Data
  const bannerSlides = [
    {
      tag: 'Cam Kết Kiệt Tác',
      headline: 'Định hình phong cách.',
      subline: 'Tôn vinh khí chất.',
      desc: 'Mỗi thiết kế gọng kính đều là sự giao thoa hoàn mỹ giữa nghệ thuật chế tác thủ công và công nghệ vật liệu tiên tiến bậc nhất.',
      badges: [
        { icon: 'shield', label: 'Bảo hành chính hãng' },
        { icon: 'gem', label: 'Titanium siêu nhẹ' },
      ],
      accent: 'from-zinc-950 via-zinc-900 to-zinc-950',
      glowColor: 'bg-white/5',
    },
    {
      tag: 'Bộ Sưu Tập Mới',
      headline: 'Sang trọng từng đường nét.',
      subline: 'Tinh tế vượt thời gian.',
      desc: 'Những thiết kế lấy cảm hứng từ kiến trúc hiện đại, mang lại vẻ thanh lịch và cá tính riêng cho người đeo.',
      badges: [
        { icon: 'shield', label: 'Chất liệu cao cấp' },
        { icon: 'gem', label: 'Thủ công tỉ mỉ' },
      ],
      accent: 'from-[#0a0a0a] via-[#1a1209] to-[#0a0a0a]',
      glowColor: 'bg-amber-500/10',

      tag: 'Bộ Sưu Tập Mới',
      headline: 'Sang trọng từng đường nét.',
      subline: 'Tinh tế vượt thời gian.',
      desc: 'Những thiết kế lấy cảm hứng từ kiến trúc hiện đại, mang lại vẻ thanh lịch và cá tính riêng cho người đeo.',
      badges: [
        { icon: 'shield', label: 'Chất liệu cao cấp' },
        { icon: 'gem', label: 'Thủ công tỉ mỉ' },
      ],
      accent: 'from-[#0a0a0a] via-[#1a1209] to-[#0a0a0a]',
      glowColor: 'bg-amber-500/10',
    },
    {
      tag: 'Phong Cách Tối Giản',
      headline: 'Ít hơn, đẹp hơn.',
      subline: 'Minimalism đỉnh cao.',
      desc: 'Triết lý thiết kế Less is More — mỗi chi tiết đều có lý do tồn tại, mỗi đường cong đều kể một câu chuyện.',
      badges: [
        { icon: 'shield', label: 'Thiết kế thuần khiết' },
        { icon: 'gem', label: 'Trọng lượng siêu nhẹ' },
      ],
      accent: 'from-[#080810] via-[#10101a] to-[#080810]',
      glowColor: 'bg-indigo-500/10',
    },
    {
      tag: 'Dòng Titan Premium',
      headline: 'Bền bỉ như thời gian.',
      subline: 'Mạnh mẽ, nhẹ nhàng.',
      desc: 'Hợp kim titan y tế cấp độ cao — bền bỉ gấp 3 lần thép thường, nhẹ hơn 45% so với acetate truyền thống.',
      badges: [
        { icon: 'shield', label: 'Titan y tế Grade 5' },
        { icon: 'gem', label: 'Chống ăn mòn tuyệt đối' },
      ],
      accent: 'from-[#090909] via-[#111518] to-[#090909]',
      glowColor: 'bg-cyan-500/8',
    },
    {
      tag: 'Thiết Kế Độc Quyền',
      headline: 'Mang cả thế giới.',
      subline: 'Trên gọng kính bạn.',
      desc: 'Lấy cảm hứng từ nghệ thuật Nhật Bản, kiến trúc Bắc Âu và thời trang Ý — tạo nên ngôn ngữ thị giác đặc trưng.',
      badges: [
        { icon: 'shield', label: 'Limited edition' },
        { icon: 'gem', label: 'Số lượng có hạn' },
      ],
      accent: 'from-[#0c0808] via-[#180c0c] to-[#0c0808]',
      glowColor: 'bg-rose-500/8',
    },
    {
      tag: 'Tròng Kính Thế Hệ Mới',
      headline: 'Nhìn rõ hơn.',
      subline: 'Sống đẹp hơn.',
      desc: 'Tròng kính công nghệ HD Vision với lớp phủ chống phản chiếu, kháng trầy, chống tia UV400 toàn diện.',
      badges: [
        { icon: 'shield', label: 'Chống UV400' },
        { icon: 'gem', label: 'HD Vision technology' },
      ],
      accent: 'from-[#080c08] via-[#0e1510] to-[#080c08]',
      glowColor: 'bg-emerald-500/8',
    },
    {
      tag: 'Phong Cách Retro',
      headline: 'Hoài niệm thanh lịch.',
      subline: 'Hiện đại trong từng chi tiết.',
      desc: 'Những hình dáng kinh điển từ thập niên 70s được tái sinh với vật liệu hiện đại và kỹ thuật chế tác tiên tiến.',
      badges: [
        { icon: 'shield', label: 'Cảm hứng vintage' },
        { icon: 'gem', label: 'Hiện đại hóa hoàn toàn' },
      ],
      accent: 'from-[#0d0c08] via-[#1a1710] to-[#0d0c08]',
      glowColor: 'bg-yellow-500/8',
    },
    {
      tag: 'Unisex Collection',
      headline: 'Không giới hạn.',
      subline: 'Phong cách cho mọi người.',
      desc: 'Dòng sản phẩm unisex thiết kế thông minh, phù hợp với mọi khuôn mặt, mọi phong cách và mọi dịp.',
      badges: [
        { icon: 'shield', label: 'Phù hợp mọi khuôn mặt' },
        { icon: 'gem', label: 'Đa năng & linh hoạt' },
      ],
      accent: 'from-[#08080d] via-[#10101a] to-[#08080d]',
      glowColor: 'bg-purple-500/8',
    },
    {
      tag: 'Chính Sách Ưu Việt',
      headline: 'Mua sắm tự tin.',
      subline: 'Bảo hành trọn đời.',
      desc: 'Chính sách đổi trả 30 ngày không điều kiện, bảo hành chính hãng 2 năm và dịch vụ chăm sóc khách hàng 24/7.',
      badges: [
        { icon: 'shield', label: 'Đổi trả 30 ngày' },
        { icon: 'gem', label: 'Bảo hành 2 năm' },
      ],
      accent: 'from-[#080d08] via-[#0f1a12] to-[#080d08]',
      glowColor: 'bg-teal-500/8',
    },
    {
      tag: 'Flagship Store',
      headline: 'Trải nghiệm tại cửa hàng.',
      subline: 'Không gian kính mắt đẳng cấp.',
      desc: 'Đến trực tiếp để được tư vấn chuyên nghiệp, thử hàng trăm mẫu kính và đo kính miễn phí bởi chuyên gia.',
      badges: [
        { icon: 'shield', label: 'Tư vấn miễn phí' },
        { icon: 'gem', label: 'Đo kính chuyên nghiệp' },
      ],
      accent: 'from-[#0d0809] via-[#1a0f10] to-[#0d0809]',
      glowColor: 'bg-pink-500/8',
    },
  ];
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const handleNextSlide = () => {
    goToSlide((currentSlide + 1) % bannerSlides.length);
  };

  const handlePrevSlide = () => {
    goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 3000);
    return () => clearInterval(timer);
  });

  // 3. Helper hiển thị Badge Giới tính
  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return { label: 'Nam', style: 'bg-blue-100/80 text-blue-700 border-blue-200' };
      case 'FEMALE':
        return { label: 'Nữ', style: 'bg-rose-100/80 text-rose-700 border-rose-200' };
      case 'UNISEX':
      default:
        return { label: 'Unisex', style: 'bg-purple-100/80 text-purple-700 border-purple-200' };
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-gray-200 selection:text-black">
      <main className="flex-grow">
        {/* --- 1. HERO SECTION --- */}
        <section className="w-full bg-[#FAFAFA] pt-10 md:pt-0 min-h-[600px] md:h-[80vh] flex items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-[#F3F3F3] skew-x-12 translate-x-20 z-0 hidden md:block"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-10 duration-1000 fade-in order-2 md:order-1 pb-10 md:pb-0">
              <div className="inline-flex items-center gap-3">
                <div className="h-[1px] w-12 bg-gray-400"></div>
                <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">
                  Est. 2024
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-[1.15]">
                Tuyệt Tác <br />
                <span className="italic font-light text-gray-400">Thị Giác.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-md font-light leading-relaxed">
                Sự cân bằng hoàn hảo giữa nghệ thuật chế tác thủ công và công nghệ quang học hiện
                đại. Nhẹ nhàng, bền bỉ và tinh tế trong từng đường nét.
              </p>
              <div className="pt-2">
                <Link to="/shop">
                  <Button className="h-12 md:h-14 px-8 md:px-10 bg-gray-900 hover:bg-black text-white rounded-[15px] transition-all duration-300 shadow-lg hover:shadow-xl text-xs md:text-sm font-bold tracking-widest uppercase">
                    Khám phá bộ sưu tập
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-full w-full order-1 md:order-2">
              <img
                src="https://i.pinimg.com/1200x/fc/70/4d/fc704d779033c6dd94e1c8288776204d.jpg"
                alt="Hero"
                className="w-full h-full object-cover object-top md:object-center rounded-[15px]"
              />
            </div>
          </div>
        </section>

        {/* --- 2. AUDIENCE CATEGORIES --- */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-serif text-gray-900 tracking-tight">
              Mua Sắm Theo Đối Tượng
            </h2>
            <Link
              to="/shop"
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              Xem tất cả <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kính Nam',
                img: 'https://i.pinimg.com/1200x/50/55/27/5055273a781891a955eeab54b7148bcb.jpg',
                query: 'MALE',
              },
              {
                name: 'Kính Nữ',
                img: 'https://i.pinimg.com/736x/83/fc/04/83fc0432ef91b53cbe8b2ba534c36856.jpg',
                query: 'FEMALE',
              },
              {
                name: 'Gọng Unisex',
                img: 'https://i.pinimg.com/1200x/a4/b0/ce/a4b0ce9e445b99c0d950f99e56303307.jpg',
                query: 'UNISEX',
              },
            ].map((item, idx) => (
              <Link
                to={`/shop?gender=${item.query}`}
                key={idx}
                className="group relative h-[400px] overflow-hidden rounded-[15px] block"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-serif text-white tracking-wide">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 md:space-y-20 py-12 md:py-24">
          {/* --- 3. NEW ARRIVALS SECTION --- */}
          <section>
            <div className="flex justify-between items-end mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900">Sản Phẩm Mới Nhất</h2>
              <Link
                to="/shop"
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 hover:border-gray-900 transition-all pb-1"
              >
                Xem Thêm
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-gray-100 animate-pulse rounded-[15px]"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {newArrivals.map((product) => {
                  const genderBadge = product.gender ? getGenderBadge(product.gender) : null;
                  return (
                    <Link to={`/products/${product.id}`} key={product.id} className="group block">
                      <div className="relative aspect-[4/5] bg-[#F9F9F9] overflow-hidden mb-4 border border-transparent group-hover:border-gray-200 transition-all rounded-[15px]">
                        {genderBadge && (
                          <span
                            className={`absolute top-3 left-3 z-10 backdrop-blur-md text-[9px] md:text-[10px] font-bold px-2 md:px-2.5 py-1 md:py-1.5 rounded-md border uppercase tracking-wider ${genderBadge.style}`}
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
                          className="w-full h-full object-cover mix-blend-multiply opacity-95 group-hover:scale-105 transition-all duration-700 ease-in-out"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button className="w-full bg-white/90 backdrop-blur-sm text-black hover:bg-black hover:text-white shadow-sm h-10 rounded-[15px] uppercase text-[10px] font-bold tracking-widest transition-colors pointer-events-none">
                            Xem Chi Tiết
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-serif text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider mt-1 mb-2">
                          {product.brand || 'Thương hiệu cao cấp'}
                        </p>
                        <span className="font-medium text-teal-700 text-sm">
                          {product.minPrice
                            ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(product.minPrice)
                            : 'Liên hệ'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* --- 4. BANNER SLIDESHOW --- */}
          <section className="relative rounded-[15px] md:rounded-[20px] overflow-hidden min-h-[450px] md:min-h-[500px] flex flex-col justify-center">
            {/* Slide Backgrounds */}
            {bannerSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-gradient-to-br ${slide.accent} transition-all duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div
                  className={`absolute top-[-50%] left-[50%] -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] ${slide.glowColor} rounded-full blur-[80px] md:blur-[120px] pointer-events-none`}
                ></div>
              </div>
            ))}

            {/* Content Layer */}
            <div className="relative z-20 px-4 py-12 md:px-16 text-center text-white">
              <div
                className={`max-w-3xl mx-auto space-y-4 md:space-y-6 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
              >
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                    {bannerSlides[currentSlide].tag}
                  </span>
                  <Sparkles className="w-3 h-3 text-gray-400" />
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif leading-tight">
                  {bannerSlides[currentSlide].headline} <br className="hidden sm:block" />
                  <span className="text-gray-400 italic font-light sm:ml-2">
                    {bannerSlides[currentSlide].subline}
                  </span>
                </h2>

                <p className="text-gray-400 text-xs md:text-base font-light leading-relaxed max-w-2xl mx-auto px-2">
                  {bannerSlides[currentSlide].desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-4">
                  {bannerSlides[currentSlide].badges.map((badge, bIdx) => (
                    <div
                      key={bIdx}
                      className="flex items-center justify-center gap-3 bg-white/5 rounded-[12px] p-3 border border-white/10"
                    >
                      {badge.icon === 'shield' ? (
                        <ShieldCheck className="w-4 h-4 text-gray-300" />
                      ) : (
                        <Gem className="w-4 h-4 text-gray-300" />
                      )}
                      <span className="text-[10px] md:text-xs font-medium uppercase text-gray-300">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-10 relative z-30">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-30 overflow-hidden">
                <div
                  key={currentSlide}
                  className="h-full bg-white/40"
                  style={{ animation: 'slideProgress 3s linear forwards' }}
                />
              </div>
            </div>

            <style>{`
              @keyframes slideProgress {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}</style>
          </section>
        </div>
      </main>
    </div>
  );
}
