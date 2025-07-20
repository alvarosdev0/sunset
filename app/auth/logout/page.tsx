// app/auth/logout/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Head from "next/head";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/auth/login");
    };

    logout();
  }, [router]);

  return (
    <>
      <Head>
        <meta
          httpEquiv="Cache-Control"
          content="no-store, no-cache, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <div className="flex items-center justify-center h-screen animate-fade-out">
        <p className="text-sm text-muted-foreground animate-pulse">
          Cerrando sesión...
        </p>
      </div>
    </>
  );
}
