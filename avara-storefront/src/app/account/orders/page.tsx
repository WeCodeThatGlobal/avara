"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/context/AuthContext';
import { listOrders } from '../../../lib/api/orders';

type Order = {
  id: string;
  total: number;
  subtotal: number;
  shipping: number;
  payment_method: 'cash' | 'card';
  status: string;
  created_at: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; image?: string }>;
};

function formatCurrency(amount: number) {
  const value = Number(amount || 0);
  return `$${value.toFixed(2)}`;
}

const OrdersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      if (!authState.isAuthenticated) return;
      try {
        const result = await listOrders();
        if (result.success && result.data?.orders) {
          setOrders(result.data.orders as Order[]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.isAuthenticated]);

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const newOrderId = searchParams.get('new');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <Link href="/" className="text-blue-600 hover:underline">Back to Store</Link>
        </div>

        {newOrderId && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
            Order placed successfully. Order ID: <span className="font-semibold">{newOrderId}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-600 mb-4">You have no orders yet.</p>
            <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">{order.status}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                <div className="divide-y">
                  {order.items.map((item, idx) => (
                    <div key={`${order.id}-${item.id}-${idx}`} className="py-3 flex items-center gap-4">
                      <div className="w-14 h-14 bg-white border rounded-lg p-2 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image || 'https://placehold.co/100x100'} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;