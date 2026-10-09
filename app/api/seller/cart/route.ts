// Seller Cart API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { AddItemRequest, AddPackageRequest } from '@/types/seller/cart';

export async function GET(request: NextRequest) {
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/cart',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Determine if it's an item or package based on body structure
  const endpoint = body.package_id ? '/cart/add-package' : '/cart/add-item';
  
  return apiHandler(request, {
    method: 'POST',
    endpoint,
    body,
  });
}

