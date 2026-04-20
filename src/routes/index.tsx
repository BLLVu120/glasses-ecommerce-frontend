import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import LoginPage from '@/features/auth/page/LoginPage';
import RegisterPage from '@/features/auth/page/RegisterPage';

import { ProfileLayout } from '@/features/profile/layout/ProfileLayout';
import ProfilePage from '@/features/profile/page/ProfilePage';
import MyOrders from '@/features/profile/page/MyOrder';

import ProductDetailPage from '@/features/home/page/ProductDetailPage';
import HomePage from '@/features/home/page/HomePage';
import { SearchResults } from '@/features/home/page/SearchResults';

import CheckoutPage from '@/features/checkout/pages/CheckoutPage';
import { PaymentFailurePage } from '@/features/checkout/pages/PaymentFailurePage';
import { PaymentSuccessPage } from '@/features/checkout/pages/PaymentSuccessPage';

import { MainLayout } from '@/components/layout/MainLayout';

import OrderPage from '@/features/seller/page/order/OrderPage';
import OrderDetailPage from '@/features/seller/page/order/OrderDetailPage';
import { RequireRole } from './protected-route';
import { SellerLayout } from '@/features/seller/layout/SellerLayout';
import { SellerLayout } from '@/features/seller/layout/SellerLayout';
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

      // Protected Profile
      {
        path: 'profile',
        element: (
          <RequireRole>
            <ProfileLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'orders', element: <MyOrders /> },
        ],
      },
      // Protected Seller Routes
      {
        path: 'seller',
        element: (
          <RequireRole allowedRoles={['sale', 'admin']}>
            <SellerLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <OrderPage /> },
          { path: 'orders/:orderId', element: <OrderDetailPage /> },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
