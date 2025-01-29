import { getRfqById } from "@/data/loaders";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ParamsProps {
  params: {
    rfqId: string;
  };
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

const formatNumber = (number: number): string => {
  return number.toLocaleString("en-US", { useGrouping: true });
};

export default async function RfqPage({
  params,
}: Readonly<ParamsProps>) {
  const data = await getRfqById(params.rfqId);
  const { data: rfq } = data;
  const [...quotes] = rfq?.quotes ?? [];

  console.log(data);
  console.log(quotes);
  const pageCount = 1;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Table>
        <TableCaption>{ `A list of quotes from RFQ \"${ rfq.title}"` }</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Supplier</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="w-[140px]">HQ</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead className="w-[80px]">Date</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Certs</TableHead>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote: any) => (
            <TableRow key={quote.rfqId}>
              <TableCell className="font-medium">{ quote?.supplier?.name }</TableCell>
              <TableCell>{ quote?.supplier?.contact || 'N/A' }</TableCell>
              <TableCell>{ quote?.supplier?.hq || 'N/A' }</TableCell>
              <TableCell>{ `30 days` }</TableCell>
              <TableCell>{ formatDate(new Date(quote.submittedAt)) }</TableCell>
              <TableCell className="text-right">{ formatPrice(quote.pricePerPound) }</TableCell>
              <TableCell>{ quote.countryOfOrigin }</TableCell>
              <TableCell>{ quote.certifications || 'N/A' }</TableCell>
              <TableCell className="text-right">{ formatNumber(quote.minimumOrderQuantity) }</TableCell>
              <TableCell>
                <Link
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-small text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
                  href={`/dashboard/quotes/${quote.documentId}/summary`}
                >
                  { `Email` }
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>    
    </div>
  );
}