// Seller Product by ID API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { UpdateProductRequest } from '@/types/seller/products';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  return apiHandler(request, {
    method: 'GET',
    endpoint: `/products/show/${params.id}`,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const body = await request.formData();
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: `/products/update/${params.id}`,
    body,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return apiHandler(request, {
    method: 'POST',
    endpoint: `/products/delete/${params.id}`,
  });
}

