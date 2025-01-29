import { getQuoteById} from "@/data/loaders";
import Link from "next/link";
import { SummaryForm } from "@/components/forms/summary-form";


interface ParamsProps {
    params: {
      quoteId: string;
    };
  }
  

export default async function SummaryPage({ params }: Readonly<ParamsProps>) {
    const { data: quote, meta } = await getQuoteById(params.quoteId);

    if (!quote) {
        return null;
    }

    const { supplier } = quote;

    console.log(quote);
    console.log(supplier);

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="col-span-2">
            <SummaryForm quoteId={ quote.documentId} />
          </div>
          <div className="col-span-1 bg-white p-4">
            {/* Sidebar content */}
            <h2 className="text-lg font-sm text-gray-900 font-bold">{ supplier?.contact }</h2>
            <h2 className="text-sm font-sm text-blue-700 font-bold">
                <Link href="" >{ supplier?.email }</Link>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                This is the core magic, drop in an email.
            </p>
          </div>
        </div>
      );
    

}
