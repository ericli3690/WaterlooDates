"use client";
import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import path from "path";

export default withPageAuthRequired(function DashboardPage({ user }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(path.join(process.env.NEXT_PUBLIC_API_URL as string, "create_or_get_user"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then(async (res) => {
          if (!res.ok) {
            console.error('Failed to send user data:', res.statusText);
          } else {
            const data = await res.json();
            setUserData(data);
          }
        })
        .catch((err) => console.error('Error sending user data:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div className="text-center text-[#ff76e8]">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, <span className="text-[#ff76e8]">{user?.name || 'User'}</span>!
      </h1>

      {user?.picture && (
        <img
          src={user.picture}
          alt={user.name}
          className="w-24 h-24 rounded-full mb-6 border-4 border-[#ff76e8]"
        />
      )}

      <div className="space-y-2 mb-8">
        <p><span className="font-semibold text-[#ffda23]">Email:</span> {user?.email}</p>
        <p><span className="font-semibold text-[#ffda23]">Nickname:</span> {user?.nickname}</p>
      </div>

      {userData?.rizzumeCreated ? (
        <div className="bg-[#343434] border border-[#ff76e8] rounded p-4">
          <h2 className="text-2xl font-semibold text-[#ff76e8] mb-4">Your Applications</h2>
          {/* Replace below with actual posting rendering logic */}
          <p className="text-[#ffda23]">You have posted some date applications. 🎉</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-[#ffda23]">You haven't created your Rizzumé yet!</p>
          <a
            href="/create-rizzume"
            className="inline-block bg-[#ff76e8] hover:bg-[#ff96f8] text-white font-medium py-2 px-4 rounded"
          >
            Create Rizzumé
          </a>
        </div>
      )}

      <div className="mt-8">
        <a
          href="/auth/logout"
          className="inline-block bg-[#343434] hover:bg-[#1e1e1e] text-white font-medium py-2 px-4 rounded border border-[#ff76e8]"
        >
          Log out
        </a>
      </div>
    </div>
  );
});
