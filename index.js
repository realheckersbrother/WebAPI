const express = require("express");
const cors = require("cors");
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

let url = "";

async function getapi() {
    console.log("Getting new api")
    try {
        const res = await fetch(`https://raw.githubusercontent.com/realheckersbrother/WebAPI/main/API.txt?t=${Date.now()}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!res.ok) throw new Error(`GitHub responded with status ${res.status}`);
        
        const textData = await res.text();
        const newUrl = textData.trim();
        
        if (newUrl !== url) {
            url = newUrl;
            console.log(`Url updated: ${url}`);
        }
    } catch (err) {
        console.error("Failed to get url:", err.message);
    }
}

app.get("/", (req, res) => {
    res.send("Existing: /beautify");
});

app.post("/beautify", async (req, res) => {
    const code = req.body.code;
    if (!code) return res.status(400).send("No code provided");

    await getapi();

    if (!url) {
        return res.status(500).json({ 
            error: "Unknown error", 
            details: "No url??" 
        });
    }

    try {
        const response = await fetch(`${url}/beautify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "request failed", details: err.message });
    }
});

async function start() {
    await getapi();
    
    app.listen(port, () => {
        console.log(`Luau beautifier running on port ${port}`);
    });
}

start();
