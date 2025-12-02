"use client";

import Link from "next/link";
import { Clock, MapPin, Briefcase, Heart, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface JobProps {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        url: string;
        datePosted: Date;
        source: string;
        description?: string | null;
    };
}

export default function JobCard({ job }: JobProps) {
    const isNew = (new Date().getTime() - new Date(job.datePosted).getTime()) < 24 * 60 * 60 * 1000;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isViewed, setIsViewed] = useState(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(job.id));

        const viewed = JSON.parse(localStorage.getItem("viewed") || "[]");
        setIsViewed(viewed.includes(job.id));
    }, [job.id]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        let newFavorites;
        if (favorites.includes(job.id)) {
            newFavorites = favorites.filter((id: string) => id !== job.id);
        } else {
            newFavorites = [...favorites, job.id];
        }
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);

        window.dispatchEvent(new Event("favoritesUpdated"));
    };

    const handleView = () => {
        const viewed = JSON.parse(localStorage.getItem("viewed") || "[]");
        if (!viewed.includes(job.id)) {
            const newViewed = [...viewed, job.id];
            localStorage.setItem("viewed", JSON.stringify(newViewed));
            setIsViewed(true);
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 dark:border-gray-700 flex flex-col relative group ${isViewed ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50 grayscale-[0.5]' : ''}`}>
            {isNew && !isViewed && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">
                    NOUVEAU
                </span>
            )}

            {isViewed && (
                <span className="absolute top-4 left-4 bg-gray-500/80 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm">
                    <Eye className="w-3 h-3 mr-1" /> VU
                </span>
            )}

            <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
                <Heart
                    className={`w-6 h-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
            </button>

            <div className="flex justify-between items-start mb-4 pr-12 mt-6">
                <div>
                    <h2 className={`text-xl font-semibold mb-1 line-clamp-2 text-gray-900 dark:text-white ${isViewed ? 'text-gray-600 dark:text-gray-400' : ''}`}>
                        {job.title}
                    </h2>
                    <p className={`text-blue-600 dark:text-blue-400 font-medium text-lg ${isViewed ? 'text-blue-400 dark:text-blue-600/70' : ''}`}>
                        {job.company}
                    </p>
                </div>
            </div>

            <div className="mb-6 flex-grow space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.source}
                </div>
                <div className="flex items-center text-xs font-mono text-gray-400 dark:text-gray-500 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(job.datePosted).toLocaleDateString("fr-FR", {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
            </div>

            <Link
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleView}
                className={`block w-full text-center font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95 shadow-md ${isViewed
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    }`}
            >
                {isViewed ? 'Revoir l\'offre' : 'Voir l\'offre'}
            </Link>
        </div>
    );
}
