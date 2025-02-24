import dynamic from "next/dynamic";

import { extractYouTubeID } from "@/lib/utils";
import { getSummaryById } from "@/data/loaders";
const NoSSR = dynamic(() => import("@/components/custom/youtube-player"), {
  ssr: false,
});

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  const data = await getSummaryById(params.videoId);
  console.log("############ DATA ###############");
  console.log("data", data);
  console.log("#################################");
  if (data?.error?.status === 404) return <p>No Items Found</p>;
  const videoId = "";
  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <div>
          </div>
        </div>
      </div>
    </div>
  );
}