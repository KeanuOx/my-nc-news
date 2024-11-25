const express = require("express")
const endpoint = require("./endpoints.json")
app = express()

app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpoint})
})












module.exports= app