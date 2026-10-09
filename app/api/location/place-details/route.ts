import { NextRequest, NextResponse } from "next/server";
import { googleFetch } from "../googleClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");
    const language = searchParams.get("language");

    if (!placeId) {
      return NextResponse.json(
        { status: "INVALID_REQUEST", error_message: "Missing placeId" },
        { status: 400 }
      );
    }

    const { response, payload } = await googleFetch("place/details/json", {
      place_id: placeId,
      language,
      fields: "address_component",
    });

    const status = payload?.status || "UNKNOWN_ERROR";

    if (!response.ok || status !== "OK") {
      return NextResponse.json(
        {
          status,
          error_message: payload?.error_message || "Failed to load place details",
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        status,
        result: payload?.result || {},
      },
      { status: response.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        error_message: error?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
