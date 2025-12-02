import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

interface JobData {
    title: string;
    company: string;
    location: string;
    url: string;
    datePosted: Date;
    source: string;
    description?: string;
}

async function scrapeHelloWork(): Promise<JobData[]> {
    console.log("Scraping HelloWork...");
    const url = "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=Analyste+d%27exploitation&l=Ile-de-France";

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        const $ = cheerio.load(response.data);
        const jobs: JobData[] = [];

        $("div[data-id-storage-target='item']").each((_, element) => {
            const card = $(element);
            const linkElement = card.find("a[href*='/emplois/']").first();

            if (linkElement.length > 0) {
                const href = linkElement.attr("href");
                const fullUrl = href?.startsWith("http") ? href : `https://www.hellowork.com${href}`;

                // Extraction du texte: "Titre du poste\nEntreprise"
                const textContent = linkElement.text().trim();
                const parts = textContent.split("\n").map(s => s.trim()).filter(s => s.length > 0);

                const title = parts[0] || "Titre inconnu";
                const company = parts[1] || "Entreprise inconnue";

                // Essayer de trouver la localisation (souvent dans un span ou div à côté)
                // Pour l'instant on met Ile-de-France par défaut car c'est le filtre
                const location = "Île-de-France";

                jobs.push({
                    title,
                    company,
                    location,
                    url: fullUrl || "",
                    datePosted: new Date(), // Date du jour par défaut
                    source: "HelloWork",
                    description: "Voir l'offre sur le site"
                });
            }
        });

        return jobs;
    } catch (error) {
        console.error("Error scraping HelloWork:", error);
        return [];
    }
}

async function main() {
    console.log("Starting scrape job...");

    try {
        const jobs = await scrapeHelloWork();

        console.log(`Found ${jobs.length} jobs. Saving to database...`);

        for (const job of jobs) {
            // On utilise l'URL comme clé unique pour éviter les doublons
            await prisma.job.upsert({
                where: { url: job.url },
                update: {
                    // On met à jour si besoin, mais on garde la date originale si possible
                    // Ici on update tout pour l'exemple
                    title: job.title,
                    company: job.company,
                },
                create: {
                    ...job
                },
            });
        }

        console.log("Scraping completed successfully.");
    } catch (error) {
        console.error("Error during scraping:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
