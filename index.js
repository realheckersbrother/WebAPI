const express = require("express");
const app = express();
const port = 3002;
let API_URL = "https://periodic-lightbox-this-levels.trycloudflare.com";

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Existing: /beautify");
});

app.post("/beautify", async (req, res) => {
    const code = req.body.code;
    if (!code) return res.status(400).send("No code");

    try {
        const response = await fetch(`${API_URL}/beautify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "API request failed", details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Luau API running on port ${port}`);
});
