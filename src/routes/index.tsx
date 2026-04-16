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

import { ManagerDashboardLayout } from '@/features/manager/layout/ManagerDashboardLayout';
import ManagerDashboardPage from '@/features/manager/page/dashboard/ManagerDashboardPage';
import ManagerOrderPage from '@/features/manager/page/orders/ManagerOrderPage';
import ProductManagePage from '@/features/manager/page/products/ProductManagePage';
import ProductVariantManagePage from '@/features/manager/page/products/ProductVariantManageage';
import StaffCustomerPage from '@/features/admin/page/StaffCustomerPage';
import LensesManagerPage from '@/features/manager/page/Lenses/LensesManagerPage';
import RefundManagePage from '@/features/manager/page/Refund/ManageRefundPage';
import PolicyManager from '@/features/manager/page/Policy/PolicyManager';

import OrderPage from '@/features/seller/page/order/OrderPage';
import OrderDetailPage from '@/features/seller/page/order/OrderDetailPage';

import { OpsStaffDashboardLayout } from '@/features/operation-staff/layout/OpsStaffDashboardLayout';
import OpsStaffDashboardPage from '@/features/operation-staff/page/dashboard/OpsStaffDashboardPage';
import { RequireRole } from './protected-route';
import { ShipperDashboardLayout } from '@/features/shipper/layout/ShipperDashboardLayout';
import ShipperDashboardPage from '@/features/shipper/page/dashboard/ShipperDashboardPage';
import { SellerLayout } from '@/features/seller/layout/SellerLayout';
import { AdminDashboardLayout } from '@/features/admin/layout/AdminDashboardLayout';

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
      {
        path: 'admin',
        element: (
          <RequireRole allowedRoles={['admin']}>
            <AdminDashboardLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <StaffCustomerPage /> },
        ],
      },


      // Protected Manager Routes
      {
        path: 'manager',
        element: (
          <RequireRole allowedRoles={['manager', 'admin']}>
            <ManagerDashboardLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <ManagerDashboardPage /> },
          { path: 'orders', element: <ManagerOrderPage /> },
          { path: 'products', element: <ProductManagePage /> },
          { path: 'products/:productId/variants', element: <ProductVariantManagePage /> },
          { path: 'lenses', element: <LensesManagerPage /> },
          { path: 'refunds', element: <RefundManagePage /> },
          { path: 'policies', element: <PolicyManager /> },
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

  // Protected Operation Staff Routes
  {
    path: 'ops-staff',
    element: (
      <RequireRole allowedRoles={['operation', 'admin']}>
        <OpsStaffDashboardLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <OpsStaffDashboardPage /> }],
  },

  // Protected Shipper Routes
  {
    path: 'shipper',
    element: (
      <RequireRole allowedRoles={['shipper', 'admin']}>
        <ShipperDashboardLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <ShipperDashboardPage /> }],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
