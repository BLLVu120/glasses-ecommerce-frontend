import { Link } from 'react-router-dom';
import { Glasses } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
// Import useAuthStore (Nhớ chỉnh lại đường dẫn import cho khớp với thư mục của bạn nhé)

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export default function Logo({ className = '', iconSize = 5, textSize = 'text-lg' }: LogoProps) {
  // Lấy hàm redirectByRole từ store
  const redirectByRole = useAuthStore((state) => state.redirectByRole);

  return (
    <Link to={redirectByRole()} className={`flex items-center gap-2 group ${className}`}>
      <div className="bg-black text-white p-1 rounded group-hover:bg-emerald-600 transition-colors">
        <Glasses className={`w-${iconSize} h-${iconSize}`} />
      </div>
      <span className={`font-bold ${textSize} uppercase tracking-widest text-zinc-900`}>
        OpticStore
      </span>
    </Link>
  );
}
