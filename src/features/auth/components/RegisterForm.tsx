import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UserPlus, AlertCircle, Camera, ImagePlus } from 'lucide-react';
import { useRegisterForm } from '../hooks/useRegisterForm';

export default function RegisterForm() {
  const { form, onSubmit, isLoading } = useRegisterForm();
  const {
    register,
    formState: { errors },
  } = form;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };


  const { onChange: onFormChange, ref: formRef, ...restFormProps } = register('imageFile');

  return (
    <div className="w-full max-w-[500px] mx-auto transition-all duration-500">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 mb-2 tracking-tight">Tạo tài khoản</h2>
        <p className="text-gray-500 text-sm font-medium">
          Tham gia cộng đồng kính cao cấp của chúng tôi.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* AVATAR UPLOAD */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden flex items-center justify-center relative cursor-pointer hover:border-zinc-200 transition-all">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Xem trước ảnh đại diện"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserPlus className="w-10 h-10 text-gray-300" />
              )}

              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>

            {!previewUrl && (
              <div className="absolute bottom-1 right-1 bg-zinc-900 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                <ImagePlus className="w-3.5 h-3.5" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              {...restFormProps}
              ref={formRef}
              onChange={(e) => {
                onFormChange(e);
                handleImageChange(e);
              }}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* GLOBAL ERROR */}
        {errors.root && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errors.root.message}</p>
          </div>
        )}

        {/* PERSONAL INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              placeholder="TÊN"
              disabled={isLoading}
              {...register('firstName')}
              className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.firstName ? 'border-red-500 bg-red-50/50' : ''}`}
            />
            {errors.firstName && (
              <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="HỌ"
              disabled={isLoading}
              {...register('lastName')}
              className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.lastName ? 'border-red-500 bg-red-50/50' : ''}`}
            />
            {errors.lastName && (
              <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* CONTACT */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="ĐỊA CHỈ EMAIL"
              type="email"
              disabled={isLoading}
              {...register('email')}
              className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.email ? 'border-red-500 bg-red-50/50' : ''}`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                placeholder="SỐ ĐIỆN THOẠI"
                type="tel"
                disabled={isLoading}
                {...register('phone')}
                className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.phone ? 'border-red-500 bg-red-50/50' : ''}`}
              />
              {errors.phone && (
                <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <Input
                id="dob"
                type="date"
                disabled={isLoading}
                {...register('dob')}
                className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium text-gray-500 ${errors.dob ? 'border-red-500 bg-red-50/50' : ''}`}
              />
              {errors.dob && (
                <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            Thông tin tài khoản
          </span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* ACCOUNT */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="TÊN ĐĂNG NHẬP"
              disabled={isLoading}
              {...register('username')}
              className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.username ? 'border-red-500 bg-red-50/50' : ''}`}
            />
            {errors.username && (
              <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              id="password"
              type="password"
              placeholder="MẬT KHẨU"
              disabled={isLoading}
              {...register('password')}
              className={`rounded-xl h-12 px-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-zinc-100 transition-all text-sm font-medium ${errors.password ? 'border-red-500 bg-red-50/50' : ''}`}
            />
            {errors.password && (
              <p className="text-[10px] text-red-500 px-1 pt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold tracking-widest transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>ĐĂNG KÝ</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Đã có tài khoản?{' '}
            <Link
              to="/auth/login"
              className="font-bold text-zinc-900 hover:text-emerald-600 transition-colors hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
