"use client";
import React, { useEffect, useState, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

interface Application {
  applicantId: string;
  recipientId: string;
  applicantName: string;
  recipientName: string;
  status: string;
  createdAt: string;
  applicationId: string;
  gemini_response?: {
    summary?: string;
    opinion?: string;
    confidence?: number; // 0-100
  };
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
  const [userData, setUserData] = useState<UserData | null>({
    name: "",
    email: "",
    rizzumeCreated: true,
    wingmanCreated: false,
  });
  const [outgoingApplications, setOutgoingApplications] = useState<Application[]>([
    {
      applicantId: "1",
      recipientId: "2",
      applicantName: "John Doe",
      recipientName: "Jane Smith",
      status: "Pending",
      createdAt: new Date().toISOString(),
      applicationId: "app-123",
    }
  ]);
  const [incomingApplications, setIncomingApplications] = useState<Application[]>([
    {
      applicantId: "3",
      recipientId: "1",
      applicantName: "Alice Johnson",
      recipientName: "John Doe",
      status: "Completed",
      createdAt: new Date().toISOString(),
      applicationId: "app-456",
      gemini_response: {
        summary: "Alice was confident and answered all questions thoroughly. She seems genuinely interested and aligns well with your interests.",
        opinion: "Your wingman thinks Alice is a great match and you should definitely consider a date!",
        confidence: 85,
      },
    },
    {
      applicantId: "4",
      recipientId: "1",
      applicantName: "Bob Smith",
      recipientName: "John Doe",
      status: "Completed",
      createdAt: new Date().toISOString(),
      applicationId: "app-789",
      gemini_response: {
        summary: "Bob seemed a bit nervous and his answers were short. Compatibility might be moderate.",
        opinion: "Wingman recommends another chat to gauge chemistry before committing to a date.",
        confidence: 55,
      },
    },
  ]);
  const [activeTab, setActiveTab] = useState<"outgoing" | "incoming">("outgoing");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (user && !hasInitialized.current) {
      hasInitialized.current = true;

      fetch("http://127.0.0.1:5000/api/create_or_get_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              // Fetch incoming applications with gemini responses
              fetch("http://127.0.0.1:5000/api/get_applications_for_interviewer_and_update_status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.sub }),
              })
                .then((res) => res.json())
                .then((resp) => {
                  if (resp && resp.applications) {
                    setIncomingApplications(resp.applications as Application[]);
                  }
                })
                .catch(console.error);
            }
          }
        })
        .catch((err) => console.error("Error sending user data:", err));
    }
  }, [user]);

  return (
    <div className="bg-[#664e5b] min-h-screen px-4 py-6 relative">


      <div className="bg-white text-black border border-yellow-400 p-6 rounded-2xl shadow-xl max-w-5xl w-full mx-auto mt-12 relative">
        <h1 className="text-4xl font-bold mb-6 text-[#ff76e8]">
          Welcome, {user?.name || "User"}!
        </h1>

        {userData?.rizzumeCreated && (
          <a
            href="/search"
            className="absolute top-6 right-6 bg-[#ff76e8] hover:bg-[#ff90ef] text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all flex items-center group"
          >
            ❤️ Find Your Soulmate
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </a>
        )}


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

        {/* Create Prompt Buttons */}
        {(userData && (!userData.rizzumeCreated || !userData.wingmanCreated)) && (
          <div className="mb-6 space-y-3">
            {!userData.rizzumeCreated && (
              <a
                href="/rizzume"
                className="block bg-[#ff76e8] hover:bg-pink-400 text-black font-medium py-2 px-4 rounded"
              >
                Create Your Rizzumé
              </a>
            )}
            {!userData.wingmanCreated && (
              <a
                href="/wingman"
                className="block bg-[#ffda23] hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded"
              >
                Add a Wingman
              </a>
            )}
          </div>
        )}

        {/* Tabs for Applications */}
        {userData?.rizzumeCreated && (
          <div className="mt-8">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("outgoing")}
                className={`py-2 px-4 rounded font-medium ${
                  activeTab === "outgoing"
                    ? "bg-[#ff76e8] text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Outgoing Applications
              </button>

              {userData.wingmanCreated && (
                <button
                  onClick={() => setActiveTab("incoming")}
                  className={`py-2 px-4 rounded font-medium ${
                    activeTab === "incoming"
                      ? "bg-[#ffda23] text-black"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Incoming Applications
                </button>
              )}
            </div>

            {/* Outgoing */}
            {activeTab === "outgoing" && (
              <ul className="space-y-2">
                {outgoingApplications.map((app, idx) => (
                  <li
                    key={idx}
                    className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow"
                  >
                    You applied to {app.recipientName} on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}.
                    <span className="block text-sm text-gray-600">
                      Status: {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Incoming (only if wingman exists) */}
            {activeTab === "incoming" && userData.wingmanCreated && (
              <ul className="space-y-2">
                {incomingApplications.map((app, idx) => {
                  const conf = app.gemini_response?.confidence ?? 0;
                  const strokeDasharray = 2 * Math.PI * 28; // r=28
                  const strokeDashoffset = strokeDasharray * (1 - conf / 100);
                  const strokeColor = conf >= 70 ? "#26a69a" : conf >= 40 ? "#ffda23" : "#e03e3e";
                  return (
                    <li
                      key={idx}
                      className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow flex justify-between items-start"
                    >
                      <div className="pr-4 flex-1">
                        <p>
                          {app.applicantName} applied to you on {" "}
                          {new Date(app.createdAt).toLocaleDateString()}.
                        </p>
                        <span className="block text-sm text-gray-600 mb-2">Status: {app.status}</span>
                        {app.gemini_response && (
                          <>
                            <p className="font-semibold mb-1">Interview Summary:</p>
                            <p className="mb-2 text-sm text-gray-700 whitespace-pre-line">
                              {app.gemini_response.summary || "N/A"}
                            </p>
                            <p className="font-semibold mb-1">Your Wingman's Opinion:</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">
                              {app.gemini_response.opinion || "N/A"}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="w-20 h-20 flex items-center justify-center">
                        <svg width="60" height="60">
                          <circle cx="30" cy="30" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                          <circle
                            cx="30"
                            cy="30"
                            r="28"
                            stroke={strokeColor}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 30 30)"
                          />
                          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fill="black">
                            {conf}%
                          </text>
                        </svg>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
