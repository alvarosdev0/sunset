import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { MenuList } from "@/components/menu-list";
import { PopularSection } from "@/components/popular-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center overflow-hidden">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-evenly items-center p-3 px-5 text-sm">
            <MenuList />
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="flex flex-col justify-evenly w-full gap-10 px-[10vw]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col flex-shrink-50">
              <h1 className="text-5xl font-bold">Superman</h1>
              <strong className="font-medium">2025</strong>
              <strong className="font-medium">
                Dirigida por{" "}
                <span className="underline cursor-pointer">James Gunn</span>
              </strong>
              <p className="font-normal max-w-[350px] mt-5">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Inventore assumenda libero, recusandae, deserunt dolorem quaerat
                sequi fuga cumque commodi provident, doloremque sunt excepturi
                numquam vero voluptatibus necessitatibus neque asperiores modi
                aperiam culpa est nulla nihil animi quas. A quia doloremque
                velit id, deserunt eos nam cupiditate voluptate error repellat
                dignissimos!
              </p>
            </div>
            <img
              src="img\caratula1.jpg"
              className="max-w-[30vw] rounded-md"
            ></img>
          </div>
          <div className="flex flex-col">
            <div className="mb-5">
              <h3 className="font-bold text-3xl">Reparto</h3>
              <p className="font-normal">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 items-center text-center w-[150px]">
                <img
                  className="w-[100px] rounded-md"
                  src="img\david-superman.png"
                  alt=""
                />
                <strong className="font-semibold text-sm">
                  David Corenswet (Superman)
                </strong>
              </div>
              <div className="flex flex-col gap-2 items-center text-center w-[150px]">
                <img
                  className="w-[100px] rounded-md"
                  src="img\maria-superman.png"
                  alt=""
                />
                <strong className="font-semibold text-sm">
                  Maria Gabriela De Faria (The Engineer)
                </strong>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-3xl font-bold">Comentarios</h4>
            <div className="flex gap-2">
              <div className="flex flex-col border-2 gap-5 p-5 rounded-md">
                <strong className="font-normal">
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorum, minus!"
                </strong>
                <div className="flex gap-2 items-center">
                  <img
                    className="w-[40px] rounded-[50]"
                    src="img\user.jpg"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <strong className="font-normal">Cleveland Karger</strong>
                    <strong className="">****</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
// <main className="min-h-screen flex flex-col items-center">
//   <div className="flex-1 w-full flex flex-col gap-20 items-center">
//     <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//       <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//         <div className="flex gap-5 items-center font-semibold">
//           <Link href={"/"}>Next.js Supabase Starter</Link>
//           <div className="flex items-center gap-2">
//             <DeployButton />
//           </div>
//         </div>
//         {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
//       </div>
//     </nav>
//     <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
//       <Hero />
//       <main className="flex-1 flex flex-col gap-6 px-4">
//         <h2 className="font-medium text-xl mb-4">Next steps</h2>
//         {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//       </main>
//     </div>

//     <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//       <p>
//         Powered by{" "}
//         <a
//           href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//           target="_blank"
//           className="font-bold hover:underline"
//           rel="noreferrer"
//         >
//           Supabase
//         </a>
//       </p>
//       <ThemeSwitcher />
//     </footer>
//   </div>
// </main>
