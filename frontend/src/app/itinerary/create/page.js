export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const CreateItineraryClient = dynamicImport(
  () => import("./CreateItineraryClient"),
  { ssr: false }
);

export default function Page() {
  return <CreateItineraryClient />;
}
