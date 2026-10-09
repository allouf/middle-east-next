// app/api/user/products/[id]/route.ts

import { NextRequest } from "next/server";
import { apiHandler } from "@/app/api/_utils/handler";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params; // ✅ لازم await

  console.log("prodId", id);

  return apiHandler(request, {
    method: "GET",
    endpoint: `/products/details/${id}`,
  });
}
