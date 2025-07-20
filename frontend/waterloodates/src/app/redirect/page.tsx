"use client";
import React, { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    window.parent.postMessage("navigated", "*");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#664e5b]">
      <h1 className="text-4xl font-bold text-[#ff76e8] mb-8 text-center">
        Redirecting...
      </h1>
    </main>
  );
}
