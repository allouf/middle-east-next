// User Register as Consumer API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { RegisterasConsumerRequest } from '@/types/user/auth';

export async function POST(request: NextRequest) {
  const body = await request.json() as RegisterasConsumerRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/register/consumer',
    body,
  });
}

