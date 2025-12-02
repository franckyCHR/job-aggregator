import axios from "axios";
import * as cheerio from "cheerio";

async function discover() {
    const url = "https://www.hellowork.com/fr-fr/emploi/recherche.html?k=Analyste+d%27exploitation&l=Ile-de-France";
    console.log(`Fetching ${url}...`);

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        const $ = cheerio.load(response.data);

        // Essayer de trouver des éléments qui ressemblent à des offres
        // On cherche des liens qui contiennent "emplois" dans le href
        const jobLinks = $("a[href*='/emplois/']");

        console.log(`Found ${jobLinks.length} potential job links.`);

        if (jobLinks.length > 0) {
            const firstJob = jobLinks.first();
            console.log("First job link structure:");
            console.log("HREF:", firstJob.attr("href"));
            console.log("Text:", firstJob.text().trim());
            console.log("Parent classes:", firstJob.parent().attr("class"));
            console.log("Grandparent classes:", firstJob.parent().parent().attr("class"));

            // Chercher le conteneur de l'offre
            const card = firstJob.closest("li") || firstJob.closest("div");
            if (card) {
                console.log("Potential card container tag:", card.prop("tagName"));
                console.log("Potential card container class:", card.attr("class"));
                // Afficher un peu de HTML pour analyser
                console.log("HTML snippet:", card.html()?.substring(0, 500));
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

discover();
