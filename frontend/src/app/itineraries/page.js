"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";

export default function BrowseItinerariesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [client, setClient] = useState("");
const [preparedBy, setPreparedBy] = useState("");
const [reference, setReference] = useState("");
const [search, setSearch] = useState("");

const [status, setStatus] = useState("");
const [users, setUsers] = useState([]);

async function loadUsers() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const res = await fetch("/api/admin/staff", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (res.ok) {
    const data = await res.json();
    setUsers(data);
  }
}


  async function load() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Not logged in");
        return;
      }

     const params = new URLSearchParams({
  q: query,
  client,
  preparedBy,
  reference,
});

const res = await fetch(
  `/api/itinerary/list?search=${encodeURIComponent(search)}&preparedBy=${preparedBy}&status=${status}&reference=${encodeURIComponent(reference)}`,
  {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  }
);




      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load itineraries");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadUsers();
  }, []);

  // ✅ DUPLICATE FINALIZED ITINERARY
  async function duplicateItinerary(id) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Not logged in");
        return;
      }

      const res = await fetch("/api/itinerary/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          accessToken: session.access_token,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/itinerary/canvas?id=${data.itineraryId}`);
      } else {
        alert(data.error || "Failed to duplicate itinerary");
      }
    } catch (err) {
      console.error(err);
      alert("Error duplicating itinerary");
    }
  }

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination/Client Name/Reference"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
          />

          <button
            onClick={load}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Search
          </button>
        </div>


{/* FILTER ROW */}
<div className="flex flex-wrap gap-4 mb-8 items-center">

  {/* Prepared By */}
  <select
    value={preparedBy}
    onChange={(e) => setPreparedBy(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 text-black"
  >
    <option value="">Prepared By (All)</option>
    {users.map((u) => (
      <option key={u.id} value={u.id}>
        {u.email}
      </option>
    ))}
  </select>

  {/* Status */}
  <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 text-black"
  >
    <option value="">All Status</option>
    <option value="DRAFT">Draft</option>
    <option value="FINAL">Finalized</option>
  </select>

  {/* Reference */}
  <input
    value={reference}
    onChange={(e) => setReference(e.target.value)}
    placeholder="Reference"
    className="border border-gray-300 rounded-lg px-3 py-2 text-black"
  />

  {/* Clear */}
  <button
    onClick={() => {
      setSearch("");
      setPreparedBy("");
      setStatus("");
      setReference("");
      load();
    }}
    className="text-sm text-gray-600 underline"
  >
    Clear Filters
  </button>

</div>

        {/* LIST */}
        {loading ? (
          <p className="text-gray-600">Loading itineraries…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No itineraries found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="bg-white border rounded-xl p-6 hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-black">
                    {it.destination}
                  </h3>

                  {it.status === "FINAL" ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      ✅ Finalized
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      📝 Draft
                    </span>
                  )}
                </div>

                {it.clientName && (
  <p className="text-sm text-gray-700 mt-1">
    Prepared for {it.clientName}
  </p>
)}

{it.user?.email && (
  <p className="text-xs text-gray-500 mt-1">
    Prepared by {it.user.email}
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

                {/* ACTIONS */}
                <div className="mt-4 flex gap-4 text-sm">
                  {it.status === "FINAL" ? (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/itinerary/canvas?id=${it.id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        👁 View
                      </button>

                      <button
                        onClick={() => duplicateItinerary(it.id)}
                        className="text-purple-600 hover:underline"
                      >
                        📄 Duplicate
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(`/itinerary/canvas?id=${it.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
