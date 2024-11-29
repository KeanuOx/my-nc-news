const db = require("./db/connection")



exports.selectTopics = () => {
    return db.query("SELECT * FROM topics").then(({rows}) =>{
        return rows
    })
}

exports.selectArticleById = (id) => {
  return db
    .query(
      `
      SELECT
        articles.article_id,
        articles.body,
        articles.title,
        articles.author,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::int AS comment_count 
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = ["article_id", "title", "author", "topic", "created_at", "votes", "article_img_url"];
  const validOrder = ["asc", "desc"];
  const queryValues = [];
  let sqlQuery = `
      SELECT 
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
  `;

  if (topic) {
      sqlQuery += `WHERE articles.topic = $1 `;
      queryValues.push(topic);
  }

  if (!validSortBy.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!validOrder.includes(order)) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  sqlQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
      if (topic && rows.length === 0) {
          return db
              .query("SELECT * FROM topics WHERE slug = $1", [topic])
              .then(({ rows }) => {
                  if (rows.length === 0) {
                      return Promise.reject({ status: 404, msg: "Not Found" });
                  }
                  return []
              });
      }
      return rows;
  });
};

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
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
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
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" })
}
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


exports.removeComment = (comment_id) => {
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
      `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return {};
    });
};

exports.selectUsers = () =>{
  return db.query(`SELECT * FROM users`)
  .then(({rows}) =>{
    return rows
  })
}
      

