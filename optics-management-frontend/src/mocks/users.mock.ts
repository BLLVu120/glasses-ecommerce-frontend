export interface MockUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'SALE' | 'OPERATION' | 'SHIPPER' | 'CUSTOMER' | 'MANAGER' | 'ADMIN';
  imageUrl?: string | null;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'u_admin_001',
    username: 'admin',
    firstName: 'System',
    lastName: 'Admin',
    dob: '1990-01-15',
    email: 'admin@optics.local',
    phone: '0900000001',
    status: 'ACTIVE',
    role: 'ADMIN',
    imageUrl: null,
    createdAt: '2025-12-01T08:00:00.000Z',
  },
  {
    id: 'u_manager_001',
    username: 'manager',
    firstName: 'Mai',
    lastName: 'Nguyen',
    dob: '1992-03-12',
    email: 'manager@optics.local',
    phone: '0900000002',
    status: 'ACTIVE',
    role: 'MANAGER',
    imageUrl: null,
    createdAt: '2025-12-05T08:00:00.000Z',
  },
  {
    id: 'u_customer_001',
    username: 'customer',
    firstName: 'An',
    lastName: 'Tran',
    dob: '1998-10-08',
    email: 'customer@optics.local',
    phone: '0900000003',
    status: 'ACTIVE',
    role: 'CUSTOMER',
    imageUrl: null,
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'u_shipper_001',
    username: 'shipper',
    firstName: 'Phong',
    lastName: 'Le',
    dob: '1995-06-18',
    email: 'shipper@optics.local',
    phone: '0900000004',
    status: 'ACTIVE',
    role: 'SHIPPER',
    imageUrl: null,
    createdAt: '2026-01-12T08:00:00.000Z',
  },
  {
    id: 'u_sale_001',
    username: 'sale',
    firstName: 'Linh',
    lastName: 'Pham',
    dob: '1996-09-22',
    email: 'sale@optics.local',
    phone: '0900000005',
    status: 'ACTIVE',
    role: 'SALE',
    imageUrl: null,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'u_operation_001',
    username: 'operation',
    firstName: 'Huy',
    lastName: 'Vo',
    dob: '1994-11-02',
    email: 'operation@optics.local',
    phone: '0900000006',
    status: 'ACTIVE',
    role: 'OPERATION',
    imageUrl: null,
    createdAt: '2026-01-16T08:00:00.000Z',
  },
];
