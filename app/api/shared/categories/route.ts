// Shared Categories API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { getQueryParams } from '@/app/api/_utils/handler';

export async function GET(request: NextRequest) {
  const params = getQueryParams(request);
  
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/categories',
    params,
  });
}

