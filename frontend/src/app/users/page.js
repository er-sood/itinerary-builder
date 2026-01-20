"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";
import BackButton from "@/components/BackButton";

export default function ManageUsersPage() {
  
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔐 ADMIN ACCESS CHECK
 useEffect(() => {
  async function checkAccess() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("MANAGE USERS SESSION:", session);
    if (!session) {
      router.replace("/login");
      return;
    }

    const res = await fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (res.status === 403) {
      router.replace("/dashboard"); // not admin
      return;
    }

    if (!res.ok) {
      router.replace("/login");
      return;
    }

    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  checkAccess();
}, []);


  async function loadUsers(token) {
  const res = await fetch("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setUsers(data);
}


  async function createUser(e) {
    e.preventDefault();
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        accessToken: session.access_token,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Failed to create user");
      return;
    }

    setEmail("");
    setPassword("");
    loadUsers(session.access_token);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <p className="text-gray-600">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      <AppHeader />

      <div className="flex-1 px-6 py-12">
  <div className="max-w-4xl mx-auto">

    {/* ✅ BACK BUTTON */}
    <BackButton label="Back to Dashboard" />

    <h1 className="text-2xl font-semibold text-black mb-6">
      Manage Users
    </h1>


          {/* Create User */}
          <form
            onSubmit={createUser}
            className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
          >
            <h2 className="font-medium text-black">
              Create New Staff User
            </h2>

            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-black"
              placeholder="Staff Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg text-black"
              placeholder="Temporary Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Staff User
            </button>
          </form>

          {/* User List */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-medium text-black mb-4">
              Existing Users
            </h2>

            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="text-black">
                    {u.email} ({u.role})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
