// User Register as Freelancer API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';
import { RegisterasFreelancerRequest } from '@/types/user/auth';

export async function POST(request: NextRequest) {
  const body = await request.json() as RegisterasFreelancerRequest;
  
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/register/freelancer',
    body,
  });
}

