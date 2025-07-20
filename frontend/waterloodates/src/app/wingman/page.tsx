"use client";
import React, { useState, useEffect, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserData } from "@/interfaces/interfaces";

export default withPageAuthRequired(function WingmanPage({ user }) {
  const [wingmanCreated, setWingmanCreated] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!user || hasInitialized.current) return;
    
    hasInitialized.current = true;
    
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}create_or_get_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const data: UserData = await res.json();
        setWingmanCreated(data.wingman_created);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  return (
    <div className="bg-[#664e5b] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-yellow-400 rounded-2xl shadow-2xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#ff76e8]">Your Wingman</h1>
        <p className="text-gray-700 mb-3">
          Your Wingman is your AI-powered interview assistant that helps you conduct meaningful conversations with potential matches.
        </p>
        <p className="text-gray-700 mb-3">
          It asks thoughtful questions, analyzes responses, and provides insights to help you make informed decisions about compatibility.
        </p>
        <p className="text-gray-700 mb-8">
          Let your Wingman guide you through engaging interviews and discover deeper connections beyond surface-level attraction.
        </p>

        {wingmanCreated ? (
          <div>
            <p className="text-green-600 font-semibold mb-4 text-lg">
              Your Wingman is ready to help you interview candidates!
            </p>
            <a
              href="/make-wingman"
              className="inline-block bg-[#ffda23] hover:bg-[#ffce00] text-black font-semibold py-3 px-6 rounded-full shadow transition duration-300"
            >
              Edit Wingman
            </a>
          </div>
        ) : (
          <a
            href="/make-wingman"
            className="inline-block bg-[#ffda23] hover:bg-[#ffce00] text-black font-semibold py-3 px-6 rounded-full shadow transition duration-300"
          >
            Create Wingman
          </a>
        )}
      </div>
    </div>
  );
});
