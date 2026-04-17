import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import LoginPage from '@/features/auth/page/LoginPage';
import RegisterPage from '@/features/auth/page/RegisterPage';

import ProductDetailPage from '@/features/home/page/ProductDetailPage';
import HomePage from '@/features/home/page/HomePage';
import { SearchResults } from '@/features/home/page/SearchResults';

import CheckoutPage from '@/features/checkout/pages/CheckoutPage';
import { PaymentFailurePage } from '@/features/checkout/pages/PaymentFailurePage';
import { PaymentSuccessPage } from '@/features/checkout/pages/PaymentSuccessPage';

import { MainLayout } from '@/components/layout/MainLayout';
import { RequireRole } from './protected-route';

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'shop', element: <SearchResults /> },
          {
            path: 'products',
            children: [{ path: ':productId', element: <ProductDetailPage /> }],
          },
          {
            path: 'checkout',
            element: (
              <RequireRole allowedRoles={['customer']}>
                <Outlet />
              </RequireRole>
            ),
            children: [
              { index: true, element: <CheckoutPage /> },
              { path: 'failure', element: <PaymentFailurePage /> },
              { path: 'success', element: <PaymentSuccessPage /> },
            ],
          },
        ],
      },

      // Public Auth Routes
      {
        path: 'auth',
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      {
        path: 'dummy',
        element: (
          <RequireRole>
            <Outlet />
          </RequireRole>
        ),
        children: [],
        ],
      },


      },
    ],

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
