// Seller Orders API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { CreateOrderRequest } from '@/types/seller/orders';

export async function GET(request: NextRequest) {
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/orders',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as CreateOrderRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/orders/create',
    body,
  });
}

