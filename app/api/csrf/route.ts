import { NextResponse } from 'next/server';
import { getCsrfToken } from '@/lib/csrf';

/**
 * GET /api/csrf
 * Get CSRF token for forms
 * Called by client before submitting forms
 */
export async function GET() {
  try {
    const token = await getCsrfToken();

    return NextResponse.json({
      token,
      header: 'x-csrf-token',
    });
  } catch (error: any) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
