"use client";

import { useEffect, useState } from "react";
import { usePersonalProfile } from "@/hooks/usePersonalProfile";
import type { UserProfile } from "@/types/UserProfile";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Facebook, Instagram, MapPin, X } from "lucide-react";

export default function UserProfilePage() {
  const { session, profile } = usePersonalProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [formDraft, setFormDraft] = useState<UserProfile | null>(null);
  const [openSocial, setOpenSocial] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const assignUsername = async () => {
      const user = session?.user;
      if (!user || !profile || profile.username || !initialized) return;

      const rawName =
        user.user_metadata?.name || user.email?.split("@")[0] || "user";
      const baseUsername = rawName.toLowerCase().replace(/[^a-z0-9_]/g, "_");

      const { data: existing } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("username", baseUsername)
        .single();

      const finalUsername = existing
        ? `${baseUsername}_${user.id.slice(0, 4)}`
        : baseUsername;

      console.log("Asignando username:", finalUsername);
      const { error } = await supabase
        .from("user_profiles")
        .update({ username: finalUsername })
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ No se pudo asignar username:", error);
      } else {
        console.log("✅ Username asignado:", finalUsername);
      }
    };

    if (profile && !initialized) {
      setFormData(profile);
      setFormDraft(profile);
      setInitialized(true);
      assignUsername();
    }
  }, [profile, session, initialized]);

  if (!profile || !formData || !formDraft)
    return <p>Cargando perfil personal...</p>;
  if (formData.user_id !== session?.user.id) {
    console.error("🔐 user_id no coincide con la sesión");
    return;
  }

  const safe = (value: string | null | undefined, fallback = "") =>
    !value?.trim() ? fallback : value;

  const normalizeUrl = (url: string): string => {
    return /^https?:\/\//.test(url) ? url : "https://" + url;
  };

  const getSocialIcon = (type: string | null | undefined) => {
    switch (type?.toLowerCase()) {
      case "twitter":
      case "x":
        return null;
      case "instagram":
        return <Instagram size={16} />;
      case "facebook":
        return <Facebook size={16} />;
      default:
        return null;
    }
  };

  const isValidSocialUrl = (
    type: string,
    rawUrl: string | null | undefined
  ) => {
    try {
      const url = normalizeUrl(safe(rawUrl));
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      const matchDomain = (domain: string) =>
        host === domain || host.endsWith("." + domain);

      switch (type.toLowerCase()) {
        case "instagram":
          return matchDomain("instagram.com");
        case "facebook":
          return matchDomain("facebook.com");
        case "x":
        case "twitter":
          return matchDomain("x.com") || matchDomain("twitter.com");
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const handleUpdate = async () => {
    if (formDraft.social_type && formDraft.social_url) {
      if (!isValidSocialUrl(formDraft.social_type, formDraft.social_url)) {
        alert("La URL no coincide con la red seleccionada.");
        return;
      }
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        description: formDraft.description,
        location: formDraft.location,
        social_type: formDraft.social_type,
        social_url: normalizeUrl(safe(formDraft.social_url)),
      })
      .eq("user_id", formDraft.user_id);

    if (!error) {
      setFormData({
        ...formDraft,
        social_url: normalizeUrl(safe(formDraft.social_url)),
      });
      setEditing(false);
    } else {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const avatar = session?.user?.user_metadata?.avatar_url;
  const name = session?.user?.user_metadata?.name ?? session?.user?.email;

  return (
    <div className="px-20 py-10 flex flex-col">
      <h3 className="text-2xl font-bold">Perfil de {name}</h3>

      <Popover open={editing} onOpenChange={setEditing}>
        <PopoverTrigger asChild className="opacity-0 pointer-events-none">
          <Button variant="outline">Editar perfil</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="description">Descripción</label>
              <Textarea
                value={safe(formDraft.description)}
                onChange={(e) =>
                  setFormDraft({ ...formDraft, description: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="location">Ubicación</label>
              <Input
                value={safe(formDraft.location)}
                onChange={(e) =>
                  setFormDraft({ ...formDraft, location: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="social_type">Red social</label>
              <div className="flex items-center space-x-4">
                <Popover open={openSocial} onOpenChange={setOpenSocial}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[150px] justify-start"
                    >
                      {formDraft.social_type ?? "+ Seleccionar red"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar red..." />
                      <CommandList>
                        <CommandEmpty>No hay coincidencias.</CommandEmpty>
                        <CommandGroup>
                          {["Facebook", "Instagram", "X"].map((social) => (
                            <CommandItem
                              key={social}
                              value={social}
                              onSelect={(value) => {
                                setFormDraft({
                                  ...formDraft,
                                  social_type: value,
                                });
                                setOpenSocial(false);
                              }}
                            >
                              {social}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="social_url">URL de la red social</label>
              <Input
                value={safe(formDraft.social_url)}
                placeholder="https://instagram.com/usuario"
                onChange={(e) =>
                  setFormDraft({ ...formDraft, social_url: e.target.value })
                }
                onBlur={(e) =>
                  setFormDraft({
                    ...formDraft,
                    social_url: normalizeUrl(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex justify-between">
              <Button onClick={handleUpdate}>Guardar</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setFormDraft(formData);
                  setEditing(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex gap-5 mt-6">
        <div className="flex flex-col gap-2">
          {avatar && (
            <img
              src={avatar}
              alt={`Avatar de ${name}`}
              style={{ width: 64, height: 64, borderRadius: "50%" }}
            />
          )}
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Editar
          </Button>
        </div>

        <div className="flex flex-col gap-2 justify-between">
          <p className="text-sm font-medium text-gray-500">
            @{profile.username}
          </p>

          <p className="flex flex-col gap-1">
            <strong className="text-md">Descripción</strong>{" "}
            <span className="font-light text-sm">
              {safe(formData.description, "Sin descripción...")}
            </span>
          </p>

          <div className="flex gap-2">
            <p className="flex gap-1 items-center">
              <MapPin size={20} />
              <span className="font-light text-sm">
                {safe(formData.location, "No indicada")}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              {formData.social_type ? (
                <a
                  href={normalizeUrl(safe(formData.social_url))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:underline"
                >
                  {getSocialIcon(formData.social_type)}
                  <span className="capitalize">{formData.social_type}</span>
                </a>
              ) : (
                <span className="text-sm font-light">No registrada</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
