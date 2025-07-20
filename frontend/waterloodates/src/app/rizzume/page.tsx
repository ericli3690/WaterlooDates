"use client";
import React, { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import path from "path";

export default withPageAuthRequired(function RizzumePage({ user }) {
  const [rizzumeCreated, setRizzumeCreated] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}create_or_get_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const data = await res.json();
        setRizzumeCreated(data.rizzumeCreated);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#664e5b] flex items-center justify-center px-4">
      <div className="bg-white border border-yellow-400 rounded-2xl shadow-2xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#ff76e8]">Your Rizzumé</h1>
        <p className="text-gray-700 mb-3">
          Your Rizzumé is a fun, personality-forward profile designed to showcase who you are beyond just a picture.
        </p>
        <p className="text-gray-700 mb-8">
          Stand out in the dating scene with a unique profile that's as bold as you are.
        </p>

        <a
          href="/make-rizzume"
          className="inline-block bg-[#ffda23] hover:bg-[#ffce00] text-black font-semibold py-3 px-6 rounded-full shadow transition duration-300"
        >
          {rizzumeCreated ? "Edit Rizzumé" : "Create Rizzumé"}
        </a>
      </div>
    </div>
  );
});
