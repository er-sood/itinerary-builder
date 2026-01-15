"use client";
import { useState, useRef, useEffect } from "react";
import AppHeader from "@/components/AppHeader";


import { useSearchParams } from "next/navigation";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AppHeader from "@/components/AppHeader";

export default function CreateItineraryPage() {


  const router = useRouter();
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get("id");

  const [clientName, setClientName] = useState("");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(1);
  const [nights, setNights] = useState(0);
  const [dayPlans, setDayPlans] = useState([]);

  
  async function loadItinerary() {
    const res = await fetch(`/api/itinerary/${itineraryId}`);
    if (!res.ok) return;

    const data = await res.json();

    setClient(data.client || { name: "" });
    setTrip(data.trip || {});
    setDays(data.days || []);
    setInclusions(data.inclusions || []);
    setExclusions(data.exclusions || []);
    setPricing(data.pricing || {});
  }

  
  function handleDaysChange(value) {
    const numDays = Number(value);
    setDays(numDays);
    setNights(numDays > 0 ? numDays - 1 : 0);

    const plans = Array.from({ length: numDays }, (_, i) => ({
      day: i + 1,
      title: "",
      description: "",
    }));

    setDayPlans(plans);
  }

  function updateDayPlan(index, field, value) {
    const updated = [...dayPlans];
    updated[index][field] = value;
    setDayPlans(updated);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const itinerary = {
      clientName,
      destination,
      days,
      nights,
      dayPlans,
    };

    console.log("ITINERARY CREATED:", itinerary);

    alert("Itinerary created (day-wise data captured)!");
    router.push("/dashboard");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
        <AppHeader />

        <div className="flex-1 px-6 py-10">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-black">
                Create New Itinerary
              </h1>
              <p className="text-gray-700 mt-2">
                Enter basic details and plan each day below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Client Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Destination
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
                    value={days}
                    onChange={(e) => handleDaysChange(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Number of Nights
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black bg-gray-100"
                    value={nights}
                    readOnly
                  />
                </div>
              </div>

              {/* Day-wise Plans */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-black">
                  Day-wise Plan
                </h2>

                {dayPlans.map((day, index) => (
                  <div
                    key={day.day}
                    className="border border-gray-300 rounded-xl p-6"
                  >
                    <h3 className="font-semibold text-black mb-4">
                      Day {day.day}
                    </h3>

                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black mb-3"
                      placeholder="Title (e.g. Arrival & Local Sightseeing)"
                      value={day.title}
                      onChange={(e) =>
                        updateDayPlan(index, "title", e.target.value)
                      }
                    />

                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black min-h-[100px]"
                      placeholder="Describe the day's activities..."
                      value={day.description}
                      onChange={(e) =>
                        updateDayPlan(index, "description", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save Itinerary
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="border border-gray-300 px-8 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
