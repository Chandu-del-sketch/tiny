import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const links = await prisma.link.findMany();
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const { longUrl, shortCode } = await req.json();

  if (!longUrl) {
    return NextResponse.json({ error: 'longUrl is required' }, { status: 400 });
  }

  try {
    new URL(longUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (shortCode) {
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(shortCode)) {
      return NextResponse.json({ error: 'Invalid short code format' }, { status: 400 });
    }

    const existingLink = await prisma.link.findUnique({
      where: { shortcode: shortCode },
    });

    if (existingLink) {
      return NextResponse.json({ error: 'Short code already exists' }, { status: 409 });
    }
  }

  const newShortCode = shortCode || Math.random().toString(36).substring(2, 8);

  const newLink = await prisma.link.create({
    data: {
      url: longUrl,
      shortcode: newShortCode,
    },
  });

  return NextResponse.json(newLink, { status: 201 });
}
