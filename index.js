// index.js
const express = require("express");
const app = express();

// This allows your server to read JSON from POST requests
app.use(express.json());

// Test GET request at root
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Test POST request at /data
app.post("/data", (req, res) => {
  console.log("Received POST:", req.body);
  res.json({ status: "received", yourData: req.body });
});

// Listen on the port Render gives us
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
