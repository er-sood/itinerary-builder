export const runtime = "nodejs";

import { pdf } from "@react-pdf/renderer";
import ItineraryPDF from "@/pdf/ItineraryPDF";

export async function POST(req) {
  const data = await req.json();

  const pdfBuffer = await pdf(
    <ItineraryPDF data={data} />
  ).toBuffer();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Oggy-Itinerary.pdf",
    },
  });
}
