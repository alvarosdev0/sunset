"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase/client";
import { PublicProfile } from "@/components/public-profile";
import type { UserProfile } from "@/types/UserProfile";

export default function ProfilePage() {
  const { session } = useSession();
  const router = useRouter();
  const params = useParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const username = typeof params.username === "string" ? params.username : "";

  useEffect(() => {
    const fetchProfile = async () => {
      let data: UserProfile | null = null;
      let error;

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          username
        );

      if (isUUID) {
        // Buscar directamente por user_id
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", username)
          .single();

        data = profileData;
        error = profileError;
      } else {
        // Buscar por name
        const { data: byName, error: nameError } = await supabase
          .from("public_user_metadata")
          .select("*")
          .eq("name", username)
          .single();

        if (byName) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", byName.user_id)
            .single();

          data = profileData;
          error = profileError;
        }

        // Si falla por name, buscar por email
        if (!data || error) {
          const { data: byEmail, error: emailError } = await supabase
            .from("public_user_metadata")
            .select("*")
            .eq("email", username)
            .single();

          if (byEmail) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", byEmail.user_id)
              .single();

            data = profileData;
            error = profileError;
          }
        }
      }

      if (!data || error) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userId = session?.user?.id;
      const metadataUsername = session?.user?.user_metadata?.username;

      if (userId && data.user_id === userId && username !== metadataUsername) {
        router.replace("/dashboard");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    if (session) fetchProfile();
  }, [username, session, router]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>Perfil no encontrado</p>;

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <PublicProfile profile={profile} />
    </section>
  );
}
