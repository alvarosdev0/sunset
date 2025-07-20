"use client";

import { LoginForm } from "@/components/login-form";
import { supabase } from "@/lib/supabase/client";

export default function Page() {
  // const loginWithGoogle = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //   });
  // };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />

        {/* <button onClick={loginWithGoogle}>Iniciar sesión con Google</button> */}
      </div>
    </div>
  );
}

// // pages/login.tsx
// import { supabase } from '../lib/supabaseClient'

// const loginWithGoogle = async () => {
//   await supabase.auth.signInWithOAuth({
//     provider: 'google',
//   })
// }

// return <button onClick={loginWithGoogle}>Iniciar sesión con Google</button>
// pages/login.tsx
