// Seller Order by ID API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';

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
    endpoint: `/orders/${params.id}`,
  });
}

