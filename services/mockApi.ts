import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { mockUsers } from '@/mocks/users.mock';
import { mockOrderPage, mockOrders } from '@/mocks/orders.mock';
import { mockProducts, mockVariantsByProductId } from '@/mocks/products.mock';
import type { BaseResponse } from '@/types/base-response';
import type { ApiResponse as AuthApiResponse, AuthResponse, UserRegistrationResult } from '@/features/auth/types';
import type { GetOrdersParams, Order, OrderPageResponse } from '@/features/manager/types/order-type';
import type {
  FilterParams,
  GetFilteredProductsResponse,
  GetVariantsResponse,
  Product,
} from '@/features/home/types/product-type';

type Policy = {
  id: number;
  managerUserId: string;
  managerUsername: string;
  code: string;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
};

type PolicyForm = {
  code: string;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveTo: string;
};

type PolicyListResult = {
  items: Policy[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type Lens = {
  id: string;
  name: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
};

let policyAutoId = 3;
let policiesDb: Policy[] = [
  {
    id: 1,
    managerUserId: 'u_manager_001',
    managerUsername: 'manager',
    code: 'POLICY_RETURN_30_DAYS',
    title: 'Chính sách đổi trả 30 ngày',
    description: 'Đổi trả trong 30 ngày với điều kiện sản phẩm còn nguyên vẹn.',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-01-01',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 2,
    managerUserId: 'u_manager_001',
    managerUsername: 'manager',
    code: 'POLICY_WARRANTY_12_MONTHS',
    title: 'Bảo hành 12 tháng',
    description: 'Bảo hành lỗi sản xuất trong vòng 12 tháng kể từ ngày mua.',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2027-01-01',
    createdAt: '2026-01-01T08:10:00.000Z',
  },
];

let lensesDb: Lens[] = [
  { id: 'l_001', name: 'Lens Standard', price: 250000, status: 'ACTIVE' },
  { id: 'l_002', name: 'Lens Blue Cut', price: 450000, status: 'ACTIVE' },
];

type MockScenario = 'success' | 'empty' | 'error';

const randomDelayMs = () => 300 + Math.floor(Math.random() * 700);

const envScenario = (): MockScenario => {
  const raw = (import.meta as any).env?.VITE_MOCK_SCENARIO as string | undefined;
  if (raw === 'empty' || raw === 'error' || raw === 'success') return raw;
  return 'success';
};

export interface MockOptions {
  scenario?: MockScenario;
  errorStatus?: number;
  errorMessage?: string;
}

class MockHttpError extends Error {
  status: number;
  payload: any;
  constructor(status: number, payload: any) {
    super(payload?.message ?? 'Mock error');
    this.status = status;
    this.payload = payload;
  }
}

const ok = <T>(result: T, message = 'OK', code = 0): BaseResponse<T> => ({
  code,
  message,
  result,
});

const fail = (status: number, message: string, code = status): never => {
  throw new MockHttpError(status, { code, message, result: null });
};

const parseBody = (data: any) => {
  if (!data) return undefined;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

const asNumber = (v: any, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseQueryString = (url: string): Record<string, string> => {
  const idx = url.indexOf('?');
  if (idx < 0) return {};
  const qs = url.slice(idx + 1);
  const sp = new URLSearchParams(qs);
  const out: Record<string, string> = {};
  sp.forEach((value, key) => {
    out[key] = value;
  });
  return out;
};

const base64UrlEncode = (input: string) => {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const createMockJwt = (user: { id: string; username: string; firstName: string; lastName: string; role: string }) => {
  const header = { alg: 'none', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const scope = `ROLE_${String(user.role).toUpperCase()}`;
  const payload = {
    sub: user.username,
    scope,
    userId: user.id,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    iat: now,
    exp: now + 60 * 60,
    jti: `mock-${user.id}-${now}`,
  };

  return `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;
};

const filterProducts = (params: FilterParams): Product[] => {
  const q = params.q?.toLowerCase().trim();
  let res = [...mockProducts];

  if (q) {
    res = res.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (params.gender) {
    res = res.filter((p) => p.gender === params.gender);
  }

  if (params.status) {
    res = res.filter((p) => p.status === params.status);
  }

  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  if (typeof minPrice === 'number') res = res.filter((p) => p.maxPrice >= minPrice);
  if (typeof maxPrice === 'number') res = res.filter((p) => p.minPrice <= maxPrice);

  return res;
};

const buildAxiosResponse = async <T>(
  config: AxiosRequestConfig,
  data: T,
  status = 200,
): Promise<AxiosResponse<T>> => {
  await new Promise((r) => setTimeout(r, randomDelayMs()));
  return {
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'ERROR',
    headers: {},
    config: config as any,
  };
};

export const mockApi = {
  async handle(config: AxiosRequestConfig, options: MockOptions = {}): Promise<AxiosResponse<any>> {
    const scenario = options.scenario ?? envScenario();
    if (scenario === 'error') {
      fail(options.errorStatus ?? 500, options.errorMessage ?? 'Mock: Internal Server Error');
    }

    const method = (config.method ?? 'get').toLowerCase();
    const url = config.url ?? '';
    const params: any = { ...(config.params ?? {}), ...parseQueryString(url) };
    parseBody(config.data);

    try {
      if (method === 'post' && url === '/auth/login') {
        const data = (parseBody(config.data) ?? {}) as { username?: string; password?: string };
        const username = String(data.username ?? '').trim();
        if (!username) fail(400, 'Missing username');

        const user = mockUsers.find((u) => u.username === username);
        if (!user) fail(401, 'Invalid credentials');

        const token = createMockJwt(user!);
        const result: AuthResponse = { token, authenticated: true };
        return buildAxiosResponse(config, ok(result) satisfies AuthApiResponse<AuthResponse>);
      }

      if (method === 'post' && url === '/auth/refresh') {
        const baseUser = mockUsers[0];
        if (!baseUser) fail(500, 'No mock user configured');
        const result: AuthResponse = { token: createMockJwt(baseUser), authenticated: true };
        return buildAxiosResponse(config, ok(result) satisfies AuthApiResponse<AuthResponse>);
      }

      if (method === 'post' && url === '/auth/logout') {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'post' && url === '/users/registration') {
        const result: UserRegistrationResult = {
          id: 'u_customer_002',
          username: 'new_user',
          firstName: 'New',
          lastName: 'User',
          dob: '2000-01-01',
        };
        return buildAxiosResponse(config, { code: 0, result } as any);
      }

      if (method === 'get' && url === '/users') {
        const role = params.role as string | undefined;
        const result = role ? mockUsers.filter((u) => u.role === role) : mockUsers;
        return buildAxiosResponse(config, ok(result));
      }

      if (method === 'delete' && url.startsWith('/users/')) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'put' && url.includes('/role')) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'get' && url === '/products') {
        if (scenario === 'empty') return buildAxiosResponse(config, ok([] as Product[]));
        return buildAxiosResponse(config, ok(mockProducts));
      }

      if (method === 'post' && url === '/products') {
        const created = {
          ...mockProducts[0],
          id: `p_${Math.floor(1000 + Math.random() * 9000)}`,
          name: 'New Product',
        };
        return buildAxiosResponse(config, ok(created));
      }

      if (method === 'put' && url.startsWith('/products/')) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'delete' && url.startsWith('/products/')) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'post' && /\/products\/.+\/model$/.test(url)) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'get' && /^\/products\/.+/.test(url) && !url.includes('/variants') && !url.includes('/filter')) {
        const id = url.split('/')[2];
        const found = mockProducts.find((p) => p.id === id);
        if (!found) fail(404, 'Product not found');
        return buildAxiosResponse(config, ok(found));
      }

      if (method === 'get' && url === '/products/filter') {
        const filterParams = params as FilterParams;
        const page = asNumber(filterParams.page, 0);
        const size = asNumber(filterParams.size, 10);

        const filtered = filterProducts(filterParams);
        const start = page * size;
        const sliced = filtered.slice(start, start + size);

        const response: GetFilteredProductsResponse = {
          result: {
            items: scenario === 'empty' ? [] : sliced,
            totalElements: filtered.length,
            totalPages: Math.max(1, Math.ceil(filtered.length / size)),
          },
          message: 'OK',
          statusCode: 200,
        };

        return buildAxiosResponse(config, response);
      }

      if (method === 'get' && url.includes('/variants') && url.startsWith('/products/')) {
        const parts = url.split('/');
        const productId = parts[2];
        const items = mockVariantsByProductId[productId] ?? [];

        const page = asNumber(params.page, 0);
        const size = asNumber(params.size, 10);
        const start = page * size;
        const sliced = items.slice(start, start + size);

        const response: GetVariantsResponse = {
          result: {
            items: scenario === 'empty' ? [] : sliced,
            totalElements: items.length,
            totalPages: Math.max(1, Math.ceil(items.length / size)),
          },
          message: 'OK',
          statusCode: 200,
        };

        return buildAxiosResponse(config, response);
      }

      if (method === 'get' && url.startsWith('/management/orders')) {
        const p = params as GetOrdersParams;
        const page = asNumber(p.page, 0);
        const size = asNumber(p.size, 10);
        const status = p.status;

        const filtered = status ? mockOrders.filter((o) => o.orderStatus === status) : mockOrders;
        const result: OrderPageResponse = mockOrderPage(page, size, scenario === 'empty' ? [] : filtered);

        return buildAxiosResponse(config, ok(result));
      }

      if (method === 'get' && url.startsWith('/management/orders/')) {
        const orderId = url.split('/')[3];
        const found: Order | undefined = mockOrders.find((o) => o.orderId === orderId);
        if (!found) fail(404, 'Order not found');
        return buildAxiosResponse(config, ok(found));
      }

      if (method === 'delete' && url.startsWith('/management/orders/')) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'get' && url === '/orders/me') {
        const page = asNumber(params.page, 0);
        const size = asNumber(params.size, 10);
        const result = mockOrderPage(page, size, scenario === 'empty' ? [] : mockOrders);
        return buildAxiosResponse(config, ok(result));
      }

      if (method === 'get' && /^\/orders\/.+/.test(url)) {
        const orderId = url.split('/')[2];
        const found = mockOrders.find((o) => o.orderId === orderId);
        if (!found) fail(404, 'Order not found');
        return buildAxiosResponse(config, ok(found));
      }

      if (method === 'post' && url === '/payment/checkout') {
        const orderIdParam: unknown = params.orderId;
        if (typeof orderIdParam === 'string') {
          const orderId = orderIdParam;
          if (!orderId) fail(400, 'Missing orderId');

          const order = mockOrders.find((o) => o.orderId === orderId);
          if (!order) fail(404, 'Order not found');
          const confirmedOrder = order!;

          confirmedOrder.paidAmount = confirmedOrder.totalAmount;
          confirmedOrder.remainingAmount = 0;
          confirmedOrder.orderStatus = 'CONFIRMED';

          const hasFinalPayment = confirmedOrder.payments.some((p) => p.paymentPurpose === 'FINAL');
          if (!hasFinalPayment) {
            confirmedOrder.payments.push({
              id: `pay_${orderId}_final_${Date.now()}`,
              paymentMethod: 'VNPAY',
              paymentPurpose: 'FINAL',
              amount: Math.max(confirmedOrder.totalAmount - (confirmedOrder.depositAmount ?? 0), 0),
              percentage: 100,
              status: 'PAID',
              paymentDate: new Date().toISOString(),
              description: 'Thanh toán hoàn tất',
              transactionReference: `TXN_${orderId}_FINAL`,
            } as any);
          }

          const paymentUrl = `/checkout/success?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent('customer@example.com')}`;
          return buildAxiosResponse(config, ok(paymentUrl));
        }
        fail(400, 'Missing orderId');
      }

      if (url.startsWith('/api/policies')) {
        if (method === 'get' && url === '/api/policies') {
          const page = asNumber(params.page, 0);
          const size = asNumber(params.size, 10);
          const start = page * size;
          const sliced = scenario === 'empty' ? [] : policiesDb.slice(start, start + size);
          const result: PolicyListResult = {
            items: sliced,
            page,
            size,
            totalElements: policiesDb.length,
            totalPages: Math.max(1, Math.ceil(policiesDb.length / size)),
          };
          return buildAxiosResponse(config, ok(result));
        }

        if (method === 'get' && /^\/api\/policies\/[0-9]+$/.test(url)) {
          const id = Number(url.split('/')[3]);
          const found = policiesDb.find((p) => p.id === id);
          if (!found) fail(404, 'Policy not found');
          return buildAxiosResponse(config, ok(found));
        }

        if (method === 'post' && url === '/api/policies') {
          const data = (parseBody(config.data) ?? {}) as PolicyForm;
          const now = new Date().toISOString();
          const created: Policy = {
            id: policyAutoId++,
            managerUserId: 'u_manager_001',
            managerUsername: 'manager',
            code: data.code ?? `POLICY_${Date.now()}`,
            title: data.title ?? 'New Policy',
            description: data.description ?? '',
            effectiveFrom: data.effectiveFrom ?? '2026-01-01',
            effectiveTo: data.effectiveTo ?? '2027-01-01',
            createdAt: now,
          };
          policiesDb = [created, ...policiesDb];
          return buildAxiosResponse(config, ok(created));
        }

        if (method === 'put' && /^\/api\/policies\/[0-9]+$/.test(url)) {
          const id = Number(url.split('/')[3]);
          const data = (parseBody(config.data) ?? {}) as PolicyForm;
          const idx = policiesDb.findIndex((p) => p.id === id);
          if (idx < 0) fail(404, 'Policy not found');
          policiesDb[idx] = {
            ...policiesDb[idx],
            code: data.code ?? policiesDb[idx].code,
            title: data.title ?? policiesDb[idx].title,
            description: data.description ?? policiesDb[idx].description,
            effectiveFrom: data.effectiveFrom ?? policiesDb[idx].effectiveFrom,
            effectiveTo: data.effectiveTo ?? policiesDb[idx].effectiveTo,
          };
          return buildAxiosResponse(config, ok(policiesDb[idx]));
        }

        if (method === 'delete' && /^\/api\/policies\/[0-9]+$/.test(url)) {
          const id = Number(url.split('/')[3]);
          policiesDb = policiesDb.filter((p) => p.id !== id);
          return buildAxiosResponse(config, ok(true));
        }
      }

      if (url.startsWith('/lenses')) {
        if (method === 'get' && url === '/lenses') {
          return buildAxiosResponse(config, { code: 0, message: 'OK', result: scenario === 'empty' ? [] : lensesDb });
        }
        if (method === 'post' && url === '/lenses') {
          const data = (parseBody(config.data) ?? {}) as Partial<Lens>;
          const created: Lens = {
            id: `l_${Math.floor(1000 + Math.random() * 9000)}`,
            name: data.name ?? 'New Lens',
            price: typeof data.price === 'number' ? data.price : 300000,
            status: 'ACTIVE',
          };
          lensesDb = [created, ...lensesDb];
          return buildAxiosResponse(config, { code: 0, message: 'OK', result: created });
        }
      }

      if (url.startsWith('/product-variants')) {
        if (method === 'post' && url === '/product-variants') return buildAxiosResponse(config, ok(true));
        if (method === 'put' && /^\/product-variants\/.+/.test(url)) return buildAxiosResponse(config, ok(true));
        if (method === 'delete' && /^\/product-variants\/.+/.test(url)) return buildAxiosResponse(config, ok(true));
      }

      if (url.startsWith('/refund')) {
        if (method === 'patch' && /\/refund\/variant\/.+\/in-activate$/.test(url)) return buildAxiosResponse(config, ok(true));
        if (method === 'get' && url.startsWith('/refund/affected-orders/')) return buildAxiosResponse(config, ok([]));
        if (method === 'get' && url === '/refund/ready') return buildAxiosResponse(config, ok([]));
        if (method === 'post' && url === '/refund/create-batch') return buildAxiosResponse(config, ok([]));
        if (method === 'post' && /\/refund\/.+\/refund-checkout$/.test(url)) return buildAxiosResponse(config, ok(null));
      }

      if (url.startsWith('/production/orders')) {
        if (method === 'put' && /\/production\/orders\/.+\/start$/.test(url)) return buildAxiosResponse(config, ok(mockOrders[0]));
        if (method === 'put' && /\/production\/orders\/.+\/finish$/.test(url)) return buildAxiosResponse(config, ok(mockOrders[0]));
        if (method === 'put' && /\/production\/orders\/items\/.+\/status$/.test(url)) return buildAxiosResponse(config, ok(true));
        if (method === 'put' && url === '/production/orders/ready-to-ship') return buildAxiosResponse(config, ok(true));
      }

      if (url.startsWith('/ship/orders')) {
        if (method === 'patch' && url === '/ship/orders/accept') return buildAxiosResponse(config, ok(true));
        if (method === 'patch' && /\/ship\/orders\/.+\/start-delivery$/.test(url)) return buildAxiosResponse(config, ok(true));
        if (method === 'patch' && /\/ship\/orders\/.+\/confirm-delivered$/.test(url)) return buildAxiosResponse(config, ok(true));
        if (method === 'get' && url === '/ship/orders/my-orders-accepted') return buildAxiosResponse(config, ok({ items: scenario === 'empty' ? [] : mockOrders }));
      }

      if (url.startsWith('/sales/orders') && method === 'put' && /\/sales\/orders\/.+\/verify$/.test(url)) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'get' && url === '/notifications/me') {
        const items = scenario === 'empty'
          ? []
          : [
              {
                id: 'n_001',
                title: 'Đơn hàng đang được xử lý',
                content: 'Đơn hàng #1001 đã chuyển sang trạng thái PROCESSING.',
                createdAt: new Date().toISOString(),
                read: false,
                isRead: false,
                type: 'INFO',
              },
            ];
        return buildAxiosResponse(config, ok(items));
      }

      if (method === 'get' && url === '/notifications/me/unread-count') {
        return buildAxiosResponse(config, ok({ unreadCount: scenario === 'empty' ? 0 : 1 }));
      }

      if (method === 'patch' && (url === '/notifications/me/read-all' || /\/notifications\/.+\/read$/.test(url))) {
        return buildAxiosResponse(config, ok(true));
      }

      if (method === 'get' && url === '/dashboard/revenue') {
        return buildAxiosResponse(config, ok({
          revenue: 152340000,
          revenueGrowth: 12.5,
          activeOrders: 7,
          ordersToday: 14,
          returnPending: 2,
          lowStockItems: 5,
        }));
      }

      return buildAxiosResponse(config, { code: 404, message: `Mock: Unhandled ${method.toUpperCase()} ${url}`, result: null }, 404);
    } catch (e: any) {
      if (e instanceof MockHttpError) {
        return buildAxiosResponse(config, e.payload, e.status);
      }
      return buildAxiosResponse(
        config,
        { code: 500, message: e?.message ?? 'Mock: Unknown error', result: null },
        500,
      );
    }
  },
};
