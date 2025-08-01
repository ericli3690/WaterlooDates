"use client";
import React, { useEffect, useState, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserData } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";

interface Application {
  _id: string;
  applicant_user_id: string;
  interviewer_user_id: string;
  applicant_name: string;
  interviewer_name: string;
  created_at: string;
  application_id: string;
  status: number;
  interview_id: string;
  interview_link: string;
  audio_url: string;
  transcript: string;
  gemini_response: any;
  interviewer_decision: number;
}

enum InterviewerDecision {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2
}

export default withPageAuthRequired(function DashboardPage({ user }) {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [outgoingApplications, setOutgoingApplications] = useState<Application[]>([]);
  const [incomingApplications, setIncomingApplications] = useState<Application[]>([]);
  const [showContactInfo, setShowContactInfo] = useState<boolean[]>([]);
  const [contactInfo, setContactInfo] = useState<string[]>([]);

  const router = useRouter();

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
            // Fetch outgoing applications
            fetch("http://127.0.0.1:5000/api/get_applications_for_applicant_and_update_status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.sub }),
            })
              .then((res) => res.json())
              .then((resp) => {
                if (resp && resp.applications) {
                  setOutgoingApplications(resp.applications as Application[]);
                  console.log("outgoing applications", resp.applications);
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
                    console.log("incoming applications", resp.applications);
                    // Filter out rejected applications and create showContactInfo array
                    const filteredApplications = (resp.applications as Application[]).filter(
                      app => app.interviewer_decision != InterviewerDecision.REJECTED
                    );
                    setIncomingApplications(filteredApplications);
                    
                    // Initialize showContactInfo array based on accepted applications
                    const initialShowContactInfo = filteredApplications.map(
                      app => app.interviewer_decision == InterviewerDecision.ACCEPTED
                    );
                    setShowContactInfo(initialShowContactInfo);
                    
                    // Initialize contactInfo array to empty strings
                    let initialContactInfo: string[] = filteredApplications.map(() => "");

                    // For accepted applications, fetch contact info and update the array
                    const fetches = filteredApplications.map((app, idx) => {
                      if (app.interviewer_decision == InterviewerDecision.ACCEPTED) {
                        return fetch("http://localhost:5000/api/get_user_socials", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ user_id: app.applicant_user_id }),
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            initialContactInfo[idx] = data?.success && data.socials
                              ? (typeof data.socials === "string"
                                  ? data.socials
                                  : JSON.stringify(data.socials))
                              : "No contact information available.";
                          });
                      } else {
                        return Promise.resolve();
                      }
                    });
                    Promise.all(fetches).then(() => setContactInfo(initialContactInfo));
                    
                    console.log("incoming applications", filteredApplications);
                  }
                })
                .catch(console.error);
            }
          }
        })
        .catch((err) => console.error("Error sending user data:", err));
    }
  }, [user]);

  const prettyPrintStatus = (status: number) => {
    console.log("status", status);
    return (status == 1) ? "Processing" : "Completed"
  };

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
                className={`py-2 px-4 rounded font-medium hover:cursor-pointer ${activeTab === "outgoing"
                    ? "bg-[#ff76e8] text-black"
                    : "bg-gray-200 text-gray-700"
                  }`}
              >
                Outgoing Applications
              </button>

              {userData.wingman_created && (
                <button
                  onClick={() => setActiveTab("incoming")}
                  className={`py-2 px-4 rounded font-medium hover:cursor-pointer ${activeTab === "incoming"
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
                    <p className="font-semibold">Application</p>
                    <span className="block text-sm text-gray-600 mb-2">
                      Status: {prettyPrintStatus(app.status)}
                    </span>
                  </li>
                ))}
                {outgoingApplications.length === 0 && (
                  <li className="p-4 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-center">
                    No outgoing applications yet. Start by searching for potential matches!
                  </li>
                )}
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

                  // Show contact info if accepted and available
                  // (contactInfo[idx] is set in state when showContactInfo[idx] is true)
                  return (
                    <li
                      key={idx}
                      className="relative p-4 bg-white text-black border border-yellow-300 rounded-xl shadow flex justify-between items-start"
                    >
                      <div className="pr-4 flex-1">
                        <p>
                          Application received!
                        </p>
                        <span className="block text-sm text-gray-600 mb-2">
                          Status: {prettyPrintStatus(app.status)}
                        </span>

                        {app.gemini_response && (
                          <>
                            <p className="font-semibold mb-1">Interview Summary:</p>
                            <p className="mb-2 text-sm text-gray-700 whitespace-pre-line">
                              {app.gemini_response.summary || "N/A"}
                            </p>
                            <p className="font-semibold mb-1">Your Wingman's Opinion:</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                              {app.gemini_response.opinion || "N/A"}
                            </p>

                            {app.audio_url && (
                              <div className="mb-2">
                                <p className="font-semibold mb-2 text-[#ff76e8]">Listen To Them:</p>
                                <audio
                                  controls
                                  className="w-full h-10 rounded-lg bg-[#ffe0f7] border-2 border-[#ff76e8] focus:outline-none focus:ring-2 focus:ring-[#ff76e8]/50"
                                  style={
                                    {
                                      '--plyr-color-main': '#ff76e8',
                                      '--plyr-audio-controls-background': '#ffe0f7',
                                      '--plyr-audio-control-color': '#ff76e8',
                                    } as React.CSSProperties
                                  }
                                >
                                  <source src={app.audio_url} type="audio/wav" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            )}
                          </>
                        )}

                        {/* Conditional exchange contact if accepted */}
                        {showContactInfo[idx] && (
                          <div className="mt-4">
                            <p className="font-semibold mb-2">Contact Information:</p>
                            <span className="text-gray-700">
                              {contactInfo[idx]}
                            </span>
                          </div>
                        )}

                        {/* Conditional accept/reject buttons if decision is pending and not yet accepted */}
                        {(app.status === 2 && app.interviewer_decision === InterviewerDecision.PENDING && !showContactInfo[idx]) && (
                          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                            <button
                              className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded-lg shadow hover:bg-green-600"
                              onClick={() => {
                                fetch("http://localhost:5000/api/update_interviewer_decision", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    "applicant_user_id": app.applicant_user_id,
                                    "interviewer_user_id": app.interviewer_user_id,
                                    "interviewer_decision": InterviewerDecision.ACCEPTED,
                                  }),
                                });
                                
                                // Update showContactInfo to show contact information for this application
                                const newShowContactInfo = [...showContactInfo];
                                newShowContactInfo[idx] = true;
                                setShowContactInfo(newShowContactInfo);

                                // Set contactInfo to loading for this idx
                                const newContactInfo = [...contactInfo];
                                newContactInfo[idx] = "Loading...";
                                setContactInfo(newContactInfo);

                                // Fetch and store contact info in state
                                fetch("http://localhost:5000/api/get_user_socials", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ user_id: app.applicant_user_id }),
                                })
                                  .then((res) => res.json())
                                  .then((data) => {
                                    console.log("Fetched contact info for idx", idx, data);
                                    const newContactInfo = [...contactInfo];
                                    newContactInfo[idx] = data?.success && data.socials
                                      ? (typeof data.socials === "string"
                                          ? data.socials
                                          : JSON.stringify(data.socials))
                                      : "No contact information available.";
                                    setContactInfo(newContactInfo);
                                  });
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-lg shadow hover:bg-red-600"
                              onClick={() => {
                                // Remove the application from both arrays
                                const newIncomingApplications = incomingApplications.filter((_, i) => i != idx);
                                setIncomingApplications(newIncomingApplications);
                                
                                const newShowContactInfo = showContactInfo.filter((_, i) => i != idx);
                                setShowContactInfo(newShowContactInfo);
                                
                                fetch("http://localhost:5000/api/update_interviewer_decision", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    "applicant_user_id": app.applicant_user_id,
                                    "interviewer_user_id": app.interviewer_user_id,
                                    "interviewer_decision": InterviewerDecision.REJECTED,
                                  }),
                                });
                              }}
                            >
                              Reject
                            </button>
                          </div>
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
                          <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="12"
                            fill="black"
                          >
                            {conf}%
                          </text>
                        </svg>
                      </div>
                    </li>
                  );
                })}
                {incomingApplications.length === 0 && (
                  <li className="p-4 bg-gray-50 text-gray-500 border border-gray-200 rounded-xl text-center">
                    No incoming applications yet. Your wingman will review applications when they come in!
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
