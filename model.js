const { promises } = require("supertest/lib/test")
const db = require("./db/connection")



exports.selectTopics = () => {
    return db.query("SELECT * FROM topics").then(({rows}) =>{
        return rows
    })
}

exports.selectArticleById = (id) =>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[id]).then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Not found"
            })
        }
        return rows[0]
    })
}

exports.selectArticles = () =>{
   const getArticles = () =>{ return db.query(`SELECT * FROM articles ORDER BY created_at DESC`).then(({rows}) =>{
            rows.forEach((article) =>{
            article.comment_count = 0
            delete article.body
        })
        return rows
    })
}
    const getComments = () =>{ return db.query('SELECT * FROM comments').then(({rows}) => { 
        return rows
    })
    }
   return Promise.all([getArticles(),getComments()]).then((articlesAndComments)=>{

        articlesAndComments[1].forEach((comment)=>{
            articlesAndComments[0].forEach((article)=>{
                let commentCount = 0 
                if(comment.article_id === article.article_id){
                    article.comment_count += 1
                }
            })
        })
        return(articlesAndComments[0])
    })
}


exports.selectArticleComments =  (id) =>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,[id]).then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Not found"
            })
        }
    
        return rows
    })
    

}



    
      

