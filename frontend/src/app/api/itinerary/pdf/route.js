export const runtime = "nodejs";

import { pdf } from "@react-pdf/renderer";
import ItineraryPDF from "@/pdf/ItineraryPDF";

/* helper to make filename safe */
function safeFileName(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req) {
  const data = await req.json();

  const destination = data?.trip?.destination || "Trip";
  const clientName = data?.client?.name || "Client";

  const fileName =
    safeFileName(
      `${destination}-itinerary-for-${clientName}-by-oggy-holidays`
    ) + ".pdf";

  const pdfBuffer = await pdf(<ItineraryPDF data={data} />).toBuffer();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
