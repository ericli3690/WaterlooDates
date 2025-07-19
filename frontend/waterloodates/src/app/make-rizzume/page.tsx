"use client";
import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import RizzumeForm from "@/components/RizzumeForm";

export default withPageAuthRequired(function RizzumePage({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-[#343434] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#343434]">Rizzume</h1>
        <p className="text-gray-600 mb-4">Create your Rizzume below:</p>
        <RizzumeForm />
      </div>
    </div>
  );
});

  
