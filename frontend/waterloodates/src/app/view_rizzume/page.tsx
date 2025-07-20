'use client';

import React, { useEffect, useState } from 'react';
import RizzumeForm from '@/components/RizzumeForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRef } from 'react';
import { Modal, Button, Checkbox, NumberInput, Group, Stack, Text, Title, Divider } from '@mantine/core';


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
  const [filteredProfiles, setFilteredProfiles] = useState<RizzumeProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<RizzumeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingRizzume, setViewingRizzume] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter ref (doesn't cause re-renders)
  const filtersRef = useRef({
    genders: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
    sexualities: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer'],
    minAge: 0,
    maxAge: 100,
    minWorkTerm: 0,
    maxWorkTerm: 6
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/get_all_rizzumes`);
        if (!res.ok) throw new Error('Failed to fetch profiles');
        const data = await res.json();
        setProfiles(data);
        setFilteredProfiles(data);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setProfiles([]);
        setFilteredProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Apply filters function
  const applyFilters = () => {
    console.log("applying filters", filtersRef.current);
    const filtered = profiles.filter(profile => {
      // Filter by gender
      if (filtersRef.current.genders.length > 0 && !filtersRef.current.genders.includes(profile.profile.gender)) {
        return false;
      }
      
      // Filter by sexuality
      if (filtersRef.current.sexualities.length > 0 && !filtersRef.current.sexualities.includes(profile.profile.sexuality)) {
        return false;
      }
      
      // Filter by age
      if (profile.profile.age < filtersRef.current.minAge || profile.profile.age > filtersRef.current.maxAge) {
        return false;
      }
      
      // Filter by work term
      if (profile.job.workterm < filtersRef.current.minWorkTerm || profile.job.workterm > filtersRef.current.maxWorkTerm) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProfiles(filtered);
  };

  // Apply filters when profiles change
  useEffect(() => {
    applyFilters();
  }, [profiles]);

  const handleApplyFilters = (filters: {
    genders: string[];
    sexualities: string[];
    minAge: number;
    maxAge: number;
    minWorkTerm: number;
    maxWorkTerm: number;
  }) => {
    filtersRef.current = filters;
    applyFilters();
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              💘 Available Rizzumés
            </h1>
            <Button
              onClick={() => setShowFilterModal(true)}
              variant="filled"
              color="gray.1"
              c="dark"
              leftSection="🔍"
            >
              Filter
            </Button>
          </div>
          {!loading && (
            <p className="text-gray-300">
              {filteredProfiles.length === 0
                ? "No profiles found"
                : `Found ${filteredProfiles.length} profile${filteredProfiles.length === 1 ? '' : 's'}...`}
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
            {filteredProfiles.map((profile) => (
            profile.user_id === user.sub ? null : (
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
          )))}
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

      {/* Filter Modal */}
      <FilterModal
        opened={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
});



function FilterModal({
  opened,
  onClose,
  onApplyFilters
}: {
  opened: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    genders: string[];
    sexualities: string[];
    minAge: number;
    maxAge: number;
    minWorkTerm: number;
    maxWorkTerm: number;
  }) => void;
}) {
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'];
  const sexualityOptions = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Queer'];
  
  const [localFilters, setLocalFilters] = useState({
    genders: genderOptions,
    sexualities: sexualityOptions,
    minAge: 0,
    maxAge: 100,
    minWorkTerm: 0,
    maxWorkTerm: 6,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setLocalFilters(prev => ({
        ...prev,
        genders: [...prev.genders, gender]
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        genders: prev.genders.filter(g => g !== gender)
      }));
    }
  };

  const handleSexualityChange = (sexuality: string, checked: boolean) => {
    if (checked) {
      setLocalFilters(prev => ({
        ...prev,
        sexualities: [...prev.sexualities, sexuality]
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        sexualities: prev.sexualities.filter(s => s !== sexuality)
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors: string[] = [];
    
    if (localFilters.minAge > localFilters.maxAge) {
      newErrors.push('Minimum age cannot be greater than maximum age');
    }
    
    if (localFilters.minWorkTerm > localFilters.maxWorkTerm) {
      newErrors.push('Minimum work term cannot be greater than maximum work term');
    }
    
    if (localFilters.minWorkTerm < 0 || localFilters.maxWorkTerm > 6) {
      newErrors.push('Work term must be between 0 and 6');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onApplyFilters(localFilters);
    onClose();
    setErrors([]);
  };

  const handleSelectAll = (type: 'genders' | 'sexualities') => {
    const options = type === 'genders' ? genderOptions : sexualityOptions;
    setLocalFilters(prev => ({
      ...prev,
      [type]: options
    }));
  };

  const handleClearAll = (type: 'genders' | 'sexualities') => {
    setLocalFilters(prev => ({
      ...prev,
      [type]: []
    }));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Filter Profiles"
      size="md"
      centered
      styles={{
        content: {
          maxHeight: '70vh',
          overflowY: 'auto'
        }
      }}
    >
      <Stack gap="md">
        {errors.length > 0 && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.map((error, index) => (
              <Text key={index} size="sm" c="red">{error}</Text>
            ))}
          </div>
        )}

        {/* Gender Filter */}
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={4}>Gender</Title>
            <Group gap="xs">
              <Button size="xs" variant="subtle" onClick={() => handleSelectAll('genders')}>
                Select All
              </Button>
              <Button size="xs" variant="subtle" color="red" onClick={() => handleClearAll('genders')}>
                Clear All
              </Button>
            </Group>
          </Group>
          <Stack gap="xs">
            {genderOptions.map((gender) => (
              <Checkbox
                key={gender}
                label={gender}
                checked={localFilters.genders.includes(gender)}
                onChange={(event) => handleGenderChange(gender, event.currentTarget.checked)}
              />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* Sexuality Filter */}
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={4}>Sexuality</Title>
            <Group gap="xs">
              <Button size="xs" variant="subtle" onClick={() => handleSelectAll('sexualities')}>
                Select All
              </Button>
              <Button size="xs" variant="subtle" color="red" onClick={() => handleClearAll('sexualities')}>
                Clear All
              </Button>
            </Group>
          </Group>
          <Stack gap="xs">
            {sexualityOptions.map((sexuality) => (
              <Checkbox
                key={sexuality}
                label={sexuality}
                checked={localFilters.sexualities.includes(sexuality)}
                onChange={(event) => handleSexualityChange(sexuality, event.currentTarget.checked)}
              />
            ))}
          </Stack>
        </div>

        <Divider />

        {/* Age Range */}
        <div>
          <Title order={4} mb="xs">Age Range</Title>
          <Group grow>
            <NumberInput
              label="Min Age"
              value={localFilters.minAge}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, minAge: typeof value === 'number' ? value : 0 }))}
              min={0}
              max={100}
            />
            <NumberInput
              label="Max Age"
              value={localFilters.maxAge}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, maxAge: typeof value === 'number' ? value : 100 }))}
              min={0}
              max={100}
            />
          </Group>
        </div>

        <Divider />

        {/* Work Term Range */}
        <div>
          <Title order={4} mb="xs">Work Term Range</Title>
          <Group grow>
            <NumberInput
              label="Min Work Term"
              value={localFilters.minWorkTerm}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, minWorkTerm: typeof value === 'number' ? value : 0 }))}
              min={0}
              max={6}
            />
            <NumberInput
              label="Max Work Term"
              value={localFilters.maxWorkTerm}
              onChange={(value) => setLocalFilters(prev => ({ ...prev, maxWorkTerm: typeof value === 'number' ? value : 6 }))}
              min={0}
              max={6}
            />
          </Group>
        </div>

        <Group justify="space-between" mt="md">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Apply Filters
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}