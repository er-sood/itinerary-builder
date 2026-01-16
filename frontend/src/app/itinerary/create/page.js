import AuthGuard from "@/components/AuthGuard";
import CreateItineraryClient from "./CreateItineraryClient";

export default function Page() {
  return (
    <AuthGuard>
      <CreateItineraryClient />
    </AuthGuard>
  );
}
