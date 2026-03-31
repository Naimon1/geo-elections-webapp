import { NextResponse } from 'next/server';

const VALID_TYPES = [
  'candidate',
  'election',
  'past_result',
  'document',
  'notice',
  'about_section',
  'official',
  'councilor_role',
  'announcement',
] as const;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, action, ...payload } = data;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid submission type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.MAKE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('Make.com webhook URL is not configured');
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        action: action || 'create',
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send data to webhook');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in submit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
