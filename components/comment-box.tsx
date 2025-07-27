"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import dayjs from "dayjs";

interface Props {
  contentId: string;
}

interface UserComment {
  id: string;
  user_id: string;
  content_id: string;
  content: string;
  created_at: string;
  users?: {
    raw_user_meta_data: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

type PartialUserComment = Pick<UserComment, "content" | "created_at">;
type DisplayComment = UserComment | PartialUserComment;

type UserMetadata = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

// 🔧 Helpers
const normalizeText = (text: string) =>
  text.toLowerCase().replace(/\s+/g, " ").replace(/\n+/g, " ").trim();

const canComment = (
  comments: UserComment[],
  userId: string,
  contentId: string
): boolean => {
  const recent = comments.find(
    (c) => c.user_id === userId && c.content_id === contentId
  );
  if (!recent) return true;
  const lastDate = new Date(recent.created_at);
  return lastDate <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
};

const isDuplicateComment = (
  comments: UserComment[],
  userId: string,
  contentId: string,
  newContent: string
): boolean => {
  const normalizedNew = normalizeText(newContent);
  return comments.some(
    (c) =>
      c.user_id === userId &&
      c.content_id === contentId &&
      normalizeText(c.content) === normalizedNew
  );
};

const buildPendingComment = (
  userId: string,
  contentId: string,
  content: string
): UserComment => ({
  id: "pending",
  user_id: userId,
  content_id: contentId,
  content,
  created_at: new Date().toISOString(),
});

export default function CommentBox({ contentId }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [comment, setComment] = useState("");
  const [confirmedComments, setConfirmedComments] = useState<UserComment[]>([]);
  const [pendingComments, setPendingComments] = useState<PartialUserComment[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isCommentsReady, setIsCommentsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !contentId) return;

    const fetchComments = async () => {
      setIsCommentsReady(false);

      const [
        { data: comments, error: errComments },
        { data: metadata, error: errMetadata },
      ] = await Promise.all([
        supabase
          .from("comments")
          .select("id, content, created_at, user_id, content_id")
          .eq("content_id", contentId)
          .order("created_at", { ascending: false }),

        supabase
          .rpc("get_user_metadata")
          .then((res) => res as { data: UserMetadata[]; error: any }),
      ]);

      if (errComments || errMetadata) {
        console.error(
          "Error al traer comentarios o metadata:",
          errComments?.message || errMetadata?.message
        );
        return;
      }

      if (comments && metadata) {
        const hydrated: UserComment[] = comments.map((c) => {
          const userMeta = metadata.find((u) => u.id === c.user_id);
          return {
            ...c,
            users: {
              raw_user_meta_data: userMeta
                ? {
                    full_name: userMeta.name || "Usuario sin nombre",
                    avatar_url: userMeta.avatar_url || "",
                  }
                : {
                    full_name: "Usuario eliminado",
                    avatar_url: "",
                  },
            },
          };
        });

        setConfirmedComments(hydrated);
        setPendingComments([]);
        setIsCommentsReady(true);
      }
    };

    fetchComments();
  }, [session?.user?.id, contentId]);

  const handleSubmit = async () => {
    console.log("Session:", session);
    console.log("Comentario:", comment);
    console.log("isCommentsReady:", isCommentsReady);

    if (!session?.user?.id) {
      toast.error("Debes iniciar sesión para comentar");
      return;
    }

    if (!isCommentsReady) {
      toast.error("Los comentarios aún están cargando...");
      return;
    }

    const trimmed = comment.trim();
    const normalized = normalizeText(trimmed);

    if (normalized.length < 3) {
      toast.warning("Comentario demasiado corto");
      return;
    }

    const allUserComments: UserComment[] = [
      ...confirmedComments,
      ...pendingComments.map((p) =>
        buildPendingComment(session.user.id, contentId, p.content)
      ),
    ];

    if (!canComment(allUserComments, session.user.id, contentId)) {
      toast.error("Ya comentaste esta semana");
      return;
    }

    if (
      isDuplicateComment(allUserComments, session.user.id, contentId, trimmed)
    ) {
      toast.error("Ya hiciste ese comentario");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      user_id: session.user.id,
      content_id: contentId,
      content: trimmed,
    });

    setLoading(false);

    if (error) {
      console.error("Error al insertar comentario:", error.message);
      toast.error("No se pudo publicar");
    } else {
      setComment("");
      toast.success("Comentario publicado ✨");

      setPendingComments([
        {
          content: trimmed,
          created_at: new Date().toISOString(),
        },
        ...pendingComments,
      ]);
    }
  };

  const userName = session?.user.user_metadata?.full_name || "Usuario";
  const avatarUrl = session?.user.user_metadata?.avatar_url;

  const CommentsList = ({ comments }: { comments: DisplayComment[] }) => {
    if (!comments.length) return <p>No hay comentarios todavía.</p>;

    return (
      <section className="space-y-4">
        {comments.map((comment, idx) =>
          "id" in comment ? (
            <article key={comment.id} className="flex gap-3 items-start">
              {comment.users?.raw_user_meta_data?.avatar_url ? (
                <img
                  src={comment.users.raw_user_meta_data.avatar_url}
                  alt={comment.users.raw_user_meta_data.full_name || "Usuario"}
                  className="rounded-full w-8 h-8 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/80">
                  {(
                    comment.users?.raw_user_meta_data?.full_name?.charAt(0) ||
                    "?"
                  ).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white/80">
                  {comment.users?.raw_user_meta_data?.full_name ||
                    "Usuario eliminado"}
                  <span className="ml-2 text-xs text-white/50">
                    {dayjs(comment.created_at).format("DD MMM YYYY")}
                  </span>
                </p>
                <p className="text-white mt-1">{comment.content}</p>
              </div>
            </article>
          ) : (
            <article
              key={`pending-${idx}`}
              className="opacity-70 border-dashed px-2 py-1"
            >
              <p className="text-sm text-gray-400">Comentario pendiente...</p>
              <p className="text-gray-700">{comment.content}</p>
            </article>
          )
        )}
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mt-10">
      {session?.user && (
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="rounded-full w-10 h-10 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white/80">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-sm text-white/80">
            Comentando como <span className="font-bold">{userName}</span>
          </p>
        </div>
      )}
      <textarea
        className="p-3 rounded bg-white/10 text-white resize-none min-h-[100px]"
        placeholder="Escribe tu opinión..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={!session?.user || !isCommentsReady}
      />
      <button
        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded disabled:opacity-40"
        onClick={handleSubmit}
        disabled={!session?.user || loading || !isCommentsReady}
      >
        {loading ? "Enviando..." : "Comentar"}
      </button>
      {!session?.user && (
        <p className="text-sm text-white/50">
          Inicia sesión para publicar un comentario
        </p>
      )}
      <CommentsList comments={[...pendingComments, ...confirmedComments]} />
    </div>
  );
}
