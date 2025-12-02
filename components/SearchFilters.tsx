"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchFilters() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`/?${params.toString()}`);
    }, 300);

    const handleCompany = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("company", term);
        } else {
            params.delete("company");
        }
        replace(`/?${params.toString()}`);
    }, 300);

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sort);
        replace(`/?${params.toString()}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 items-end">
            <div className="flex-1">
                <label htmlFor="search" className="sr-only">
                    Rechercher
                </label>
                <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Titre, description..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("query")?.toString()}
                />
            </div>
            <div className="flex-1">
                <label htmlFor="company" className="sr-only">
                    Entreprise
                </label>
                <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Entreprise..."
                    onChange={(e) => handleCompany(e.target.value)}
                    defaultValue={searchParams.get("company")?.toString()}
                />
            </div>
            <div className="w-full md:w-48">
                <label htmlFor="sort" className="sr-only">
                    Trier par
                </label>
                <select
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] px-4 text-sm outline-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => handleSort(e.target.value)}
                    defaultValue={searchParams.get("sort")?.toString() || "desc"}
                >
                    <option value="desc">Plus récent</option>
                    <option value="asc">Plus ancien</option>
                </select>
            </div>
            <button
                onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (params.get("favorites") === "true") {
                        params.delete("favorites");
                    } else {
                        params.set("favorites", "true");
                    }
                    replace(`/?${params.toString()}`);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${searchParams.get("favorites") === "true"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
            >
                {searchParams.get("favorites") === "true" ? "Voir tout" : "❤️ Mes Favoris"}
            </button>
        </div>
    );
}
