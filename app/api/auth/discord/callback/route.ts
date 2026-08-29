import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify({ hello: "world" }), {
    headers: { 'content-type': 'application/json' }
  });
}
