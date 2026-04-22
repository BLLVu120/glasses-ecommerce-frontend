import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/routes';
import { AuthProvider } from './routes/AppAuthProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
