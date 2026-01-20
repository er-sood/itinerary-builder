"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm text-gray-700 hover:text-black mb-4"
    >
      ← {label}
    </button>
  );
}
