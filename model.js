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
return db.query(`SELECT 
    articles.article_id,
    articles.title,
    articles.author,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::int AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;
`).then(({rows})=>{
    return rows
})
}

exports.selectArticleComments =  (article_id) =>{
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articleCheck) => {
      if (articleCheck.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    
    
      return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,[article_id]).then(({rows}) =>{
        return rows
        })
    })
    
    }

exports.insertComment = (article_id, username, body) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articleCheck) => {
      if (articleCheck.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      
      return db.query(
        `
        INSERT INTO comments
        (article_id, author, body, votes, created_at)
        VALUES ($1, $2, $3, 0, NOW())
        RETURNING *;
        `,
        [article_id, username, body]
      );
    })
    .then(({rows}) => {
      return rows[0];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
};

    
      

