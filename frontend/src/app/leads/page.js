"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AuthGuard from "@/components/AuthGuard";
import AppHeader from "@/components/AppHeader";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");


  const [showModal, setShowModal] = useState(false);
const [mode, setMode] = useState(null); // "CREATE" | "EDIT"
const [activeLead, setActiveLead] = useState(null);

const [form, setForm] = useState({
  clientName: "",
  mobileNumber: "",
  destination: "",
  source: "",
  notes: "",
  assignedTo: "",
  status: "",
});
function closeModal() {
  setShowModal(false);
  setMode(null);
  setActiveLead(null);
  setForm({
    clientName: "",
    mobileNumber: "",
    destination: "",
    source: "",
    notes: "",
    assignedTo: "",
    status: "",
  });
}


 useEffect(() => {
  async function init() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Get role
      const meRes = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const meData = await meRes.json();
      setRole(meData.role);
      if (meData.role === "ADMIN") {
  const usersRes = await fetch("/api/users", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const usersData = await usersRes.json();
  console.log("USERS RESPONSE:", usersData);

  const staffUsers = usersData.filter(
    (u) => u.role === "STAFF"
  );

  setUsers(staffUsers);
}

      // Get leads
      const leadsRes = await fetch("/api/leads", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const leadsData = await leadsRes.json();
      setLeads(Array.isArray(leadsData) ? leadsData : []);
    } catch (err) {
      console.error("INIT ERROR", err);
    } finally {
      setLoading(false);
    }
  }

  init();
}, []);

  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-900">
        <AppHeader />

        <section className="flex-1 px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold">Leads</h1>

  {role === "ADMIN" && (
  <button
    onClick={() => {
      setMode("CREATE");        // ✅ IMPORTANT
      setActiveLead(null);      // ✅ IMPORTANT
      setForm({
        clientName: "",
        mobileNumber: "",
        destination: "",
        source: "",
        notes: "",
        assignedTo: "",
        status: "",
      });
      setShowModal(true);
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    ➕ Add Lead
  </button>
)}
</div>
{/* SEARCH + FILTER */}
<div className="flex flex-col md:flex-row gap-4 mb-6">
  {/* Search */}
  <input
    placeholder="Search by client or destination..."
    className="flex-1 border rounded-lg px-4 py-2"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* Status Filter */}
  <select
    className="border rounded-lg px-4 py-2 md:w-64"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All Status</option>
    <option value="NEW">New</option>
    <option value="ASSIGNED">Assigned</option>
    <option value="WORK_IN_PROGRESS">Work In Progress</option>
    <option value="QUOTATION_SENT">Quotation Sent</option>
    <option value="CONVERTED">Converted</option>
    <option value="NOT_CONVERTED">Not Converted</option>
  </select>
</div>


            {loading ? (
              <p>Loading...</p>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow">
                No leads available.
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Client</th>
                      <th className="py-2">Destination</th>
                      <th className="py-2">Source</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads
  .filter((lead) => {
    const searchText =
      `${lead.clientName} ${lead.destination}`.toLowerCase();

    const matchesSearch =
      searchText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .map((lead) => (

                      <tr
  key={lead.id}
  onClick={() => {
  setMode("EDIT");
  setActiveLead(lead);
  setForm({
    clientName: lead.clientName,
    mobileNumber: lead.mobileNumber,
    destination: lead.destination,
    source: lead.source,
    notes: lead.notes || "",
    assignedTo: lead.assignedTo || "",
    status: lead.status || "NEW",
  });
  setShowModal(true);
}}
  className="border-b hover:bg-gray-50 cursor-pointer"
>
                        <td className="py-2">{lead.clientName}</td>
                        <td className="py-2">{lead.destination}</td>
                        <td className="py-2">{lead.source}</td>
                        <td className="py-2">{lead.status}</td>
                        <td className="py-2">
  {lead.assignedUser?.email || "Unassigned"}
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn flex">

      {/* LEFT GRAPHIC PANEL */}
      <div className="w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">New Opportunity 🚀</h2>
          <p className="text-white/90 text-lg">
            Every lead is a new journey waiting to begin.
            Capture it. Assign it. Convert it.
          </p>
        </div>

        <div className="text-7xl opacity-20 select-none">
          📈
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-1/2 bg-white p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Create Lead</h2>
         <button
  onClick={closeModal}
  className="text-gray-400 hover:text-black text-xl"
>
  ✕
</button>
        </div>

        <div className="space-y-6">

          {/* Client Name */}
          <div>
            <label className="text-sm text-gray-600">Client Name</label>
            <input
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.clientName}
              disabled={role === "STAFF"}
              onChange={(e) =>
                setForm({ ...form, clientName: e.target.value })
              }
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm text-gray-600">Mobile Number</label>
            <input
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.mobileNumber}
              disabled={role === "STAFF"}
              onChange={(e) =>
                setForm({ ...form, mobileNumber: e.target.value })
              }
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm text-gray-600">Destination</label>
            <input
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.destination}
              disabled={role === "STAFF"}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
            />
          </div>

          {/* Source */}
          <div>
            <label className="text-sm text-gray-600">Lead Source</label>
            <select
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.source}
              disabled={role === "STAFF"}

              onChange={(e) =>
                setForm({ ...form, source: e.target.value })
              }
            >
              <option value="">Select Source</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="GOOGLE_ADS">Google Ads</option>
              <option value="WEBSITE">Website</option>
              <option value="REFERRAL">Referral</option>
              <option value="WALK_IN">Walk In</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {role === "ADMIN" && (
  <div>
    <label className="text-sm text-gray-600">Assign To</label>
    <select
      className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
      value={form.assignedTo}
      onChange={(e) =>
        setForm({ ...form, assignedTo: e.target.value })
      }
    >
      <option value="">Select Staff</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.email}
        </option>
      ))}
    </select>
  </div>
)}

{/* Status */}
<div>
  <label className="text-sm text-gray-600">Status</label>
  <select
    className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
    value={form.status || ""}
    onChange={(e) =>
      setForm({ ...form, status: e.target.value })
    }
  >
    <option value="">Select Status</option>
    <option value="NEW">New</option>
    <option value="ASSIGNED">Assigned</option>
    <option value="WORK_IN_PROGRESS">Work In Progress</option>
    <option value="QUOTATION_SENT">Quotation Sent</option>
    <option value="CONVERTED">Converted</option>
    <option value="NOT_CONVERTED">Not Converted</option>
  </select>
</div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600">Notes (Optional)</label>
            <textarea
              rows={3}
              className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>

          {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">

  {/* LEFT SIDE DELETE (ADMIN ONLY + EDIT MODE ONLY) */}
  {role === "ADMIN" && mode === "EDIT" && (
    <button
      onClick={async () => {
        const confirmDelete = confirm(
          "Are you sure you want to permanently delete this lead?"
        );
        if (!confirmDelete) return;

        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const res = await fetch(
            `/api/leads/${activeLead.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );

          if (!res.ok) {
            alert("Failed to delete lead");
            return;
          }

          closeModal();
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("Error deleting lead");
        }
      }}
      className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
    >
      Delete Lead
    </button>
  )}

  {/* RIGHT SIDE CANCEL + SAVE */}
  <div className="flex gap-4">
    <button
      onClick={closeModal}
      className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
    >
      Cancel
    </button>

    <button
      onClick={async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const endpoint =
            mode === "CREATE"
              ? "/api/leads"
              : `/api/leads/${activeLead.id}`;

          const method =
            mode === "CREATE" ? "POST" : "PATCH";

          const res = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(form),
          });

          if (!res.ok) {
            alert("Failed to save lead");
            return;
          }

          closeModal();
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("Error saving lead");
        }
      }}
      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition transform"
    >
      {mode === "CREATE" ? "Create Lead" : "Update Lead"}
    </button>
    </div>
      
          </div>

        </div>
      </div>
    </div>
  </div>
)}

        </section>
      </main>
    </AuthGuard>
  );
}