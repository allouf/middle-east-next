// User Register as Company API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { RegisterasCompanyRequest } from '@/types/user/auth';

export async function POST(request: NextRequest) {
  const body = await request.formData();
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/register/company',
    body,
  });
}

