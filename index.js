const express = require("express");
const app = express();

app.use(express.json());

// storage
const dataTable = {};
const requests = {};
const responses = {};

// -------------------------
// SEND CONNECTION REQUEST
// -------------------------
// { from: "alice", to: "bob" }
app.post("/connect", (req, res) => {
    const { from, to } = req.body;

    if (!from || !to) {
        return res.status(400).json({ error: "Missing from or to" });
    }

    requests[to] = from;

    console.log(`${from} wants to connect to ${to}`);

    res.json({ status: "request_sent" });
});


// -------------------------
// CLIENT CHECKS IF SOMEONE WANTS TO CONNECT
// -------------------------
// GET /request?id=bob
app.get("/request", (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }

    if (requests[id]) {
        const from = requests[id];
        delete requests[id];

        res.json({ from });
    } else {
        res.status(200).end();
    }
});


// -------------------------
// CLIENT SENDS ALLOW / DENY
// -------------------------
// { from:"bob", to:"alice", allow:true }
app.post("/response", (req, res) => {
    const { from, to, allow } = req.body;

    if (!from || !to || allow === undefined) {
        return res.status(400).json({ error: "Missing fields" });
    }

    responses[to] = {
        from,
        allow
    };

    console.log(`${from} responded to ${to}: ${allow}`);

    res.json({ status: "response_saved" });
});


// -------------------------
// REQUESTER CHECKS RESPONSE
// -------------------------
// GET /response?id=alice
app.get("/response", (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }

    if (responses[id]) {
        const r = responses[id];
        delete responses[id];

        res.json(r);
    } else {
        res.status(200).end();
    }
});


// -------------------------
// YOUR ORIGINAL DATA SYSTEM
// -------------------------
app.post("/data", (req, res) => {
    const { id, value } = req.body;

    if (!id || value === undefined) {
        return res.status(400).json({ error: "Missing id or value" });
    }

    dataTable[id] = value;

    console.log(`Received POST from ${id}:`, value);

    res.json({ status: "received" });
});

app.get("/data", (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: "Missing id" });
    }

    if (dataTable[id]) {
        const data = dataTable[id];
        delete dataTable[id];
        res.json({ data });
    } else {
        res.status(200).end();
    }
});


// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
