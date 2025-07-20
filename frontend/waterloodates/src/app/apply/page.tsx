"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

interface Posting {
  id: string;
  title: string;
  description: string;
}

export default withPageAuthRequired(function ApplyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const id = searchParams.get("id") as string;

  const [person, setPerson] = useState<Posting | null>({
    id: id,
    title: "Salls",
    description: "Bortnite",
  });

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}get_all_rizzumes`)
      .then((res) => res.json())
      .then((data: Posting[]) => {
        const match = data.find((p) => p.id === id);
        setPerson(match || null);
      })
      .catch((err) => console.error("Error fetching rizzumes:", err));
  }, [id]);

  if (!id) {
    return (
      <div className="text-center text-red-500 mt-10">No ID provided</div>
    );
  }

  if (!person) {
    return (
      <div className="text-center text-gray-400 mt-10">Loading...</div>
    );
  }

  const handleStartInterview = () => {
    if (!user?.sub) {
      console.error("User not authenticated");
      return;
    }

    const applicantUserId = encodeURIComponent(user.sub);
    const interviewerUserId = encodeURIComponent(person.id);

    router.push(
      `/apply/wingman?applicantUserId=${applicantUserId}&interviewerUserId=${interviewerUserId}`
    );
  };

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
            onClick={() => router.push(`/rizzume/${person.id}`)}
            className="cursor-pointer bg-[#ff76e8] hover:bg-[#e85fcf] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            View Rizzumé 📄
          </button>
          <button
            onClick={handleStartInterview}
            className="cursor-pointer bg-yellow-300 hover:bg-yellow-400 text-[#5b3e4a] font-semibold py-3 px-6 rounded-full shadow-lg transition"
          >
            Start Interview 🎤
          </button>
        </div>
      </div>
    </div>
  );
});
