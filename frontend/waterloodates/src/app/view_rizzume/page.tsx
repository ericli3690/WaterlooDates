'use client';

import React, { useEffect, useState } from 'react';
import RizzumeForm from '@/components/RizzumeForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

interface RizzumeProfile {
  user_id: string;
  profile: {
    pfp_url: string;
    name: {
      first: string;
      middle: string;
      last: string;
    };
    age: number;
    sexuality: string;
    gender: string;
  };
  job: {
    workterm: number;
    currentjob: string;
  };
  fun_stuff: {
    blurb: string;
    hobbies: string;
    fun_fact: string;
    relationship_goals: string;
    dealbreakers: string;
  };
}

export default withPageAuthRequired(function ViewRizzumePage({ user }) {
  const [profiles, setProfiles] = useState<RizzumeProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<RizzumeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingRizzume, setViewingRizzume] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/get_all_rizzumes`);
        if (!res.ok) throw new Error('Failed to fetch profiles');
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleStartInterview = (targetId: string) => {
    const sourceId = user?.sub?.split('|')[1]; // Assuming Auth0 ID format
    if (sourceId) {
      window.location.href = `/apply/wingman?applicantUserId=${sourceId}&interviewerUserId=${targetId}`;
    }
  };

  const Popup = ({ profile, onClose }: { profile: RizzumeProfile; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer font-bold">×</button>
        </div>
        <h2 className="text-xl text-black font-semibold text-center mb-10">
          Apply to {profile.profile.name.first} {profile.profile.name.last}
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setViewingRizzume(true);
              setSelectedProfile(profile);
            }}
            className="cursor-pointer bg-[#ff76e8] hover:bg-[#e85fcf] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            View Rizzumé 📄
          </button>
          <button
            onClick={() => handleStartInterview(profile.user_id)}
            className="cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-[#5b3e4a] font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            Start Interview 🎤
          </button>
        </div>
      </div>
    </div>
  );

  if (showForm) {
    return <RizzumeForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-24 bg-[#5b3e4a]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            💘 Available Rizzumés
          </h1>
          {!loading && (
            <p className="text-gray-600">
              {profiles.length === 0
                ? "No profiles found"
                : `Found ${profiles.length} profile${profiles.length === 1 ? '' : 's'}...`}
            </p>
          )}
        </div>
   

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <button
              key={profile.user_id}
              className="group flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-white hover:cursor-pointer"
              onClick={() => setSelectedProfile(profile)}
            >
              <div className="w-20 h-20 mb-3 overflow-hidden rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors">
                <img
                  src={profile.profile.pfp_url
                    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'de4d5bkfk'}/image/upload/${profile.profile.pfp_url}`
                    : '/default-profile.png'}
                  alt={`${profile.profile.name.first} ${profile.profile.name.last}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/default-profile.png';
                  }}
                />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-center">
                {profile.profile.name.first} {profile.profile.name.last}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {profile.job.currentjob}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedProfile && (
        <Popup profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}

      {viewingRizzume && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => {
                  setSelectedProfile(null);
                  setViewingRizzume(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:cursor-pointer"
              >
                ×
              </button>
            </div>
            <RizzumeForm
              initialData={selectedProfile}
              viewMode={true}
              onCancel={() => {
                setSelectedProfile(null);
                setViewingRizzume(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
