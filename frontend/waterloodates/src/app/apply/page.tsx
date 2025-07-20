"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

interface Posting {
  id: string;
  title: string;
  description: string;
}

export default withPageAuthRequired(function ApplyPage({ user }: { user: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") as string;

  const [person, setPerson] = useState<Posting | null>({
    id: id,
    title: "Salls",
    description: "Bortnite",
  });
  const [userData, setUserData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRizzumePopup, setShowRizzumePopup] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!id || !user || hasInitialized.current) return;

    hasInitialized.current = true;

    fetch("http://127.0.0.1:5000/api/create_or_get_user", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error('Error fetching user data:', err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}get_all_rizzumes`)
      .then((res) => res.json())
      .then((data: Posting[]) => {
        const match = data.find((p) => p.id === id);
        setPerson(match || null);
      })
      .catch((err) => console.error("Error fetching rizzumes:", err));
  }, [id, user]);

  const handleSubmitApplication = async () => {
    if (!userData?.rizzume_created) {
      router.push("/make-rizzume");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/create_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_user_id: user.sub,
          interviewer_user_id: person?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(data.error || 'Please try again.');
        setShowErrorDialog(true);
        setTimeout(() => setShowErrorDialog(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMessage('An error occurred while submitting your application. Please check your connection and try again.');
      setShowErrorDialog(true);
      setTimeout(() => setShowErrorDialog(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartInterview = () => {
    if (!user?.sub) {
      console.error("User not authenticated");
      return;
    }
    console.log(user);
    const applicantUserId = user.sub;
    const interviewerUserId = encodeURIComponent(person?.id || "");

    router.push(`/apply/wingman?applicant_user_id=${applicantUserId}&interviewer_user_id=${interviewerUserId}`);
  };

  if (!id) return <div className="text-center text-red-500 mt-10">No ID provided</div>;
  if (!person) return <div className="text-center text-gray-400 mt-10">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#5b3e4a] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white text-[#5b3e4a] rounded-3xl shadow-xl p-10 max-w-xl w-full text-center space-y-6 relative">

        {/* Back Button */}
        <button
          onClick={() => router.push("/search")}
          className="text-sm text-[#5b3e4a] hover:text-[#ff76e8] font-semibold underline transition cursor-pointer"
        >
          ← Back to Search
        </button>

        <h1 className="text-4xl font-bold text-[#ff76e8]">
          💞 You're applying to {person.title}
        </h1>
        <p className="text-lg text-gray-700">{person.description}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowRizzumePopup(true)}
            className="cursor-pointer bg-[#ff76e8] hover:bg-[#e85fcf] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            View Rizzumé 📄
          </button>
          <button
            onClick={handleSubmitApplication}
            disabled={submitting}
            className="cursor-pointer bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            {submitting ? 'Submitting...' : 'Submit Application 💌'}
          </button>
          <button
            onClick={handleStartInterview}
            className="cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-[#5b3e4a] font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            Start Interview 🎤
          </button>
        </div>

        {/* Rizzume Popup */}
        {showRizzumePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-[#5b3e4a] rounded-3xl shadow-2xl p-8 w-[90%] max-w-2xl relative">
              <button
                onClick={() => setShowRizzumePopup(false)}
                className="absolute top-4 right-4 text-2xl font-bold text-[#5b3e4a] hover:text-[#ff76e8]"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">{person.title}'s Rizzumé</h2>
              <p>{person.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed top-4 right-4 bg-[#dafaf1] border-2 border-[#26a69a] text-[#008066] px-4 py-3 rounded-lg shadow-lg z-50">
          <p className="font-medium">Application submitted successfully!</p>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed top-4 right-4 bg-[#ffe6e6] border-2 border-[#e03e3e] text-[#a80000] px-4 py-3 rounded-lg shadow-lg z-50">
          <p className="font-medium">Error: {errorMessage}</p>
        </div>
      )}
    </div>
  );
});
