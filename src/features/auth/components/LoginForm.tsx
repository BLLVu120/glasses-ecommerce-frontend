import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm() {
  const { form, onSubmit, isLoading } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-[420px] mx-auto transition-all duration-500">
      {/* HEADER */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-zinc-900 mb-3 tracking-tight">Chào mừng quay lại</h2>
        <p className="text-gray-500 text-base font-medium">Vui lòng nhập thông tin để đăng nhập.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 animate-in fade-in zoom-in-95">
            {errors.root.message}
          </div>
        )}

        {/* Username */}
        <div className="space-y-2">
          <Label className="sr-only" htmlFor="username">
            Tên đăng nhập
          </Label>
          <Input
            id="username"
            placeholder="TÊN ĐĂNG NHẬP / EMAIL"
            disabled={isLoading}
            {...register('username')}
            className={`rounded-2xl h-16 px-6 bg-gray-50 border-transparent 
              focus:bg-white focus:ring-4 focus:ring-zinc-100 transition-all 
              text-base font-medium tracking-wide placeholder:text-gray-400
              ${errors.username ? 'border-red-500 focus:ring-red-50' : 'focus:border-gray-200'}`}
          />
          {errors.username && (
            <p className="text-xs text-red-500 px-4 mt-1 font-medium italic">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="sr-only" htmlFor="password">
            Mật khẩu
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="MẬT KHẨU"
            disabled={isLoading}
            {...register('password')}
            className={`rounded-2xl h-16 px-6 bg-gray-50 border-transparent 
              focus:bg-white focus:ring-4 focus:ring-zinc-100 transition-all 
              text-base font-medium tracking-wide placeholder:text-gray-400
              ${errors.password ? 'border-red-500 focus:ring-red-50' : 'focus:border-gray-200'}`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 px-4 mt-1 font-medium italic">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-zinc-900 hover:bg-black text-white font-bold tracking-[0.15em] transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-3 active:scale-[0.97] text-base"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">ĐANG ĐĂNG NHẬP...</span>
                <Loader2 className="w-5 h-5 animate-spin" />
              </>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        {/* Extra Links */}
        <div className="flex justify-between items-center px-2 text-[12px] text-gray-400 font-bold tracking-wider uppercase mt-4">
          <a
            href="#"
            className="hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900"
          >
            Quên mật khẩu
          </a>
          <a
            href="#"
            className="hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900"
          >
            Chính sách bảo mật
          </a>
        </div>

        {/* FOOTER */}
        <div className="relative mt-10 pt-10 border-t border-gray-100">
          <p className="text-center text-base text-gray-500">
            Chưa có tài khoản?{' '}
            <Link
              to="/auth/register"
              className="font-bold text-zinc-900 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 hover:underline underline-offset-8"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
