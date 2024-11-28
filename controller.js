const { selectTopics, selectArticleById, selectArticles, selectArticleComments, insertComment, updateArticleVotes } = require("./model")
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
    res.status(200).send((comments))
   })
   .catch(next)
}

exports.postNewComment = (req, res, next) =>{
    const {article_id} = req.params
    const { username, body } = req.body
    if (!username || !body) {
        return next({ status: 400, msg: "Bad Request" });
      }
    insertComment(article_id, username, body).then((newComment) =>{
        res.status(201).send(newComment)
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) =>{
    const {article_id} = req.params
    const {inc_votes} = req.body
    if (!inc_votes) {
        return next({status: 400, msg: "Bad Request"})
    }
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send(updatedArticle);
        })
        .catch(next);

}