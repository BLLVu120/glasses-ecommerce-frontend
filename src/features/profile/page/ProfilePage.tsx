import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  type LucideIcon,
  Loader2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProfileQuery } from '../hooks/useProfileQuery';

// Component tiêu đề nhỏ
const SectionTitle = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
  <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-6">
    <Icon className="w-4 h-4" />
    <span>{title}</span>
  </div>
);

export default function ProfilePage() {
  // ✅ TanStack Query gọi API
  const { data: profile, isLoading, isError } = useProfileQuery();

  // ⏳ Trạng thái tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ❌ Lỗi hoặc không có data
  if (isError || !profile) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl mt-4">
        <p>Không tìm thấy thông tin cá nhân hoặc phiên đăng nhập đã hết hạn.</p>
      </div>
    );
  }

  // ✅ Safe Data Access: Đảm bảo roles luôn là mảng, kể cả khi null
  const safeRoles = profile.roles || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 space-y-10">
        {/* --- 1. PHẦN ĐẦU & ẢNH ĐẠI DIỆN --- */}
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="flex gap-6 items-center">
            {/* Khung chứa ảnh đại diện */}
            <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-sm shrink-0 relative group cursor-pointer">
              <img
                src={
                  profile.imageUrl ||
                  `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`
                }
                alt="Ảnh đại diện"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Tên & Tên đăng nhập */}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-sm text-gray-500 font-medium">@{profile.username}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="h-9 rounded-lg font-medium text-xs">
                  Tải ảnh mới lên
                </Button>
              </div>
            </div>
          </div>

          {/* Huy hiệu xác minh */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 max-w-sm">
            <div className="mt-0.5 bg-emerald-100 p-1.5 rounded-full h-fit text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 text-sm">Tài khoản đã xác minh</h3>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                Danh tính đã được bảo mật. Vai trò hiện tại:{' '}
                <span className="font-semibold">
                  {/* 👇 FIX: Dùng safeRoles thay vì profile.roles */}
                  {safeRoles.length > 0 ? safeRoles.map((r) => r.name).join(', ') : 'Thành viên'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* --- 2. THÔNG TIN ĐỊNH DANH --- */}
        <div>
          <SectionTitle icon={User} title="Thông tin định danh" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 ml-1">Tên</Label>
              <Input
                value={profile.firstName || ''}
                className="h-11 bg-gray-50/50 border-gray-200 text-gray-700 font-medium"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 ml-1">Họ</Label>
              <Input
                value={profile.lastName || ''}
                className="h-11 bg-gray-50/50 border-gray-200 text-gray-700 font-medium"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 ml-1">Ngày sinh</Label>
              <Input
                type="date"
                // Backend trả về "2026-01-28", input type date nhận format này chuẩn
                value={profile.dob || ''}
                className="h-11 bg-gray-50/50 border-gray-200 text-gray-700 font-medium"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* --- 3. CHI TIẾT LIÊN HỆ --- */}
        <div>
          <SectionTitle icon={Mail} title="Liên hệ & Bảo mật" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 ml-1">Địa chỉ Email</Label>
              <div className="relative group">
                <Input
                  value={profile.email || ''}
                  className="h-11 bg-gray-50/50 pr-28 border-gray-200 text-gray-700 font-medium"
                  readOnly
                />
                <div className="absolute right-3 top-2.5 flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide cursor-help">
                  <CheckCircle2 className="w-3 h-3" /> Đã xác minh
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 ml-1">Số điện thoại</Label>
              <Input
                value={profile.phone || 'Chưa cung cấp'}
                className="h-11 bg-gray-50/50 border-gray-200 text-gray-700 font-medium"
                readOnly
              />
            </div>
          </div>

          {/* --- PHẦN VAI TRÒ & QUYỀN HẠN --- */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-gray-500" />
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Vai trò & Quyền hạn hoạt động
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* 👇 FIX: Dùng safeRoles để map an toàn */}
              {safeRoles.length > 0 ? (
                safeRoles.map((role, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 pl-3 pr-3 py-1.5 rounded-lg shadow-sm hover:border-zinc-300 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-gray-700">{role.name}</span>
                    </div>

                    {/* Tooltip hiển thị description (nếu có) */}
                    {role.description && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-2 py-1 text-[10px] text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {role.description}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Chưa được chỉ định vai trò</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
