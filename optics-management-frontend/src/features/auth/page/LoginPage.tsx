import AuthLayout from '@/components/layout/AuthLayout';
import { LoginForm } from '@/features/auth'; // Import từ file index.ts

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
