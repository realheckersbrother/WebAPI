const express = require("express");
const app = express();
const port = 3002;

app.use(express.json());

let API_URL = "";

async function loadUrl() {
    const res = await fetch(
        "https://raw.githubusercontent.com/realheckersbrother/WebAPI/main/API.txt"
    );
    API_URL = (await res.text()).trim();
}

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

async function startServer() {
    try {
        await loadUrl();
        console.log(`[+] API URL loaded: ${API_URL}`);
        
        app.listen(port, () => {
            console.log(`Luau API running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to load initial API URL from GitHub:", err);
    }
}

startServer();
