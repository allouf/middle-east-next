// User Addresses API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { AddAddressRequest } from '@/types/user/addresses';

export async function GET(request: NextRequest) {
  return apiHandler(request, {
    method: 'GET',
    endpoint: '/addresses',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as AddAddressRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/addresses/add',
    body,
  });
}

