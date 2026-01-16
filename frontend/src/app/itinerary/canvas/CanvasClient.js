"use client";
import { useRouter } from "next/navigation";

import { useState, useRef, useEffect } from "react";

import { supabase } from "@/lib/supabaseClient";

import AppHeader from "@/components/AppHeader";












const ACTIVITY_TYPES = [
  { key: "flight", label: "Flight", icon: "✈️" },
  { key: "hotel", label: "Hotel", icon: "🏨" },
  { key: "transport", label: "Transport", icon: "🚗" },
  { key: "sightseeing", label: "Sightseeing", icon: "📍" },
  { key: "meal", label: "Meal", icon: "🍽️" },
];

export default function CanvasClient() {

  /* ---------------- PACKAGE LEVEL ---------------- */

  

const [itineraryId, setItineraryId] = useState(null);

const [status, setStatus] = useState("DRAFT");
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setItineraryId(params.get("id"));
}, []);


  const [client, setClient] = useState({
  name: "",
});
const isFinal = status === "FINAL";


  const [trip, setTrip] = useState({
  destination: "",
  startDate: "",
  endDate: "",
  guests: "",
});

const router = useRouter();



  const [inclusions, setInclusions] = useState([
    "Accommodation",
    "Daily Breakfast",
  ]);
  const [exclusions, setExclusions] = useState([
    "Personal Expenses",
  ]);

  const [pricing, setPricing] = useState({
    adults: 2,
    adultCost: 25000,
    children: 0,
    childCost: 15000,
  });

  /* ---------------- DAY LEVEL ---------------- */

  const [days, setDays] = useState([
    {
      title: "Arrival & Welcome",
      description: ""
,
      activities: [],
      highlights: [],
    },
  ]);
  const [activeDay, setActiveDay] = useState(0);
const titleRef = useRef(null);
const prevDayRef = useRef(activeDay);
const [descriptionDraft, setDescriptionDraft] = useState("");






  
  const [highlightInput, setHighlightInput] = useState("");
  

  const day = days[activeDay] || {};

  /* ---------------- HELPERS ---------------- */


  
function deleteDay(index) {
  setDays((prev) => {
    if (prev.length === 1) return prev; // keep at least one day

    const updated = prev.filter((_, i) => i !== index);

    // Adjust activeDay safely
    setActiveDay((current) => {
      if (current === index) {
        return Math.max(0, index - 1);
      }
      if (current > index) {
        return current - 1;
      }
      return current;
    });

    return updated;
  });
}


useEffect(() => {
  setDescriptionDraft((days[activeDay]?.descriptionPoints || []).join("\n"));
}, [activeDay, days]);



  useEffect(() => {
  if (prevDayRef.current !== activeDay && titleRef.current) {
    titleRef.current.textContent = days[activeDay]?.title || "";
    prevDayRef.current = activeDay;
  }
}, [activeDay, days]);







  function addDay() {
    setDays([
      ...days,
      {
        title: `Day ${days.length + 1}`,
        descriptionPoints: ["Click to add point"],
        activities: [],
        highlights: [],
      },
    ]);
    setActiveDay(days.length);
  }

 function updateDayTitle(value) {
  setDays((prev) =>
    prev.map((day, i) =>
      i === activeDay ? { ...day, title: value } : day
    )
  );
}





  function addActivity(type) {
  setDays((prev) =>
    prev.map((day, i) =>
      i === activeDay
        ? {
            ...day,
            activities: [
              ...day.activities,
              { type, title: "", description: "" },
            ],
          }
        : day
    )
  );
}


 function deleteActivity(index) {
  setDays((prev) =>
    prev.map((day, i) =>
      i === activeDay
        ? {
            ...day,
            activities: day.activities.filter((_, idx) => idx !== index),
          }
        : day
    )
  );
}


  function updateActivity(index, field, value) {
  setDays((prev) =>
    prev.map((day, i) =>
      i === activeDay
        ? {
            ...day,
            activities: day.activities.map((act, idx) =>
              idx === index ? { ...act, [field]: value } : act
            ),
          }
        : day
    )
  );
}


  function addHighlight(e) {
    if (e.key === "Enter" && highlightInput.trim()) {
      e.preventDefault();
      const updated = [...days];
      updated[activeDay].highlights.push(highlightInput.trim());
      setDays(updated);
      setHighlightInput("");
    }
  }

  function deleteHighlight(index) {
    const updated = [...days];
    updated[activeDay].highlights.splice(index, 1);
    setDays(updated);
  }

  function updateInclusions(text) {
    setInclusions(text.split("\n").map((l) => l.trim()).filter(Boolean));
  }

  function updateExclusions(text) {
    setExclusions(text.split("\n").map((l) => l.trim()).filter(Boolean));
  }

  const adultTotal = pricing.adults * pricing.adultCost;
  const childTotal = pricing.children * pricing.childCost;
  const grandTotal = adultTotal + childTotal;

  /* ================= SAVE + DOWNLOAD HELPERS ================= */
  useEffect(() => {
  if (!itineraryId) return;

async function loadItinerary() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("No session found");
    return;
  }

  const res = await fetch(`/api/itinerary/${itineraryId}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

 if (!res.ok) {
  const err = await res.json();
  console.error("Load itinerary failed:", res.status, err);
  alert("Failed to load itinerary");
  return;
}


  const data = await res.json();

  console.log("Loaded itinerary:", data); // ✅ debug

  setClient({ name: data.clientName || "" });
  setTrip(data.trip || {});
  setDays(data.days || []);
  setInclusions(data.inclusions || []);
  setExclusions(data.exclusions || []);
  setPricing(data.pricing || {});
  setStatus(data.status || "DRAFT");
}


  loadItinerary();
}, [itineraryId]);

async function handleFinalize() {
  const confirmed = window.confirm(
    "Please make sure you have shared this itinerary with the client.\n\nOnce finalized, it cannot be edited.\n\nDo you want to continue?"
  );

  if (!confirmed) return;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert("Not logged in");
    return;
  }

  const res = await fetch("/api/itinerary/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: itineraryId,
      accessToken: session.access_token,
    }),
  });

  if (res.ok) {
    alert("Itinerary finalized successfully");
    setStatus("FINAL");
  } else {
    const data = await res.json();
    alert(data.error || "Failed to finalize itinerary");
  }
}



async function saveItinerary(data) {
  try {
    // 1. get logged-in user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You are not logged in");
      return;
    }

    // 2. send token to backend
    const res = await fetch("/api/itinerary/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        itineraryId, // for update
        accessToken: session.access_token, // 🔐 IMPORTANT
      }),
    });

    const result = await res.json();

    if (result.success) {
      alert("Itinerary saved successfully");
      router.push(`/itinerary/canvas?id=${result.itineraryId}`);
    } else {
      alert(result.error || "Failed to save itinerary");
    }
  } catch (err) {
    console.error(err);
    alert("Error while saving itinerary");
  }
}






  async function downloadPDF(data) {
    try {
      const res = await fetch("/api/itinerary/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Oggy-Holiday-Itinerary.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Error while downloading PDF");
    }
  }

  


  /* ================= BUTTONS UI ================= */

  const SaveDownloadButtons = ({
  days,
  inclusions,
  exclusions,
  pricing,
  trip,
  client,
}) => (


    <div className="mt-12 flex justify-end gap-4">
      
      <button
  disabled={status === "FINAL"}
  onClick={() =>
    saveItinerary({
      itineraryId,
      days,
      inclusions,
      exclusions,
      pricing,
      trip,
      client,
    })
  }
  className={`px-6 py-2 rounded-lg text-white ${
    status === "FINAL"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gray-800 hover:bg-gray-900"
  }`}
>
  💾 Save Itinerary
</button>
</div>


     
    



  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-60 bg-gray-50 border-r px-6 py-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-6">
            Itinerary Days
          </h2>

          <ul className="space-y-4">
            {days.map((_, i) => (
              <li
  key={i}
  className={`flex items-center justify-between gap-3 cursor-pointer ${
    activeDay === i
      ? "text-blue-700 font-medium"
      : "text-gray-900"
  }`}
>
  <div
    onClick={() => setActiveDay(i)}
    className="flex items-center gap-3 flex-1"
  >
    <span
      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
        activeDay === i
          ? "bg-blue-600 text-white"
          : "bg-gray-300 text-black"
      }`}
    >
      {i + 1}
    </span>
    Day {i + 1}
  </div>

 {!isFinal && days.length > 1 && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteDay(i);
    }}
    className="text-gray-400 hover:text-red-600 text-sm"
    title="Delete day"
  >
    ✕
  </button>
)}

</li>

            ))}
          </ul>

          <button
  disabled={isFinal}
  onClick={() => {
    if (isFinal) return;
    addDay();
  }}
  className={`mt-8 text-sm font-medium ${
    isFinal
      ? "text-gray-400 cursor-not-allowed"
      : "text-blue-700 hover:underline"
  }`}
>
  + Add Day
</button>

        </aside>

        {/* CANVAS */}
<main className="flex-1 overflow-y-auto py-10 px-6">
<div className="relative max-w-3xl mx-auto bg-white rounded-2xl shadow-md px-10 py-10">
    {isFinal && (
  <div className="absolute inset-0 z-50 bg-transparent cursor-not-allowed" />
)}
            {/* TRIP DETAILS */}
            <div className="mb-4">
  <label className="text-sm font-medium text-black">
    Client Name
  </label>
  <input
  value={client.name}
  disabled={isFinal}
  onChange={(e) => {
    if (isFinal) return;
    setClient({ name: e.target.value });
  }}
  placeholder="e.g. Rahul Sharma"
  className={`w-full mt-1 border rounded-lg px-3 py-2 text-black ${
    isFinal
      ? "bg-gray-100 cursor-not-allowed border-gray-200"
      : "border-gray-300"
  }`}
/>

</div>

<div className="mt-14 mb-10">
  <h3 className="text-sm font-semibold text-black mb-4">
    Trip Details
  </h3>

  <div className="grid grid-cols-2 gap-6">
    <div>
      <label className="text-sm font-medium text-black">
        Destination
      </label>
      <input
      value={trip.destination}
        disabled={isFinal}

        onChange={(e) => {
          if (isFinal) return;
          setTrip({ ...trip, destination: e.target.value });
        }}
        placeholder="e.g. Manali, Himachal Pradesh"
        className={`w-full mt-1 border rounded-lg px-3 py-2 text-black ${
    isFinal
      ? "bg-gray-100 cursor-not-allowed border-gray-200"
      : "border-gray-300"
  }`}
      />
    </div>

    <div>
      <label className="text-sm font-medium text-black">
        Guests
      </label>
      <input
  value={trip.guests}
  disabled={isFinal}
  onChange={(e) => {
    if (isFinal) return;
    setTrip({ ...trip, guests: e.target.value });
  }}
  placeholder="e.g. 2 Adults, 1 Child"
  className={`w-full mt-1 border rounded-lg px-3 py-2 text-black ${
    isFinal
      ? "bg-gray-100 cursor-not-allowed border-gray-200"
      : "border-gray-300"
  }`}
/>

    </div>

    <div>
      <label className="text-sm font-medium text-black">
        Start Date
      </label>
      <input
  type="date"
  value={trip.startDate}
  disabled={isFinal}
  onChange={(e) => {
    if (isFinal) return;
    setTrip({ ...trip, startDate: e.target.value });
  }}
  className={`w-full mt-1 border rounded-lg px-3 py-2 text-black ${
    isFinal
      ? "bg-gray-100 cursor-not-allowed border-gray-200"
      : "border-gray-300"
  }`}
/>

    </div>

    <div>
      <label className="text-sm font-medium text-black">
        End Date
      </label>
      <input
  type="date"
  value={trip.endDate}
  disabled={isFinal}
  onChange={(e) => {
    if (isFinal) return;
    setTrip({ ...trip, endDate: e.target.value });
  }}
  className={`w-full mt-1 border rounded-lg px-3 py-2 text-black ${
    isFinal
      ? "bg-gray-100 cursor-not-allowed border-gray-200"
      : "border-gray-300"
  }`}
/>

    </div>
  </div>
</div>


            {/* DAY HEADER */}
            <div className="flex items-start gap-4 mb-6">
              <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {activeDay + 1}
              </span>

              <div className="flex-1">
               <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
  <span>Day {activeDay + 1} –</span>

  <input
  value={day.title || ""}
  disabled={isFinal}
  onChange={(e) => {
    if (isFinal) return;
    updateDayTitle(e.target.value);
  }}
  placeholder="Enter day title"
  className={`outline-none border-none bg-transparent font-semibold text-black flex-1 ${
    isFinal ? "cursor-not-allowed opacity-70" : ""
  }`}
/>

</h2>



   
  <textarea
  value={day.description || ""}
  onChange={(e) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDay ? { ...d, description: e.target.value } : d
      )
    );
  }}
  placeholder="Write day description (paragraphs, bullets, anything)"
  rows={6}
  className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-black resize-none leading-relaxed"
/>


 : (
  <textarea
  value={day.description || ""}
  onChange={(e) =>
    setDays((prev) =>
      prev.map((d, i) =>
        i === activeDay
          ? { ...d, description: e.target.value }
          : d
      )
    )
  }
  placeholder="Write day description (paragraphs, bullets, anything)"
  rows={6}
  className="w-full mt-2 text-black border border-gray-300 rounded-lg px-3 py-2 resize-none leading-relaxed"
/>

)




              </div>
            </div>

            {/* ACTIVITIES */}
            <div className="space-y-3">
              {(day.activities || []).map((act, i) => {
                const icon =
                  ACTIVITY_TYPES.find((a) => a.key === act.type)?.icon || "•";

                return (
                  <div
                    key={i}
                    className="border border-gray-300 rounded-lg px-5 py-3 bg-gray-50 relative"
                  >
                    <button
                      onClick={() => deleteActivity(i)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                    >
                      ✕
                    </button>

                    <div className="flex items-center gap-3 text-black font-medium">
                      <span className="text-xl">{icon}</span>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateActivity(i, "title", e.currentTarget.innerText)
                        }
                        data-placeholder="Click to add name"
                        className="outline-none min-h-[20px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                      >
                        {act.title}
                      </div>
                    </div>

                    {act.description && (
                      <div
                        contentEditable
                        suppressContentEditableWarning
            onBlur={(e) =>
  updateActivity(
    i,
    "description",
    e.currentTarget.textContent
  )
}


                        className="text-black mt-2 text-sm outline-none"
                      >
                        {act.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ADD ACTIVITY */}
            <div className="mt-8 flex flex-wrap gap-3">
              {ACTIVITY_TYPES.map((a) => (
                <button
                  key={a.key}
                  onClick={() => addActivity(a.key)}
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full text-sm text-black hover:bg-blue-50"
                >
                  <span>{a.icon}</span>
                  + {a.label}
                </button>
              ))}
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-black mb-3">
                HIGHLIGHTS
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {(day.highlights || []).map((h, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-black px-3 py-1 rounded-full text-sm"
                  >
                    ⭐ {h}
                    <button
                      onClick={() => deleteHighlight(i)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={addHighlight}
                placeholder="Type highlight and press Enter"
                className="border border-gray-300 px-3 py-2 rounded-lg text-black w-full"
              />
            </div>
            {/* TRIP DETAILS */}

            {/* PACKAGE DETAILS */}
            <div className="mt-14 mb-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Package Details (Applies to entire itinerary)
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* INCLUSIONS */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-base font-semibold text-black mb-4">
                ✓ Inclusions
              </h3>
              <ul
                contentEditable
                suppressContentEditableWarning
                className="list-disc pl-6 text-black space-y-2 outline-none"
                onBlur={(e) => updateInclusions(e.currentTarget.innerText)}
              >
                {(inclusions.length ? inclusions : ["Click here to add inclusions"]).map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>

            {/* EXCLUSIONS */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="text-base font-semibold text-black mb-4">
                ✗ Exclusions
              </h3>
              <ul
                contentEditable
                suppressContentEditableWarning
                className="list-disc pl-6 text-black space-y-2 outline-none"
                onBlur={(e) => updateExclusions(e.currentTarget.innerText)}
              >
                {(exclusions.length ? exclusions : ["Click here to add exclusions"]).map(
                  (item, i) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-black mb-6">
                💰 Package Costing
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium text-black">
                    Number of Adults
                  </label>
                  <input
                    type="number"
                    value={pricing.adults}
                    onChange={(e) =>
                      setPricing({ ...pricing, adults: Number(e.target.value) })
                    }
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Cost per Adult (₹)
                  </label>
                  <input
                    type="number"
                    value={pricing.adultCost}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        adultCost: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    value={pricing.children}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        children: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Cost per Child (₹)
                  </label>
                  <input
                    type="number"
                    value={pricing.childCost}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        childCost: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black"
                  />
                </div>
              </div>

              <div className="border-t border-blue-200 pt-4 space-y-2 text-black font-medium">
                <div>Adults Total: ₹{adultTotal.toLocaleString()}</div>
                <div>Children Total: ₹{childTotal.toLocaleString()}</div>
                <div className="text-lg font-semibold">
                  Grand Total: ₹{grandTotal.toLocaleString()}
                </div>
              </div>
            </div>

            {/* SAVE + DOWNLOAD BUTTONS */}
         <SaveDownloadButtons
  days={days}
  inclusions={inclusions}
  exclusions={exclusions}
  pricing={pricing}
  trip={trip}
  client={client}
/>

{itineraryId && status !== "FINAL" && (
  <button
    onClick={() => handleFinalize(itineraryId)}
    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 mt-4"
  >
    ✅ Finalize Itinerary
  </button>
)}





          </div>
          <div className="max-w-3xl mx-auto mt-4 flex justify-end">
  <button
    onClick={() =>
      downloadPDF({ days, inclusions, exclusions, pricing, trip, client })
    }
    className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
  >
    📄 Download PDF
  </button>
</div>
        </main>
      </div>
    </div>
  );

}