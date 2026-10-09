// Seller Products API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { getQueryParams } from '@/app/api/_utils/handler';
import { CreateProductRequest } from '@/types/seller/products';

export async function GET(request: NextRequest) {
  const params = getQueryParams(request);
  
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/products',
    params,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.formData();
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/products/create',
    body,
  });
}

