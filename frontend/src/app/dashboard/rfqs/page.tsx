import Link from "next/link";
import { getRfqs } from "@/data/loaders";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "@/components/custom/search";
import { PaginationComponent } from "@/components/custom/pagination-component";

interface LinkCardProps {
  documentId: string;
  title: string;
  dueDate: number;
  requiredAmount: number;
  quotes: Array<any>;
}

function LinkCard({ documentId, title, dueDate, requiredAmount, quotes }: Readonly<LinkCardProps>) {
  return (
    <Link href={`/dashboard/rfqs/${documentId}`}>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="leading-8 text-pink-500">
            {title || "RFQ Title"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="w-full mb-4 leading-7">
            { quotes.length + " quotes submitted"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function RfqsRoute({
  searchParams,
}: Readonly<SearchParamsProps>) {
  // this will get our search params from the URL that we will pass to our getRfqs function
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const { data, meta } = await getRfqs(query, currentPage);
  const pageCount = meta?.pagination?.pageCount;

  console.log(data);

  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Search />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item: LinkCardProps) => (
          <LinkCard key={item.documentId} {...item} />
        ))}
      </div>
      <PaginationComponent pageCount={pageCount} />
    </div>
  );
}
