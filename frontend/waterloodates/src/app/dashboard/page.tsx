"use client";
import React, { useEffect, useState, useRef } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import path from "path";

interface Application {
    _id: string;
    applicant_user_id: string;
    interviewer_user_id: string;
    status: number;
    interview_id: string;
    interview_link: string;
    audio_url: string;
    transcript: string;
    gemini_response: any;
    interviewer_decision: string;
}

interface UserData {
    name: string;
    email: string;
    rizzume_created: boolean;
    wingman_created: boolean;
    picture?: string;
    nickname?: string;
}

export default withPageAuthRequired(function DashboardPage({ user }) {
    const [userData, setUserData] = useState<UserData | null>({
        name: 'andrew',
        email: 'andrew@example.com',
        rizzume_created: true,
        wingman_created: true,
    });
    const [outgoingApplications, setOutgoingApplications] = useState<Application[]>([]);
    const [incomingApplications, setIncomingApplications] = useState<Application[]>([]);
    const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (user && !hasInitialized.current) {
            hasInitialized.current = true;
            
            fetch("http://127.0.0.1:5000/api/create_or_get_user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            })
                .then((res) => res.json())
                .then((data) => {
                    setUserData(data);

                    if (data.rizzume_created) {
                        fetch("http://127.0.0.1:5000/api/get_applications_for_applicant_and_update_status", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ user_id: user.sub }),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.success) {
                                    setOutgoingApplications(data.applications || []);
                                }
                            })
                            .catch(console.error);

                        if (data.wingman_created) {
                            fetch("http://127.0.0.1:5000/api/get_applications_for_interviewer_and_update_status", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ user_id: user.sub }),
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    if (data.success) {
                                        setIncomingApplications(data.applications || []);
                                    }
                                })
                                .catch(console.error);
                        }
                    }
                })
                .catch((err) => console.error('Error sending user data:', err));
        }
    }, [user]);

    return (
        <div className="bg-[#664e5b] min-h-screen flex items-center justify-center px-4">
            <div className="bg-white text-black border border-yellow-400 p-6 rounded-2xl shadow-xl max-w-5xl w-full">
                <h1 className="text-4xl font-bold mb-6 text-[#ff76e8]">
                    Welcome, {user?.name || 'User'}!
                </h1>

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

                {(userData && (!userData.rizzume_created || !userData.wingman_created)) && (
                    <div className="mb-6 space-y-3">
                        {!userData.rizzume_created && (
                            <a
                                href="/make-rizzume"
                                className="block bg-[#ff76e8] hover:bg-pink-400 text-black font-medium py-2 px-4 rounded"
                            >
                                Create Your Rizzumé
                            </a>
                        )}
                        {!userData.wingman_created && (
                            <a
                                href="/make-wingman"
                                className="block bg-[#ffda23] hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded"
                            >
                                Add a Wingman
                            </a>
                        )}
                    </div>
                )}

                {(userData?.rizzume_created && userData?.wingman_created) && (
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
                                {outgoingApplications.length === 0 ? (
                                    <li className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow text-center text-gray-500">
                                        No outgoing applications yet. Go apply to someone!
                                    </li>
                                ) : (
                                    outgoingApplications.map((app, idx) => (
                                        <li key={idx} className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow">
                                            Application to user {app.interviewer_user_id}
                                            <span className="block text-sm text-gray-600">
                                                Status: {app.status === 0 ? 'Created' : app.status === 1 ? 'In Progress' : 'Completed'}
                                            </span>
                                            {app.interview_link && (
                                                <a href={app.interview_link} target="_blank" rel="noopener noreferrer" 
                                                   className="text-blue-500 hover:underline block text-sm">
                                                    Interview Link
                                                </a>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}

                        {activeTab === 'incoming' && (
                            <ul className="space-y-2">
                                {incomingApplications.length === 0 ? (
                                    <li className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow text-center text-gray-500">
                                        No incoming applications yet.
                                    </li>
                                ) : (
                                    incomingApplications.map((app, idx) => (
                                        <li key={idx} className="p-4 bg-white text-black border border-yellow-300 rounded-xl shadow">
                                            Application from user {app.applicant_user_id}
                                            <span className="block text-sm text-gray-600">
                                                Status: {app.status === 0 ? 'Created' : app.status === 1 ? 'In Progress' : 'Completed'}
                                            </span>
                                            {app.interview_link && (
                                                <a href={app.interview_link} target="_blank" rel="noopener noreferrer" 
                                                   className="text-blue-500 hover:underline block text-sm">
                                                    Interview Link
                                                </a>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
});
