import React, { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import path from "path";

interface Posting {
    id: string;
    title: string;
    description: string;
}

export default withPageAuthRequired(function SearchPage({ user }) {

    const [postings, setPostings] = useState<Posting[]>([]);

    useEffect(() => {
        fetch(path.join(process.env.NEXT_PUBLIC_API_URL as string, "get_postings"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setPostings(data);
            });
    }, [user]);

    return (
        <div>
            {postings.map((posting) => (
                <div key={posting.id}>
                    <h2>{posting.title}</h2>
                    <p>{posting.description}</p>
                </div>
            ))}
        </div>
    )
});