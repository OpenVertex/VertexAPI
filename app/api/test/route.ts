import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, method, queryParams, body: requestBody } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Construct URL with query parameters
    const targetUrl = new URL(url);
    if (queryParams && typeof queryParams === 'object') {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (key && value) {
          targetUrl.searchParams.append(key, String(value));
        }
      });
    }

    const start = Date.now();
    
    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        'User-Agent': 'VertexAPI-Manager/1.0',
        'Accept': 'application/json, text/plain, */*',
      },
    };

    // Add body for appropriate methods
    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
      fetchOptions.body = typeof requestBody === 'object' ? JSON.stringify(requestBody) : requestBody;
      if (typeof requestBody === 'object') {
        (fetchOptions.headers as any)['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(targetUrl.toString(), fetchOptions);

    const latency = Date.now() - start;
    const contentType = response.headers.get('content-type') || '';
    
    let body;
    let isImage = false;

    if (contentType.includes('image/')) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      body = `data:${contentType};base64,${base64}`;
      isImage = true;
    } else if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      latency,
      body,
      isImage,
      contentType,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Request failed',
      status: 500
    }, { status: 500 });
  }
}
