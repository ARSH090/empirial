import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let parsedJson = false;
  let hasPrivateKey = false;
  let hasClientEmail = false;

  if (serviceAccountKey) {
    try {
      const parsed = JSON.parse(serviceAccountKey);
      parsedJson = true;
      hasPrivateKey = !!parsed.private_key;
      hasClientEmail = !!parsed.client_email;
    } catch (e) {}
  }

  const diagnostics = {
    env: {
      VERCEL: process.env.VERCEL || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    },
    discord: {
      DISCORD_CLIENT_ID: {
        configured: !!process.env.DISCORD_CLIENT_ID,
        length: process.env.DISCORD_CLIENT_ID?.length || 0,
      },
      DISCORD_CLIENT_SECRET: {
        configured: !!process.env.DISCORD_CLIENT_SECRET,
        length: process.env.DISCORD_CLIENT_SECRET?.length || 0,
      },
      DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || 'not set',
    },
    firebaseAdmin: {
      FIREBASE_SERVICE_ACCOUNT_KEY: {
        configured: !!serviceAccountKey,
        length: serviceAccountKey?.length || 0,
        isValidJson: parsedJson,
        hasPrivateKey,
        hasClientEmail,
      },
      FIREBASE_CLIENT_EMAIL: {
        configured: !!process.env.FIREBASE_CLIENT_EMAIL,
        value: process.env.FIREBASE_CLIENT_EMAIL || 'not set',
      },
      FIREBASE_PRIVATE_KEY: {
        configured: !!process.env.FIREBASE_PRIVATE_KEY,
        length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      },
    },
    firebaseClient: {
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not set',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'not set',
    }
  };

  return NextResponse.json(diagnostics);
}
