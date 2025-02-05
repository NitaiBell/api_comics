import axios from "axios";

const API_KEY = "bd680408b6b73cc68c410550a403ae836139a6f5";
const BASE_URL = "https://comicvine.gamespot.com/api/characters/";

export async function fetchHeroesInRange(startId = 1200, endId = 1800) {
    let heroes = [];
    let offset = 0;
    const limit = 100; // Fetch 100 per API call

    try {
        while (true) {
            console.log(`Fetching superheroes... Offset: ${offset}`);

            const response = await axios.get(BASE_URL, {
                params: {
                    api_key: API_KEY,
                    format: "json",
                    field_list: "id,name,image,publisher,gender",
                    limit: limit,
                    offset: offset,
                    sort: "id:asc" // Ensure results are sorted by ID
                }
            });

            const results = response.data.results;

            if (!results || results.length === 0) {
                console.log("No more results. Stopping fetch.");
                break; // Stop when no more data is available
            }

            // Filter results within the ID range (1200-1800)
            const filteredHeroes = results.filter(hero => hero.id >= startId && hero.id <= endId);
            heroes = heroes.concat(filteredHeroes);

            // Stop fetching if the last hero's ID is beyond our range
            if (results[results.length - 1].id > endId) {
                console.log("Reached the end of range. Stopping fetch.");
                break;
            }

            offset += limit; // Move to the next batch
        }

        console.log(`✅ Found ${heroes.length} superheroes between ${startId} and ${endId}`);
        return heroes; // Return the filtered list
    } catch (error) {
        console.error("❌ Error fetching superheroes:", error.message);
        return [];
    }
}
