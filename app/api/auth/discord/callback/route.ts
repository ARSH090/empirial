import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ hello: "world" }, { status: 200 });
  } catch (error: any) {
    return new Response("error: " + (error?.message || String(error)));
  }
}
