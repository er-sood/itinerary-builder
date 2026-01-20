"use client";

import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabaseClient";

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    type: "",
    country: "",
    state: "",
    city: "",
    stars: "",
    contactName: "",
    contactPhone: "",
    link: "",
    notes: "",
  });

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      name: "",
      type: "",
      country: "",
      state: "",
      city: "",
      stars: "",
      contactName: "",
      contactPhone: "",
      link: "",
      notes: "",
    });
  }

  /* ================= LOAD INVENTORY ================= */

  async function loadInventory() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/inventory/property", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  /* ================= SAVE PROPERTY ================= */

  async function saveProperty() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/inventory/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...form,
          stars: form.type === "HOMESTAY" ? null : Number(form.stars || 0),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save property");
        return;
      }

      setShowModal(false);
      resetForm();
      loadInventory();
    } catch (e) {
      console.error(e);
      alert("Server error while saving");
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900">
        <AppHeader />

        <section className="flex-1 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-semibold text-black">
                Property Inventory
              </h1>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ Add Property
              </button>
            </div>

            {/* PROPERTY LIST */}
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
                No properties added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-5 shadow hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-black">{p.name}</h3>

                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {p.type}
                      </span>
                    </div>

                    <p className="text-sm mt-1">
                      {p.city}, {p.state}, {p.country}
                    </p>

                    {p.stars && (
                      <p className="text-sm mt-1">⭐ {p.stars} Star</p>
                    )}

                    {p.contactName && (
                      <p className="text-sm mt-2">👤 {p.contactName}</p>
                    )}

                    {p.contactPhone && (
                      <p className="text-sm">📞 {p.contactPhone}</p>
                    )}

                    {p.notes && (
                      <p className="text-xs text-gray-600 mt-2">
                        📝 {p.notes}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Added by {p.user?.email || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-black">
                Add Property
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Property Name"
                  className="border rounded-lg px-4 py-2"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />

                <select
                  className="border rounded-lg px-4 py-2"
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="HOMESTAY">Homestay</option>
                </select>

                <input
                  placeholder="Country"
                  className="border rounded-lg px-4 py-2"
                  value={form.country}
                  onChange={(e) => updateForm("country", e.target.value)}
                />

                <input
                  placeholder="State"
                  className="border rounded-lg px-4 py-2"
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                />

                <input
                  placeholder="City"
                  className="border rounded-lg px-4 py-2"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                />

                <select
                  className={`border rounded-lg px-4 py-2 ${
                    form.type === "HOMESTAY"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={form.stars}
                  disabled={form.type === "HOMESTAY"}
                  onChange={(e) => updateForm("stars", e.target.value)}
                >
                  <option value="">Star Rating (Hotel)</option>
                  <option value="1">⭐ 1 Star</option>
                  <option value="2">⭐ 2 Star</option>
                  <option value="3">⭐ 3 Star</option>
                  <option value="4">⭐ 4 Star</option>
                  <option value="5">⭐ 5 Star</option>
                </select>

                <input
                  placeholder="Contact Person Name"
                  className="border rounded-lg px-4 py-2"
                  value={form.contactName}
                  onChange={(e) => updateForm("contactName", e.target.value)}
                />

                <input
                  placeholder="Contact Phone"
                  className="border rounded-lg px-4 py-2"
                  value={form.contactPhone}
                  onChange={(e) => updateForm("contactPhone", e.target.value)}
                />

                <input
                  placeholder="Website / Google Maps Link"
                  className="border rounded-lg px-4 py-2 md:col-span-2"
                  value={form.link}
                  onChange={(e) => updateForm("link", e.target.value)}
                />

                <textarea
                  placeholder="Notes / Approx Price"
                  className="border rounded-lg px-4 py-2 md:col-span-2 resize-none"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={saveProperty}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Property
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
