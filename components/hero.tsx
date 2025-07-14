import { Button } from "./ui/button";

export function Hero() {
  return (
    <div className="flex w-[100vw] p-10 h-[40vh] items-center justify-center">
      <div className="flex flex-col">
        <h1 className="text-6xl font-bold">SUNSET</h1>
        <p className="">Compartiendo el amor por el cine.</p>
        <div className="flex gap-4 mt-3 items-center justify-end">
          <Button variant={"secondary"}>Series</Button>
          <Button variant={"default"}>Películas</Button>
        </div>
      </div>
    </div>
  );
}
