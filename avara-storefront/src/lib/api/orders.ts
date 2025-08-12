import { getApiAuth, postApiAuth } from '../api-client';

export interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface BillingDetailsInput {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  postCode: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: 'cash' | 'card';
  billing_details: BillingDetailsInput;
}

export async function createOrder(payload: CreateOrderInput): Promise<{
  success: boolean;
  message?: string;
  data?: {
    order: any;
  };
}> {
  const response = await postApiAuth('/store/customer/orders', payload);
  const data = await response.json();
  return data;
}

export async function listOrders(): Promise<{
  success: boolean;
  message?: string;
  data?: { orders: any[] };
}> {
  const response = await getApiAuth('/store/customer/orders');
  const data = await response.json();
  return data;
}
