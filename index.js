const express = require("express");
const app = express();

// Middleware to parse JSON in POST requests
app.use(express.json());

// In-memory storage for the last POST data
let lastData = null;

// POST route to save data
app.post("/data", (req, res) => {
    lastData = req.body;  // store the latest POSTed data
    console.log("Received POST:", lastData);
    res.json({ status: "received", savedData: lastData });
});

// GET route to retrieve the last posted data
app.get("/data", (req, res) => {
    if (lastData) {
        res.json({ status: "ok", lastData: lastData });
    } else {
        res.json({ status: "empty", message: "No data has been posted yet" });
    }
});

// Listen on the port Render provides
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
