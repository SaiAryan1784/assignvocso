import CityPageContent from './CityPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'City Projects',
}

interface PageParams {
  cityname: string;
}

export default async function CityPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  return <CityPageContent cityname={resolvedParams.cityname} />
}