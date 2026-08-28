import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  // 1. Check if Firebase Admin SDK is initialized
  if (!adminAuth) {
    return NextResponse.json({
      error: 'Firebase Admin SDK is not initialized.',
      details: 'Please ensure that FIREBASE_SERVICE_ACCOUNT_KEY (containing valid "private_key" and "client_email") is set in your Vercel or local environment variables.'
    }, { status: 500 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: 'Discord OAuth credentials missing.',
      details: 'Please ensure DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET are configured in your environment variables.'
    }, { status: 500 });
  }
  
  // Construct redirect URI dynamically to match the current running environment (dev vs production Vercel)
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/discord/callback`;

  try {
    // 2. Exchange OAuth2 authorization code for an access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Discord Token Exchange failed:', errorText);
      return NextResponse.json({
        error: 'Discord Token Exchange failed',
        details: errorText
      }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 3. Fetch the Discord user's profile information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch Discord user profile:', errorText);
      return NextResponse.json({
        error: 'Failed to fetch Discord user profile',
        details: errorText
      }, { status: 400 });
    }

    const userData = await userResponse.json();
    const discordUserId = userData.id;
    const email = userData.email || null;
    const displayName = userData.global_name || userData.username;
    
    // Construct avatar URL if avatar exists
    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUserId}/${userData.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUserId) % 5}.png`;

    const uid = `discord:${discordUserId}`;

    // 4. Create or retrieve the Firebase User account
    let userRecord;
    try {
      userRecord = await adminAuth.getUser(uid);
      // Update display name or avatar if it has changed on Discord
      await adminAuth.updateUser(uid, {
        displayName,
        photoURL: avatarUrl,
        ...(email ? { email } : {}),
      });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        userRecord = await adminAuth.createUser({
          uid,
          email: email || undefined,
          displayName,
          photoURL: avatarUrl,
        });
      } else {
        console.error('Firebase Admin getUser error:', err);
        throw err;
      }
    }

    // 5. Generate a custom Firebase Auth Token
    const customToken = await adminAuth.createCustomToken(uid);

    // 6. Redirect back to the home page with the token
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('discord_token', customToken);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Unexpected Discord Auth error:', error);
    return NextResponse.json({
      error: 'Unexpected server error during Discord OAuth',
      message: error?.message || String(error),
      stack: error?.stack || null
    }, { status: 500 });
  }
}
