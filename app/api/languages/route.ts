import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';

export async function GET(request: NextRequest) {
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/languages',
  });
}

