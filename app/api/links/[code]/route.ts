import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }:{params: Promise<{ code: string; }>;  }) {
  const { code } = await params;

  const link = await prisma.link.findUnique({
    where: { shortcode: code },
  });

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  return NextResponse.json(link);
}

export async function DELETE(req: NextRequest, { params }: {params: Promise<{ code: string; }>; }) {
  const { code } = await params;

  try {
    await prisma.link.delete({
      where: { shortcode: code },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
}
