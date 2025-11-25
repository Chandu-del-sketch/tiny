import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

const prisma = new PrismaClient();

async function getLink(code: string) {
  const link = await prisma.link.findUnique({
    where: { shortcode: code },
  });

  if (!link) {
    notFound();
  }
  

  return link;
}

export default async function StatsPage({ params }: { params: { code: string } }) {
  const { code } = await params;
  const link = await getLink(code);

  // redirect(link.url);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Link Statistics</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <span className="font-bold">Short Link:</span>{' '}
            <a href={`/${link.shortcode}`} className="text-blue-500">
              {`${process.env.BASE_URL}/${link.shortcode}`}
            </a>
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <span className="font-bold">Original URL:</span>{' '}
            <a href={link.url} className="text-blue-500">
              {link.url}
            </a>
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <span className="font-bold">Total Clicks:</span> {link.totalClicks}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <span className="font-bold">Last Clicked:</span>{' '}
            {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-base">
            <span className="font-bold">Created At:</span>{' '}
            {new Date(link.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
