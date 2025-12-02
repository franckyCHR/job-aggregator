import { PrismaClient } from "@prisma/client";
import SearchFilters from "@/components/SearchFilters";
import JobCard from "@/components/JobCard";
import ThemeToggle from "@/components/ThemeToggle";
import FavoritesList from "@/components/FavoritesList";

const prisma = new PrismaClient();

async function getJobs(query?: string, company?: string, sort: 'asc' | 'desc' = 'desc') {
    try {
        const where: any = {};

        if (query) {
            where.OR = [
                { title: { contains: query } },
                { description: { contains: query } },
            ];
        }

        if (company) {
            where.company = { contains: company };
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { datePosted: sort },
        });
        return jobs;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

export default async function Home({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        company?: string;
        sort?: 'asc' | 'desc';
        favorites?: string;
    };
}) {
    const query = searchParams?.query || "";
    const company = searchParams?.company || "";
    const sort = (searchParams?.sort === 'asc' ? 'asc' : 'desc');
    const showFavorites = searchParams?.favorites === 'true';

    const jobs = await getJobs(query, company, sort);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Offres d'Emploi ESN
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Île-de-France • Analyste d'Exploitation
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                <SearchFilters />
            </header>

            {showFavorites ? (
                <>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                        <span className="mr-2">❤️</span> Mes Favoris
                    </h2>
                    <FavoritesList />
                </>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <p className="text-xl text-gray-500 font-medium">Aucune offre trouvée.</p>
                            <p className="text-gray-400 mt-2">Essayez de modifier vos filtres de recherche.</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
