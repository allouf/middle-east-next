import { NextRequest, NextResponse } from "next/server";

// Fetch all countries from a public source (Rest Countries)
export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,cca3",
      { cache: "force-cache" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { status: "ERROR", error_message: "Failed to fetch countries", data: [] },
        { status: response.status }
      );
    }

    const data = await response.json();

    const countries =
      Array.isArray(data)
        ? data
            .map((country: any) => ({
              id: country?.cca2 || country?.cca3 || country?.name?.common,
              name: country?.name?.common || "",
              shortName: country?.cca2 || country?.cca3 || "",
            }))
            .filter((c: any) => c.name)
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
        : [];

    return NextResponse.json({ status: "OK", data: countries }, { status: 200 });
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
