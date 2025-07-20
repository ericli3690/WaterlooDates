"use client";
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import path from "path";
import { useRouter } from "next/navigation";

interface Posting {
  id: string;
  title: string;
  description: string;
}

export default withPageAuthRequired(function SearchPage({ user }) {
  const [postings, setPostings] = useState<Posting[]>([
    {
      id: "123",
      title: "That's enough for me",
      description: "Song Yu Li is simply pleasing Wto the eyes",
    },
    {
      id: "124",
      title: "A New Hope",
      description: "The journey begins with a single step.",
    },
    {
      id: "125",
      title: "The Power of Dreams",
      description: "Believe in the impossible and achieve greatness.",
    },
    {
      id: "126",
      title: "Beyond the Horizon",
      description: "Adventure awaits those who dare to explore.",
    },
    {
      id: "127",
      title: "Whispers of the Past",
      description: "History holds the key to our future.",
    },
    {
      id: "128",
      title: "Echoes of Tomorrow",
      description: "The future is shaped by our actions today.",
    },
    {
      id: "129",
      title: "The Art of Possibility",
      description: "Creativity knows no bounds.",
    },
    {
      id: "130",
      title: "Journey to the Stars",
      description: "Reach for the stars and beyond.",
    },
  ]);

  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}get_all_rizzumes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setPostings(data))
      .catch((err) => console.error("Error fetching rizzumes:", err));
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-[#5b3e4a]">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          💘 Available Rizzumés
        </h1>

        {postings.map((posting) => (
          <div
            key={posting.id}
            className="relative group bg-white border border-yellow-300 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-[#ff76e8] mb-2">
              {posting.title}
            </h2>
            <p className="text-gray-700">{posting.description}</p>

            <button
              onClick={() => router.push(`/apply?id=${posting.id}`)}
              className="absolute bottom-4 cursor-pointer right-4 bg-[#ff76e8] hover:bg-[#e85fcf] text-white font-semibold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
            >
              Apply 💌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
