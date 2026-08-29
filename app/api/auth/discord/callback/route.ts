import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return new Response("Missing code");
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return new Response("Missing secrets");
    }

    return new Response("OK up to secrets: " + clientId + " / " + clientSecret.substring(0, 4));
  } catch (error: any) {
    return new Response("Error: " + error.message);
  }
}
