import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/UserProfile";

export function usePersonalProfile() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session ?? null;
      setSession(currentSession);

      const userId = currentSession?.user?.id;
      if (!userId) return;

      const { data: existingProfile, error } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", userId)
        .single();

      if (!existingProfile) {
        // 👷 Crear perfil vacío con defaults
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: userId,
            location: "Ubicación desconocida",
            description: "",
            social_type: "",
            social_url: "",
          });

        if (insertError) console.error("Error creando perfil:", insertError);
      }

      // 🔁 Volvemos a consultar perfil ya existente o recién creado
      const { data: fullProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      setProfile(fullProfile ?? null);
    };

    init();
  }, []);

  return { session, profile };
}
