const express = require("express");
const app = express();

app.use(express.json());

// In-memory storage: key = client IP, value = data
const table = {};

// POST /data
// Body: { value: "some data" }
app.post("/data", (req, res) => {
    const clientIp = req.ip; // automatically gets the client IP
    const { value } = req.body;

    if (value === undefined) {
        return res.status(400).json({ error: "Missing value in POST body" });
    }

    table[clientIp] = value; // store data by IP
    console.log(`Received POST from ${clientIp}:`, value);

    res.json({ status: "received", yourIp: clientIp, stored: value });
});

// GET /data
// Returns the data associated with the client’s IP, then clears it
app.get("/data", (req, res) => {
    const clientIp = req.ip;

    if (table[clientIp]) {
        const dataToSend = table[clientIp];
        delete table[clientIp]; // clear data after sending
        res.json({ data: dataToSend });
    } else {
        // Send an empty response (HTTP 200 with no content)
        res.status(200).end();
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
