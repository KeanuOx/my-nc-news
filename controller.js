const { selectTopics, selectArticleById, selectArticles, selectArticleComments } = require("./model")
const checkArticleExists = require("./db/seeds/utils")


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) =>{
        res.status(200).send({topics})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticleById = (req, res ,next) =>{
    const {article_id} = req.params

    selectArticleById(article_id).then((article) =>{
        res.status(200).send({article})
    })
    .catch(next)

}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles)=>{
        res.status(200).send({articles})

    })
    .catch(next)
}

exports.getArticleComments = (req, res, next) =>{
   const {article_id} = req.params
   selectArticleComments(article_id).then((comments) =>{
    console.log(comments)
    res.status(200).send((comments))
   })
   .catch(next)
    

}