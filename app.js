const express = require("express")
const endpoint = require("./endpoints.json")
const { getTopics } = require("./controller.js")
app = express()
const {
    handleCustomErrors,
    handleServerErrors
  } = require("./errors.js");


app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpoint})
})

app.get("/api/topics", getTopics)






app.all('/*', (req,res) =>{
    res.status(404).send({ msg: 'Route not found'})
})


app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports= app