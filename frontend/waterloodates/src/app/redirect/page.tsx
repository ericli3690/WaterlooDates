"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  const goToSearch = () => {
    router.push("/search");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#664e5b]">
      <h1 className="text-4xl font-bold text-[#ff76e8] mb-8 text-center">
        Your interview is over!
      </h1>
      
      <button
        onClick={goToSearch}
        className="px-8 py-3 bg-[#ffda23] text-black rounded-lg hover:bg-[#f7e84a] transition-colors font-semibold text-lg hover:cursor-pointer"
      >
        Back to Search
      </button>
    </main>
  );
}
