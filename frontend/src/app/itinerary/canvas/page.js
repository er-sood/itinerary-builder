import AuthGuard from "@/components/AuthGuard";
import CanvasClient from "./CanvasClient";

export default function Page() {
  return (
    <AuthGuard>
      <CanvasClient />
    </AuthGuard>
  );
}
