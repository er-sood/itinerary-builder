"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

useEffect(() => {
  let mounted = true;

  async function check() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!mounted) return;

    if (!session) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }

  // small delay helps on mobile browsers
  const t = setTimeout(check, 200);

  return () => {
    mounted = false;
    clearTimeout(t);
  };
}, [router]);


  if (checking) return null;

  return children;
}
