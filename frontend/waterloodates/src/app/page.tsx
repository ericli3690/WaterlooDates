"use client";
import React from "react";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#343434]">
      <h1 className="text-7xl p-4 font-bold">
        <span className="text-[#ffda23]">Waterloo</span>
        <span className="text-[#ff76e8]">Dates</span>
      </h1>

      <p className="text-2xl text-gray-300 mb-8">
        Never fade when a match is made!
      </p>
      <LoginButton />
    </main>
  );
}
