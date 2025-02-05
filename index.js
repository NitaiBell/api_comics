import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { fetchHeroesInRange } from "./search.js"; // Import function to fetch heroes in range

const app = express();
const PORT = 3000;
const API_KEY = "bd680408b6b73cc68c410550a403ae836139a6f5";

// ✅ Fix: Define `__dirname` manually
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (optional, for CSS, images, etc.)
app.use(express.static("public"));

// 🏠 Home route (renders the form)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/form.html"); // Ensure form.html exists
});

// 🔍 Handle form submission and fetch superhero data
app.post("/search", async (req, res) => {
    const heroId = req.body.heroId.trim(); // Trim input

    // ✅ Ensure heroId is a valid number
    if (!heroId || isNaN(heroId)) {
        return res.status(400).send("❌ Invalid ID! Please enter a valid number.");
    }

    try {
        // Fetch superhero data from the API
        const response = await axios.get("https://comicvine.gamespot.com/api/characters/", {
            params: {
                api_key: API_KEY,
                format: "json",
                field_list: "id,name,image,publisher",
                filter: `id:${heroId}`
            }
        });

        // ✅ Ensure the API response is valid
        const heroes = response.data.results || [];

        if (heroes.length === 0) {
            return res.send("⚠ No superhero found with this ID!");
        }

        const hero = heroes[0]; // First result

        // Render the `index.ejs` template with superhero data
        res.render("index", { hero });
    } catch (error) {
        console.error("❌ Error fetching superhero data:", error.message);
        res.status(500).send("⚠ Error fetching superhero data. Please try again.");
    }
});

// 🔍 Fetch all superheroes between ID 1200-1800

/*app.get("/fetch-heroes", async (req, res) => {
    try {
        const heroes = await fetchHeroesInRange(1200, 1800);

        // Extract only the IDs from the hero list
        const heroIds = heroes.map(hero => hero.id);

        res.json({ 
            count: heroes.length, 
            heroes, // Keep the full hero data
            heroIds // Add an array of IDs at the bottom
        });
    } catch (error) {
        console.error("❌ Error fetching heroes:", error.message);
        res.status(500).json({ error: "⚠ Error fetching superhero list." });
    }
});*/


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

