import { NextRequest, NextResponse } from 'next/server';
import { getTinyMceApiKey } from '@/lib/security/apiKeys';

/**
 * Secure TinyMCE API proxy endpoint
 * This endpoint handles TinyMCE API requests on the server-side,
 * keeping the API key secure and never exposing it to the client.
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = getTinyMceApiKey();
    
    // Return the TinyMCE API key securely through server endpoint
    return NextResponse.json({
      apiKey: apiKey,
      // You can add additional configuration here
      cdn: 'https://cdn.tiny.cloud/1',
    });
    
  } catch (error) {
    console.error('TinyMCE API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TinyMCE configuration' },
      { status: 500 }
    );
  }
}

/**
 * Handle TinyMCE image upload and other POST requests
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const apiKey = getTinyMceApiKey();
    
    // Handle image uploads to TinyMCE
    if (formData.has('file')) {
      const file = formData.get('file') as File;
      
      // File validation
      const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ];
      
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG files are allowed.' },
          { status: 400 }
        );
      }
      
      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }
      
      // Validate file name to prevent path traversal
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
      if (!sanitizedName || sanitizedName !== file.name) {
        return NextResponse.json(
          { error: 'Invalid file name.' },
          { status: 400 }
        );
      }
      
      // Here you would typically:
      // 1. Scan file for malware (if you have antivirus)
      // 2. Upload to your secure storage service
      // 3. Return the actual URL from your storage service
      
      // For now, return a placeholder response with sanitized filename
      return NextResponse.json({
        location: `/uploads/${sanitizedName}`, // This should be your actual upload URL
        filename: sanitizedName,
        size: file.size,
        type: file.type
      });
    }
    
    // Handle other TinyMCE API requests
    const tinyMceUrl = `https://api.tiny.cloud/v1/content?apiKey=${apiKey}`;
    
    const response = await fetch(tinyMceUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`TinyMCE API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('TinyMCE API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process TinyMCE request' },
      { status: 500 }
    );
  }
}
