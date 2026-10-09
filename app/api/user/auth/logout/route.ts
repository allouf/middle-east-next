// User Logout API Route

import { NextRequest } from 'next/server';
import { apiHandler } from '@/app/api/_utils/handler';

export async function POST(request: NextRequest) {
  return apiHandler(request, {
    method: 'POST',
    endpoint: '/logout',
  });
}

