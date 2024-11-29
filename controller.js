const { selectTopics, selectArticleById, selectArticles, selectArticleComments, insertComment, updateArticleVotes, removeComment, selectUsers } = require("./model")



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
    const { sort_by, order } = req.query
    selectArticles(sort_by, order).then((articles)=>{
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
    insertComment(article_id, username, body).then((newComment) =>{
        res.status(201).send(newComment)
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) =>{
    const {article_id} = req.params
    const {inc_votes} = req.body
    
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send(updatedArticle);
        })
        .catch(next);

}

exports.deleteComment = (req, res, next) =>{
    const {comment_id} = req.params
    removeComment(comment_id)
    .then(()=>{
        res.status(204).send({})
    })
    .catch(next)
}   


exports.getUsers = (req, res, next) =>{
    selectUsers()
    .then((users)=>{
        res.status(200).send(users)
    })
    .catch(next)
}