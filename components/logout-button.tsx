import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/auth/logout")}>Cerrar sesión</Button>
  );
}
