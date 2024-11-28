const express = require("express")
const endpoint = require("./endpoints.json")
const { getTopics, getArticleById, getArticles, getArticleComments, postNewComment, patchArticle, deleteComment } = require("./controller.js")
app = express()
const {
    handleCustomErrors,
    handleServerErrors,
    handlePSQLErrors
  } = require("./errors.js");

app.use(express.json());


app.get("/api", (req, res) => {
    res.status(200).send({endpoints: endpoint})
})

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postNewComment)

app.patch("/api/articles/:article_id/", patchArticle)

app.delete("/api/comments/:comment_id", deleteComment)


app.all('/*', (req,res) =>{
    res.status(404).send({ msg: 'Not found'})
})



app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);



module.exports= app