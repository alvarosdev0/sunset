"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase/client"; // asegúrate de usar el cliente para el navegador
import { LogoutButton } from "./logout-button";
import { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);

  const [authReady, setAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthReady(true);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);
  if (!authReady || isLoggingOut) return null;

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton onStartLogout={() => setIsLoggingOut(true)} />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
