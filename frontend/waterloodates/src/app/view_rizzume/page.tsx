'use client';

import React, { useEffect, useState } from 'react';
import RizzumeForm from '@/components/RizzumeForm';

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



export default function ViewRizzumePage() {
  const [profiles, setProfiles] = useState<RizzumeProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<RizzumeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch all resumes from the backend API
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/get_all_rizzumes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
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

  const Modal = ({ profile, onClose }: { profile: RizzumeProfile; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:cursor-pointer"
          >
            ×
          </button>
        </div>
        <RizzumeForm 
          initialData={profile}
          viewMode={true}
          onCancel={onClose}
        />
      </div>
    </div>
  );

  // If showForm is true, render the RizzumeForm component
  if (showForm) {
    return (
      <RizzumeForm 
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rizzumé Profiles</h1>
          {!loading && (
            <p className="text-gray-600">
              {profiles.length === 0 
                ? "No profiles found" 
                : `Found ${profiles.length} profile${profiles.length === 1 ? '' : 's'}`}
            </p>
          )}
        </div>
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
                    : '/default-profile.png'
                  }
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
        <Modal 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}
