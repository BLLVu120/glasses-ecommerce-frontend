import { Link } from 'react-router-dom';
import HeaderActions from './HeaderActions';
import Logo from '@/components/common/Logo';

export default function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* LOGO - Cố định bên trái */}
        <Logo />

        {/* NAVIGATION - Nằm giữa thoáng đãng */}
        <nav className="lg:flex items-center gap-8 font-bold text-[11px] uppercase tracking-[0.2em] text-gray-500">
          <Link to="/shop" className="hover:text-black transition-colors relative group">
            Cửa hàng
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* SEARCH & ACTIONS - Gom toàn bộ vào HeaderActions */}
        <div className="flex items-center justify-end flex-grow">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
