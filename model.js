const db = require("./db/connection")


exports.selectTopics = () => {
    return db.query("SELECT * FROM topics").then(({rows}) =>{
        return rows
    })
}

exports.selectArticleById = (id) =>{
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`).then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Couldn't find article"
            })
        }
        return rows[0]
    })
}