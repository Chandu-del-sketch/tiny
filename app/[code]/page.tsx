import { PrismaClient } from '@prisma/client';
import { log } from 'console';
import { notFound, redirect } from 'next/navigation';

const prisma = new PrismaClient();

async function getLink(code: string) {
  console.log(`Fetching link for code: ${code}`);
  const link = await prisma.link.findUnique({
    where: { shortcode: code },
  });

  if (!link) {
    notFound();
  }

  await prisma.link.update({
    where: { shortcode: code },
    data: {
      totalClicks: {
        increment: 1,
      },
      lastClicked: new Date(),
    },
  });

  await prisma.link.update({
    where: { shortcode: code },
    data: {
      lastClicked: new Date(),
    },
  });

  return link;
}

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const { code } = await params; 
  const link = await getLink(code);
  
  
  redirect(link.url);
}
