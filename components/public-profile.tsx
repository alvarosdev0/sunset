import { MapPin } from "lucide-react";
import { Facebook, Instagram } from "lucide-react";
import type { UserProfile } from "@/types/UserProfile";

type Props = {
  profile: UserProfile;
};

const safe = (value: string | null | undefined, fallback = "") =>
  !value?.trim() ? fallback : value;

const normalizeUrl = (url: string): string => {
  return /^https?:\/\//.test(url) ? url : "https://" + url;
};

const getSocialIcon = (type: string | null | undefined) => {
  switch (type?.toLowerCase()) {
    case "instagram":
      return <Instagram size={16} />;
    case "facebook":
      return <Facebook size={16} />;
    default:
      return null;
  }
};

export const PublicProfile = ({ profile }: Props) => {
  const {
    avatar_url,
    full_name,
    username,
    description,
    location,
    social_type,
    social_url,
  } = profile;

  return (
    <div className="flex gap-5 items-start">
      <div className="flex flex-col gap-2 items-center">
        {avatar_url && (
          <img
            src={avatar_url}
            alt={`Avatar de ${full_name}`}
            style={{ width: 64, height: 64, borderRadius: "50%" }}
          />
        )}
        <h2 className="text-lg font-semibold">@{username}</h2>
        <p className="text-sm text-center max-w-xs">
          {safe(description, "Sin descripción...")}
        </p>
      </div>

      <div className="flex flex-col gap-2 justify-start">
        <p className="flex gap-1 items-center">
          <MapPin size={20} />
          <span className="font-light text-sm">
            {safe(location, "No indicada")}
          </span>
        </p>
        {social_type && (
          <a
            href={normalizeUrl(safe(social_url))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            {getSocialIcon(social_type)}
            <span className="capitalize text-sm font-light">{social_type}</span>
          </a>
        )}
      </div>
    </div>
  );
};
