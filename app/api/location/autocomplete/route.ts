import { NextRequest, NextResponse } from "next/server";
import { googleFetch, ensureGoogleKey } from "../googleClient";

const MIN_QUERY = 2;
const USER_AGENT = "middle-east-next/1.0 (autocomplete)";

const hasServerKey = () => {
  try {
    ensureGoogleKey();
    return true;
  } catch {
    return false;
  }
};

const osmTypes = {
  country: ["country"],
  city: ["locality"],
  town: ["locality"],
  village: ["locality"],
  hamlet: ["locality"],
  suburb: ["locality"],
  state: ["administrative_area_level_1"],
  province: ["administrative_area_level_1"],
  region: ["administrative_area_level_1"],
  county: ["administrative_area_level_2"],
  administrative: ["administrative_area_level_1"],
};

const osmPrediction = (item: any) => {
  const main = item?.display_name?.split(",")?.[0]?.trim() || item?.name || item?.display_name;
  const types =
    osmTypes[item?.type as keyof typeof osmTypes] || (item?.type ? [item.type] : ["geocode"]);

  return {
    place_id: `osm-${item?.place_id}`,
    description: item?.display_name,
    structured_formatting: {
      main_text: main,
      secondary_text: item?.display_name?.replace(main, "")?.replace(/^,/, "")?.trim() || "",
    },
    types,
  };
};

const fetchFromOsm = async (input: string, language: string, country?: string | null) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "8");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("q", input);
  url.searchParams.set("accept-language", language || "en");

  if (country) {
    url.searchParams.set("countrycodes", country.toLowerCase());
  }

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load locations");
  }

  const data = await response.json();
  const predictions = Array.isArray(data) ? data.map(osmPrediction) : [];
  return predictions;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");
    const country = searchParams.get("country");
    const types = searchParams.get("types");
    const language = searchParams.get("language");
    const sessiontoken = searchParams.get("sessiontoken") || undefined;

    if (!input || input.trim().length < MIN_QUERY) {
      return NextResponse.json(
        { status: "INVALID_REQUEST", predictions: [] },
        { status: 400 }
      );
    }

    const params: Record<string, string> = {
      input: input.trim(),
      language,
      types,
    };

    if (country) {
      params.components = `country:${country}`;
    }

    if (sessiontoken) {
      params.sessiontoken = sessiontoken;
    }

    let lastError: string | undefined;

    // Try Google first if a server key is present
    if (hasServerKey()) {
      try {
        const { response, payload } = await googleFetch("place/autocomplete/json", params);
        const status = payload?.status || "UNKNOWN_ERROR";

        if (response.ok && status === "OK") {
          return NextResponse.json(
            {
              status,
              error_message: payload?.error_message,
              predictions: payload?.predictions || [],
            },
            { status: response.status }
          );
        }

        lastError = payload?.error_message || status;
        // Fall through to OSM if Google rejects (e.g., referrer restriction)
      } catch (error: any) {
        lastError = error?.message;
      }
    }

    // Fallback: Nominatim (OSM) autocomplete without API key
    try {
      const predictions = await fetchFromOsm(input.trim(), language, country);
      return NextResponse.json(
        { status: "OK", error_message: undefined, predictions },
        { status: 200 }
      );
    } catch (osmError: any) {
      lastError = lastError || osmError?.message;
      throw osmError;
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        error_message: error?.message || "Unexpected error",
        predictions: [],
      },
      { status: 500 }
    );
  }
}
