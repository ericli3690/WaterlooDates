"use client";
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(function WingmanPage({ user }) {
  const [wingmanCreated, setWingmanCreated] = useState<boolean>(false);

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
        setWingmanCreated(data.wingmanCreated);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#664e5b] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl border border-yellow-400 shadow-xl p-8 text-center">
        {wingmanCreated ? (
          <h1 className="text-3xl font-bold text-[#ff76e8]">
            Your Wingman is ready!
          </h1>
        ) : (
          <a
            href="/make-wingman"
            className="inline-block bg-[#ffda23] hover:bg-[#ffce00] text-black font-semibold py-3 px-8 rounded-2xl shadow-lg transition duration-300"
          >
            Create Wingman
          </a>
        )}
      </div>
    </div>
  );
});
