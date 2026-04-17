import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Package,
  ArrowRight,
  ChevronRight,
  Activity,
} from 'lucide-react';

import { useDashboardRevenue } from '../../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch, isFetching } = useDashboardRevenue();

  // Loading State với Skeleton Shadcn
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full text-destructive">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight">Lỗi tải dữ liệu</h2>
        <p className="text-muted-foreground max-w-sm">
          Hệ thống không thể kết nối tới máy chủ. Vui lòng thử lại sau.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Thử lại ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight italic flex items-center gap-2">
            <Activity className="text-primary" /> TỔNG QUAN QUẢN LÝ
          </h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là số liệu hệ thống hôm nay.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-full shadow-sm"
        >
          <RefreshCw size={16} className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Làm mới dữ liệu
        </Button>
      </div>
        {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <Card className="border-none shadow-md bg-white overflow-hidden relative group hover:ring-2 ring-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Doanh thu
            </CardTitle>
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign size={20} />
            </div>
          </CardHeader>
          <CardContent></CardContent>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <Card className="border-none shadow-md bg-white overflow-hidden relative group hover:ring-2 ring-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Doanh thu
            </CardTitle>
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                stats.revenue,
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant={stats.revenueGrowth >= 0 ? 'default' : 'destructive'}
                className="rounded-md"
              >
                {stats.revenueGrowth >= 0 ? (
                  <TrendingUp size={12} className="mr-1" />
                ) : (
                  <TrendingDown size={12} className="mr-1" />
                )}
                {Math.abs(stats.revenueGrowth)}%
              </Badge>
              <span className="text-[11px] text-muted-foreground font-medium uppercase">
                vs tháng trước
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Đơn hàng */}
        <Card
          className="border-none shadow-md bg-white hover:ring-2 ring-primary/20 transition-all cursor-pointer"
          onClick={() => navigate('/manager/orders')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Đơn hàng mới
            </CardTitle>
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <ShoppingCart size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {stats.activeOrders}{' '}
              <span className="text-xs text-muted-foreground font-normal">ĐANG XỬ LÝ</span>
            </div>
            <p className="text-[11px] mt-2 text-blue-600 font-bold uppercase flex items-center">
              + {stats.ordersToday} đơn phát sinh hôm nay <ChevronRight size={12} />
            </p>
          </CardContent>
        </Card>

        {/* Đổi trả */}
        <Card
          className="border-none shadow-md bg-white hover:ring-2 ring-primary/20 transition-all cursor-pointer"
          onClick={() => navigate('/manager/refunds')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Chờ đổi trả
            </CardTitle>
            <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <RotateCcw size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {stats.returnPending}{' '}
              <span className="text-xs text-muted-foreground font-normal">YÊU CẦU</span>
            </div>
            <p className="text-[11px] mt-2 text-muted-foreground font-medium uppercase">
              Cần kiểm định ngay
            </p>
          </CardContent>
        </Card>

        {/* Tồn kho */}
        <Card
          className="border-none shadow-md bg-white border-b-4 border-b-destructive hover:ring-2 ring-primary/20 transition-all cursor-pointer"
          onClick={() => navigate('/manager/products')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Cảnh báo kho
            </CardTitle>
            <div className="h-10 w-10 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive">
              <Package size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-destructive">
              {stats.lowStockItems}{' '}
              <span className="text-xs text-muted-foreground font-normal">SẢN PHẨM</span>
            </div>
            {stats.lowStockItems > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive animate-ping" />
            )}
            <p className="text-[11px] mt-2 text-destructive font-bold uppercase">
              Yêu cầu nhập thêm hàng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => navigate('/manager/products')}
          className="group relative bg-slate-900 rounded-[2.5rem] p-10 text-white cursor-pointer overflow-hidden shadow-2xl transition-all hover:-translate-y-1 hover:shadow-primary/20"
        >
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div>
              <h3 className="text-3xl font-black italic mb-3">KHO HÀNG & LENS</h3>
              <p className="text-slate-400 max-w-xs leading-relaxed">
                Quản lý danh mục gọng kính, tròng kính và kiểm soát tồn kho chi tiết.
              </p>
            </div>
            <div className="flex items-center gap-3 font-bold group-hover:text-primary transition-colors">
              ĐẾN TRANG QUẢN TRỊ{' '}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </div>
          </div>
          <Package
            size={180}
            className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div
          onClick={() => navigate('/manager/orders')}
          className="group relative bg-indigo-600 rounded-[2.5rem] p-10 text-white cursor-pointer overflow-hidden shadow-2xl transition-all hover:-translate-y-1 hover:shadow-indigo-300/40"
        >
          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            <div>
              <h3 className="text-3xl font-black italic mb-3">XỬ LÝ ĐƠN HÀNG</h3>
              <p className="text-indigo-100 max-w-xs leading-relaxed">
                Theo dõi quy trình từ lúc khách đặt đến khi giao hàng thành công.
              </p>
            </div>
            <div className="flex items-center gap-3 font-bold group-hover:text-black transition-colors">
              XEM DANH SÁCH ĐƠN{' '}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </div>
          </div>
          <ShoppingCart
            size={180}
            className="absolute -bottom-10 -right-10 text-white/10 -rotate-12 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}
