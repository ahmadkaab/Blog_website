import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 *
 * Subscribes an email to ConvertKit via the v3 API.
 * The form creates a tag "blog-subscriber" for segmentation.
 *
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const apiSecret = process.env.CONVERTKIT_API_SECRET;

    if (!apiSecret) {
      console.error('CONVERTKIT_API_SECRET is not set');
      return NextResponse.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    // ConvertKit v3 API — subscribe to a tag or form
    // Using the /tags endpoint to create + subscribe in one call
    const response = await fetch('https://api.convertkit.com/v3/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // First, subscribe the email directly via the /subscribers endpoint
    const subscribeRes = await fetch(
      'https://api.convertkit.com/v3/subscribers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: apiSecret,
          email_address: email,
          state: 'active',
        }),
      }
    );

    if (!subscribeRes.ok) {
      const errorData = await subscribeRes.text();
      console.error('ConvertKit error:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
