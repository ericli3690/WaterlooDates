"use client";
import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import path from "path";

export default withPageAuthRequired(function WingmanPage({ user }) {

    const [wingmanCreated, setWingmanCreated] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch(path.join(process.env.NEXT_PUBLIC_API_URL as string, "create_or_get_user"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            });
    
            const data = await res.json();
            setWingmanCreated(data.wingmanCreated);
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        };
    
        fetchUser();
      }, [user]);

    return(
        <div>
            {wingmanCreated ? (
                <div>
                    <h1>Your Wingman is ready!</h1>
                </div>
                ) : (
                <div>
                    <a href="/make-wingman" className="inline-block bg-[#ffda23] hover:bg-[#ffce00] text-black font-semibold py-3 px-6 rounded-full shadow transition duration-300">
                        Create Wingman
                    </a>
                </div>
            )}
        </div>
    );
}); 