import { NextResponse } from 'next/server';
import { ApiCheckResult } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const start = Date.now();
  try {
    // We use a timeout to prevent long-hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD', // HEAD is faster for checking availability
      signal: controller.signal,
      headers: {
        'User-Agent': 'VertexAPI-Manager/1.0',
      },
    }).catch(async (err) => {
        // If HEAD fails, try GET (some servers block HEAD)
        return await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'User-Agent': 'VertexAPI-Manager/1.0',
            },
        });
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - start;

    if (response.ok || (response.status >= 200 && response.status < 400)) {
      return NextResponse.json({
        status: 'online',
        latency,
      } as ApiCheckResult);
    } else {
      return NextResponse.json({
        status: 'offline',
        error: `Status Code: ${response.status}`,
        latency,
      } as ApiCheckResult);
    }
  } catch (error: any) {
    const latency = Date.now() - start;
    let errorMessage = 'Connection failed';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout';
    }

    return NextResponse.json({
      status: 'offline',
      error: errorMessage,
      latency,
    } as ApiCheckResult);
  }
}
