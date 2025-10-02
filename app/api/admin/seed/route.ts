import { NextResponse } from 'next/server';

// Deprecated route; keep minimal surface to avoid lint errors

export async function POST() {
  try {
    return NextResponse.json({ error: 'Deprecated endpoint' }, { status: 410 });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({ error: 'Deprecated endpoint' }, { status: 410 });

  } catch (error) {
    console.error('Get version error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
