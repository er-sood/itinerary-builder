"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";

export default function StaffPerformancePage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffItineraries, setStaffItineraries] = useState([]);
  const [loadingItineraries, setLoadingItineraries] = useState(false);

  async function load() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not logged in");

      const res = await fetch("/api/admin/staff-performance", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid API response:", data);
        setStaff([]);
        return;
      }

      // ✅ ranking: finalized desc, then total desc
      const sorted = [...data].sort((a, b) => {
        if (b.finalized !== a.finalized) return b.finalized - a.finalized;
        return b.total - a.total;
      });

      setStaff(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to load staff performance");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadStaffItineraries(staffId) {
    try {
      setLoadingItineraries(true);
      setSelectedStaff(staffId);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Not logged in");

      const res = await fetch(`/api/admin/staff-performance/${staffId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setStaffItineraries(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load staff itineraries");
    } finally {
      setLoadingItineraries(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-8 text-black">
          Staff Performance
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading staff performance…</p>
        ) : staff.length === 0 ? (
          <p className="text-gray-600">No staff found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((s, index) => (
              <div
                key={s.id}
                onClick={() => loadStaffItineraries(s.id)}
                className="bg-white rounded-xl border shadow-sm p-6 cursor-pointer hover:shadow-md hover:bg-blue-50"
              >
                <h3 className="text-lg font-semibold text-black mb-2 flex items-center justify-between">
                  <span>👤 {s.username}</span>

                  {index === 0 && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                      🥇 Top
                    </span>
                  )}
                  {index === 1 && (
                    <span className="text-xs bg-gray-300 text-black px-2 py-1 rounded-full">
                      🥈 #2
                    </span>
                  )}
                  {index === 2 && (
                    <span className="text-xs bg-orange-300 text-black px-2 py-1 rounded-full">
                      🥉 #3
                    </span>
                  )}
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Total Itineraries</span>
                    <span className="font-semibold">{s.total}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Finalized</span>
                    <span className="font-semibold text-green-600">
                      {s.finalized}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Draft</span>
                    <span className="font-semibold text-yellow-600">
                      {s.draft}
                    </span>
                  </div>
                  {/* === LEADS SECTION === */}
<hr className="my-3" />

<div className="flex justify-between">
  <span>Total Leads</span>
  <span className="font-semibold">{s.totalLeads}</span>
</div>

<div className="flex justify-between">
  <span>Converted</span>
  <span className="font-semibold text-green-600">
    {s.convertedLeads}
  </span>
</div>

<div className="flex justify-between">
  <span>Working</span>
  <span className="font-semibold text-blue-600">
    {s.workingLeads}
  </span>
</div>

<div className="flex justify-between">
  <span>Lost</span>
  <span className="font-semibold text-red-600">
    {s.lostLeads}
  </span>
</div>

                </div>

                <div className="mt-4">
                  {/* Lead Conversion Rate */}
<div className="mt-4">
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className="bg-blue-500 h-2"
      style={{
        width: `${s.leadConversionRate}%`,
      }}
    />
  </div>
  <p className="text-xs text-gray-500 mt-1">
    Lead Conversion Rate {s.leadConversionRate}%
  </p>
</div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-2"
                      style={{
                        width:
                          s.total === 0
                            ? "0%"
                            : `${Math.round(
                                (s.finalized / s.total) * 100
                              )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Finalization Rate{" "}
                    {s.total === 0
                      ? "0%"
                      : `${Math.round(
                          (s.finalized / s.total) * 100
                        )}%`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedStaff && (
          <div className="mt-12 bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Staff Itineraries
            </h2>

            {loadingItineraries ? (
              <p className="text-gray-600">Loading itineraries…</p>
            ) : staffItineraries.length === 0 ? (
              <p className="text-gray-600">No itineraries found.</p>
            ) : (
              <ul className="space-y-3">
                {staffItineraries.map((it) => (
                  <li
                    key={it.id}
                    onClick={() =>
                      (window.location.href = `/itinerary/canvas?id=${it.id}`)
                    }
                    className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <div>
                      <p className="font-medium text-black">
                        {it.destination}
                      </p>
                      {it.clientName && (
                        <p className="text-xs text-gray-500">
                          {it.clientName}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        it.status === "FINAL"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {it.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
