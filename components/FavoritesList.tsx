"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { Heart } from "lucide-react";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    datePosted: Date;
    source: string;
    description?: string | null;
}

export default function FavoritesList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

            if (favorites.length === 0) {
                setJobs([]);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/jobs/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ids: favorites }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();

        // Listen for updates (if user un-favorites an item in the list)
        const handleStorageChange = () => {
            fetchFavorites();
        };

        window.addEventListener("favoritesUpdated", handleStorageChange);
        return () => window.removeEventListener("favoritesUpdated", handleStorageChange);
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Chargement de vos favoris...</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-xl text-gray-500 font-medium">Aucun favori pour le moment.</p>
                <p className="text-gray-400 mt-2">Cliquez sur le cœur ❤️ pour sauvegarder des offres.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
}
