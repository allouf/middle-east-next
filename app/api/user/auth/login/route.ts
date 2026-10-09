// User Login API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { LoginRequest } from '@/types/user';

export async function POST(request: NextRequest) {
  const body = await request.json() as LoginRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/login',
    body,
  });
}

