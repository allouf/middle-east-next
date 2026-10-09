import { NextRequest, NextResponse } from "next/server";

// Reverse geocode without Google key restrictions using BigDataCloud
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const language = searchParams.get("language");

    if (!lat || !lng) {
      return NextResponse.json(
        { status: "INVALID_REQUEST", error_message: "Missing coordinates" },
        { status: 400 }
      );
    }

    const bdcUrl = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    bdcUrl.searchParams.set("latitude", lat);
    bdcUrl.searchParams.set("longitude", lng);
    bdcUrl.searchParams.set("localityLanguage", language);

    const response = await fetch(bdcUrl.toString(), { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "ERROR",
          error_message: payload?.error || "Failed to reverse geocode",
        },
        { status: response.status }
      );
    }

    const countryName = payload?.countryName;
    const countryCode = payload?.countryCode;
    const regionName =
      payload?.city ||
      payload?.locality ||
      payload?.principalSubdivision ||
      payload?.localityInfo?.administrative?.[0]?.name;
    const regionCode =
      payload?.principalSubdivisionCode ||
      payload?.localityInfo?.administrative?.[0]?.isoName;

    return NextResponse.json(
      {
        status: "OK",
        country: countryName
          ? {
              name: countryName,
              shortName: countryCode,
            }
          : null,
        region: regionName
          ? {
              name: regionName,
              shortName: regionCode,
            }
          : null,
      },
      { status: 200 }
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
