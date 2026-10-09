// User Address by ID API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { UpdateAddressRequest } from '@/types/user/addresses';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const body = await request.json() as UpdateAddressRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: `/addresses/update/${params.id}`,
    body,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  return apiHandler(request, {
    method: 'POST',
    endpoint: `/addresses/remove/${params.id}`,
  });
}

