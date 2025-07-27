"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login?error=session");
      }
    };
    checkSession();
  }, [router]);

  return <p className="text-center text-sm">Procesando autenticación...</p>;
}
