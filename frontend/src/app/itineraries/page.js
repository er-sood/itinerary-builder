"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";

export default function BrowseItinerariesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  async function load() {
    setLoading(true);
    const res = await fetch(`/api/itinerary/list?q=${query}`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold mb-6 text-black">
          Browse Itineraries
        </h1>

        {/* SEARCH */}
        <div className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by destination (e.g. Manali)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
          />

          <button
            onClick={load}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Search
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-gray-600">Loading itineraries…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">
            No itineraries found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((it) => (
  <div
    key={it.id}
    onClick={() =>
      router.push(`/itinerary/canvas?id=${it.id}`)
    }
    className="bg-white border rounded-xl p-6 hover:shadow-md transition cursor-pointer hover:bg-blue-50"
  >
    <h3 className="text-lg font-semibold text-black">
      {it.destination}
    </h3>

    {it.clientName && (
      <p className="text-sm text-gray-700 mt-1">
        Prepared for {it.clientName}
      </p>
    )}

    <p className="text-xs text-gray-500 mt-3">
      Created on{" "}
      {new Date(it.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </p>
  </div>
))}

          </div>
        )}
      </main>
    </div>
  );
}
