// app/perfil/page.tsx
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  return (
    <div className="flex flex-col px-10">
      <div className="flex-col gap-2 w-full">
        <h1 className="text-2xl font-bold">Tu perfil</h1>
        <div className="flex items-center space-x-4">
          <img
            src={user.user_metadata?.avatar_url || "/default-avatar.png"}
            alt="Foto de perfil"
            width={64}
            height={64}
            className="rounded-full border"
          />
          <div>
            <p className="text-lg font-semibold">
              {user.user_metadata?.name || "Nombre no disponible"}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
