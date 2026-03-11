const express = require("express");
const app = express();

app.use(express.json());

// In-memory storage: key = user identifier, value = data
const table = {};

// POST /data
// Body: { id: "username", value: "some data" }
app.post("/data", (req, res) => {
    const { id, value } = req.body;

    if (!id || value === undefined) {
        return res.status(400).json({ error: "Missing id or value in POST body" });
    }

    table[id] = value; // store data under the username/id
    console.log(`Received POST from ${id}:`, value);

    res.json({ status: "received", storedFor: id, stored: value });
});

// GET /data
// Query param: ?id=username
// Returns the data for that username and clears it
app.get("/data", (req, res) => {
    const id = req.query.id; // get the identifier from query

    if (!id) {
        return res.status(400).json({ error: "Missing id in query" });
    }

    if (table[id]) {
        const dataToSend = table[id];
        delete table[id]; // clear data after sending
        res.json({ data: dataToSend });
    } else {
        // Send an empty response if nothing is stored for that id
        res.status(200).end();
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
