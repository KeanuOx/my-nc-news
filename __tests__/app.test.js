const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const sort = require("jest-sorted")


/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of all the topics including slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.topics).toEqual(data.topicData)
      })
  })
})
describe("GET /api/articles/:article_id", () =>{
  test("200: Responds with the correct article object with all the correct properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      const article = body.article
      expect(article.article_id).toBe(1)
      expect(article.title).toBe(data.articleData[0].title)
      expect(article.topic).toBe(data.articleData[0].topic)
      expect(article.author).toBe(data.articleData[0].author)
      expect(article.body).toBe(data.articleData[0].body)
      expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
      expect(article.votes).toBe(data.articleData[0].votes)
      expect(article.article_img_url).toBe(data.articleData[0].article_img_url)
     })
  })
  test("400: Responds with an error message when the article id is invalid", () =>{
    return request(app)
    .get("/api/articles/invalid_id")
    .expect(400)
    .then(({body}) => {
      const error = body
      expect(error.msg).toEqual("Bad Request")
    })
  })
  test("404: Responds with an error message when the article provided doesn't exist", () =>{
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({body}) =>{
      const error = body
      expect(error.msg).toBe("Not found")
    })
  })
  })

describe("GET /api/articles", ()=>{
  test("200: Responds with an array of all the articles with all the correct properties, sorted by the date created in descending order", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) =>{
      const articles = body.articles
      expect(articles).toHaveLength(13)
      articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        })
        expect(article).not.toHaveProperty("body")
      })
      expect(articles).toBeSortedBy("created_at", { descending: true, })
    })
  })
})
describe("GET /api/articles/:article_id/comments", () =>{
  test("200: Responds with an array of all the comments for one article", () =>{
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({body}) =>{
      const comments = body
      expect(comments.length).toBe(2)
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number)

        })

      })
      expect(comments).toBeSortedBy("created_at", { descending: true, })

    })
    
  })
  test("400: Responds with an error message when the article id is invalid", () =>{
    return request(app)
    .get("/api/articles/invalid_id/comments")
    .expect(400)
    .then(({body}) => {
      const error = body
      expect(error.msg).toEqual("Bad Request")
    })
  })
  test("404: Responds with an error message when the article provided doesn't exist", () =>{
    return request(app)
    .get("/api/articles/999/comments")
    .expect(404)
    .then(({body}) =>{
      const error = body
      expect(error.msg).toBe("Not Found")
    })
  })
})
describe("POST /api/articles/:article_id/comments", () =>{
  test("201: Adds a comment to an article and responds with the new comment", ()=>{
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({_body}) =>{
      const comment = _body
      
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        article_id: 1,
        author: "butter_bridge",
        body: "This is a test comment",
        votes: 0,
        created_at: expect.any(String),
      });
    })
  })
  test("400: Responds with an error when the username is missing", () => {
    const incompleteComment = {
      body: "This is a test comment without a username",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(incompleteComment)
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe("Bad Request");
      })
  });
  test("400: Responds with an error when the body is missing", () => {
    const incompleteComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(incompleteComment)
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe("Bad Request");
      })
  });
  test("400: Responds with an error message when the article id is invalid", () =>{
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
    .post("/api/articles/invalid_id/comments")
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      const error = body
      expect(error.msg).toEqual("Bad Request")
    })
  })

  test("404: Responds with an error when the article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
  
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
})

describe("PATCH /api/articles/:article_id", () =>{
  test("200: Updates votes for the article and responds with the updated article", () => {
    const newVote = { inc_votes: 10 };
  
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({body}) => {
        const article  = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with an error when `inc_votes` is missing", () => {
    const invalidVote = {};
  
    return request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when body is not a number", () => {
    const invalidVote = { inc_votes: "not-a-number" };
  
    return request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when article_id is invalid", () => {
    const newVote = { inc_votes: 5 };
  
    return request(app)
      .patch("/api/articles/not-a-number")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error when article_id does not exist", () => {
    const newVote = { inc_votes: 5 };
  
    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
})
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Successfully deletes the comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1") 
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });

  test("404: Responds with an error when the comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });

  test("400: Responds with an error when the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});













describe("Not found error", () =>{
  test("404: responds with not found when the given path isn't available", () => {
    return request(app)
    .get("/api/invalid-endpoint")
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({msg: "Not found"})
    })
  });
})



