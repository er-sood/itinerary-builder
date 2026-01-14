"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AppHeader from "@/components/AppHeader";

export default function ManageUsersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  // 🔐 ADMIN ACCESS CHECK
  useEffect(() => {
    async function checkAccess() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = await res.json();

      if (data.role !== "ADMIN") {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
      loadUsers();
    }

    checkAccess();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  }

  async function createUser(e) {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    if (res.ok) {
      setUsername("");
      setPassword("");
      setRole("STAFF");
      loadUsers();
    }
  }

  async function deleteUser(id) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
          <p className="text-gray-600">Checking access…</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">

        {/* 🔹 GLOBAL HEADER */}
        <AppHeader />

        {/* 🔹 PAGE CONTENT */}
        <div className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto">

            <h1 className="text-2xl font-semibold text-black mb-6">
              Manage Users
            </h1>

            {/* Create User */}
            <form
              onSubmit={createUser}
              className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
            >
              <h2 className="font-medium text-black">
                Create New User
              </h2>

              <input
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-black"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-black"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <select
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-black"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create User
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
                      {u.username} ({u.role})
                    </span>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
