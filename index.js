const express = require("express");
const app = express();
const port = 3002;

app.use(express.json());

let url = "";

async function getapi() {
    const res = await fetch("https://raw.githubusercontent.com/realheckersbrother/WebAPI/main/API.txt");
    url = (await res.text()).trim();
}

app.get("/", (req, res) => {
    res.send("Existing: /beautify");
});

app.post("/beautify", async (req, res) => {
    const code = req.body.code;
    if (!code) return res.status(400).send("No code");

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
        console.log(`Luau API running on port ${port}`);
    });
}

start();
