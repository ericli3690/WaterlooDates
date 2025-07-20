"use client";
import React, { useEffect, useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import path from "path";

interface Application {
  applicantId: string;
  recipientId: string;
  applicantName: string;
  recipientName: string;
  status: string;
  createdAt: string;
  applicationId: string;
}

interface UserData {
  name: string;
  email: string;
  rizzumeCreated: boolean;
  wingmanCreated: boolean;
  picture?: string;
  nickname?: string;
}

export default withPageAuthRequired(function DashboardPage({ user }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [outgoingApplications, setOutgoingApplications] = useState<Application[]>([]);
  const [incomingApplications, setIncomingApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');

  useEffect(() => {
    if (user) {
      fetch(path.join(process.env.NEXT_PUBLIC_API_URL as string, "create_or_get_user"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          if (data.rizzumeCreated) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/outgoing`)
              .then((res) => res.json())
              .then(setOutgoingApplications)
              .catch(console.error);
            if (data.wingmanCreated) {
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/incoming`)
                .then((res) => res.json())
                .then(setIncomingApplications)
                .catch(console.error);
            }
          }
        })
        .catch((err) => console.error('Error sending user data:', err));
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <div className="bg-white text-black border border-yellow-400 p-6 rounded-2xl shadow-xl">
        {/* Header row with welcome and button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#ff76e8]">
            Welcome, {user?.name || 'User'}!
          </h1>
          <a
            href="/search"
            className="relative inline-flex items-center gap-2 bg-[#ff76e8] hover:bg-pink-400 text-black font-semibold py-2 px-4 rounded-xl shadow-lg transition duration-300 group"
          >
            <span className="animate-pulse">💖</span>
            <span className="relative z-10">Find your soulmate</span>
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {user?.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className="w-24 h-24 rounded-full mb-6"
          />
        )}

        <div className="space-y-2 mb-8">
          <p><span className="font-semibold">Email:</span> {user?.email}</p>
          <p><span className="font-semibold">Nickname:</span> {user?.nickname}</p>
        </div>

        {(userData && (!userData.rizzumeCreated || !userData.wingmanCreated)) && (
          <div className="mb-6 space-y-3">
            {!userData.rizzumeCreated && (
              <a
                href="/create-rizzume"
                className="block bg-[#ff76e8] hover:bg-pink-400 text-black font-medium py-2 px-4 rounded"
              >
                Create Your Rizzumé
              </a>
            )}
            {!userData.wingmanCreated && (
              <a
                href="/create-wingman"
                className="block bg-[#ffda23] hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded"
              >
                Add a Wingman
              </a>
            )}
          </div>
        )}

        {(userData?.rizzumeCreated && userData?.wingmanCreated) && (
          <div className="mt-8">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('outgoing')}
                className={`py-2 px-4 rounded font-medium ${activeTab === 'outgoing' ? 'bg-[#ff76e8] text-black' : 'bg-gray-200 text-gray-700'}`}
              >
                Outgoing Applications
              </button>
              <button
                onClick={() => setActiveTab('incoming')}
                className={`py-2 px-4 rounded font-medium ${activeTab === 'incoming' ? 'bg-[#ffda23] text-black' : 'bg-gray-200 text-gray-700'}`}
              >
                Incoming Applications
              </button>
            </div>

            {activeTab === 'outgoing' && (
              <ul className="space-y-2">
                {outgoingApplications.map((app, idx) => (
                  <li key={idx} className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow">
                    You applied to {app.recipientName} on {new Date(app.createdAt).toLocaleDateString()}.
                    <span className="block text-sm text-gray-600">Status: {app.status}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'incoming' && (
              <ul className="space-y-2">
                {incomingApplications.map((app, idx) => (
                  <li key={idx} className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow">
                    {app.applicantName} applied to you on {new Date(app.createdAt).toLocaleDateString()}.
                    <span className="block text-sm text-gray-600">Status: {app.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
