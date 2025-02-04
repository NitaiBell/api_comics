import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

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
    res.sendFile(__dirname + "/public/form.html"); // Now `__dirname` is properly defined
});

// 🔍 Handle form submission and fetch superhero data
app.post("/search", async (req, res) => {
    const heroId = req.body.heroId; // Get the ID from the form

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

        // Extract superhero details
        const hero = response.data.results[0]; // First result

        if (!hero) {
            return res.send("No superhero found!");
        }

        // Render the `index.ejs` template with superhero data
        res.render("index", { hero });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send("Error fetching superhero data");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

