"use client";

import { useRouter } from "next/navigation";

export function PopularSection() {
  const router = useRouter();
  return (
    <div className="flex flex-col p-10 px-[20vw] gap-5 w-full overflow-hidden">
      <div className="">
        <h2 className="text-2xl font-bold">Películas populares</h2>
        <p className="font-normal">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et, eius!
        </p>
      </div>
      <div className="flex justify-center">
        <img
          onClick={() => router.push("/superman")}
          className="w-[200px] cursor-pointer"
          src="img\caratula1.jpg"
        ></img>
        <img className="w-[200px] cursor-pointer" src="img\caratula2.jpg"></img>
        <img className="w-[200px] cursor-pointer" src="img\caratula3.jpg"></img>
        <img className="w-[200px] cursor-pointer" src="img\caratula4.jpg"></img>
      </div>
    </div>
  );
}
