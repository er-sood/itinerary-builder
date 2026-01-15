import dynamic from "next/dynamic";

const CreateItineraryClient = dynamic(() => import("./CreateItineraryClient"), {
  ssr: false,
});

export default function Page() {
  return <CreateItineraryClient />;
}
