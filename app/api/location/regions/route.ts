import { NextRequest, NextResponse } from "next/server";

// Fetch regions (states) for a country using countriesnow.space
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");

    if (!country) {
      return NextResponse.json(
        { status: "INVALID_REQUEST", error_message: "Missing country" },
        { status: 400 }
      );
    }

    const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok || payload?.error) {
      return NextResponse.json(
        {
          status: "ERROR",
          error_message: payload?.msg || payload?.error || "Failed to fetch regions",
          data: [],
        },
        { status: response.status }
      );
    }

    const states = Array.isArray(payload?.data?.states)
      ? payload.data.states.map((state: any, index: number) => ({
          id: state?.state_code || state?.name || `${country}-${index}`,
          name: state?.name || state?.state_code || "",
          shortName: state?.state_code || undefined,
        }))
      : [];

    return NextResponse.json({ status: "OK", data: states }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        error_message: error?.message || "Unexpected error",
        data: [],
      },
      { status: 500 }
    );
  }
}
