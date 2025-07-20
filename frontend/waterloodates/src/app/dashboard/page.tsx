"use client";
import React, { useEffect, useState, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserData } from "@/interfaces/interfaces";

interface Application {
    _id: string;
    applicant_user_id: string;
    interviewer_user_id: string;
    applicant_name: string;
    recipient_name: string;
    created_at: string;
    application_id: string;
    status: string;
    interview_id: string;
    interview_link: string;
    audio_url: string;
    transcript: string;
    gemini_response: any;
    interviewer_decision: string;
}



export default withPageAuthRequired(function DashboardPage({ user }) {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [outgoingApplications, setOutgoingApplications] = useState<Application[]>([
    {
      _id: "1",
      applicant_user_id: "1",
      interviewer_user_id: "2",
      applicant_name: "John Doe",
      recipient_name: "Jane Smith",
      status: "Pending",
      created_at: new Date().toISOString(),
      application_id: "app-123",
      interview_id: "",
      interview_link: "",
      audio_url: "",
      transcript: "",
      gemini_response: null,
      interviewer_decision: "",
    }
  ]);
  const [incomingApplications, setIncomingApplications] = useState<Application[]>([
    {
      _id: "2",
      applicant_user_id: "3",
      interviewer_user_id: "1",
      applicant_name: "Alice Johnson",
      recipient_name: "John Doe",
      status: "Completed",
      created_at: new Date().toISOString(),
      application_id: "app-456",
      interview_id: "",
      interview_link: "",
      audio_url: "",
      transcript: "",
      gemini_response: {
        summary: "Alice was confident and answered all questions thoroughly. She seems genuinely interested and aligns well with your interests.",
        opinion: "Your wingman thinks Alice is a great match and you should definitely consider a date!",
        confidence: 85,
      },
      interviewer_decision: "",
    },
    {
      _id: "3",
      applicant_user_id: "4",
      interviewer_user_id: "1",
      applicant_name: "Bob Smith",
      recipient_name: "John Doe",
      status: "Completed",
      created_at: new Date().toISOString(),
      application_id: "app-789",
      interview_id: "",
      interview_link: "",
      audio_url: "",
      transcript: "",
      gemini_response: {
        summary: "Bob seemed a bit nervous and his answers were short. Compatibility might be moderate.",
        opinion: "Wingman recommends another chat to gauge chemistry before committing to a date.",
        confidence: 55,
      },
      interviewer_decision: "",
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

          if (data.rizzume_created) {
            fetch("http://127.0.0.1:5000/api/get_applications_for_applicant_and_update_status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.sub }),
            })
              .then((res) => res.json())
              .then((resp) => {
                if (resp && resp.applications) {
                  setOutgoingApplications(resp.applications as Application[]);
                }
              })
              .catch(console.error);

            if (data.wingman_created) {
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
    <div className="bg-[#664e5b] min-h-screen px-4 pt-16 py-6 relative">


      <div className="bg-white text-black border border-yellow-400 p-6 rounded-2xl shadow-xl max-w-5xl w-full mx-auto mt-12 relative">
        <h1 className="text-4xl font-bold mb-6 text-[#ff76e8]">
          Welcome, {user?.name || "User"}!
        </h1>

        {userData?.rizzume_created && (
          <a
            href="/view_rizzume"
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
        {(userData && (!userData.rizzume_created || !userData.wingman_created)) && (
          <div className="mb-6 space-y-3">
            {!userData.rizzume_created && (
              <a
                href="/rizzume"
                className="block bg-[#ff76e8] hover:bg-pink-400 text-black font-medium py-2 px-4 rounded"
              >
                Create Your Rizzumé
              </a>
            )}
            {!userData.wingman_created && (
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
        {userData?.rizzume_created && (
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

              {userData.wingman_created && (
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
                    You applied to {app.interviewer_user_id}!
                    <span className="block text-sm text-gray-600">
                      Status: {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Incoming (only if wingman exists) */}
            {activeTab === "incoming" && userData.wingman_created && (
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
                          {app.applicant_name} applied to you on {" "}
                          {new Date(app.created_at).toLocaleDateString()}.
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
