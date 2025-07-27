"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Head from "next/head";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // ✅ Client-side check to catch "back" navigation
  useEffect(() => {
    const verifySession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
      }
    };

    verifySession();

    // 🔁 Detect if page was restored from history
    window.addEventListener("pageshow", verifySession);
    return () => window.removeEventListener("pageshow", verifySession);
  }, [router]);

  return (
    <main className="min-h-screen">
      <Head>
        <meta
          httpEquiv="Cache-Control"
          content="no-store, no-cache, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      {children}
    </main>
  );
}
