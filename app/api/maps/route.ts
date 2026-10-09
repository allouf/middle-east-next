import { NextRequest, NextResponse } from 'next/server';
import { getGoogleMapsApiKey } from '@/lib/security/apiKeys';

/**
 * Secure Google Maps API proxy endpoint
 * This endpoint handles Google Maps API requests on the server-side,
 * keeping the API key secure and never exposing it to the client.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = getGoogleMapsApiKey();
    
    // Build the Google Maps URL with all parameters including the callback
    const params = new URLSearchParams(searchParams);
    params.set('key', apiKey);
    
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    
    const response = await fetch(googleMapsUrl);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }
    
    const data = await response.text();
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Google Maps API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Maps data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = getGoogleMapsApiKey();
    
    // Handle POST requests to Google Maps APIs (Geocoding, Places, etc.)
    const googleMapsUrl = `https://maps.googleapis.com/maps/api/${body.endpoint}?key=${apiKey}`;
    
    const response = await fetch(googleMapsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body.params),
    });
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Google Maps API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process Google Maps request' },
      { status: 500 }
    );
  }
}
